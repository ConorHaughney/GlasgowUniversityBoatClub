package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.Order;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.OrderItem;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.model.Charge;
import com.stripe.model.Address;
import com.stripe.model.Dispute;
import com.stripe.model.Event;
import com.stripe.model.LineItem;
import com.stripe.model.LineItemCollection;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionListLineItemsParams;

@RestController
@RequestMapping("/api/webhooks")
public class StripeWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(StripeWebhookController.class);

    @Value("${stripe.webhook.secret:}")
    private String endpointSecret;

    @Value("${stripe.api.key:}")
    private String stripeApiKey;

    private final OrderRepository orderRepository;

    public StripeWebhookController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error: " + e.getMessage());
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
            if (session != null)
                handleCheckoutSessionCompleted(session);
        } else if ("checkout.session.async_payment_succeeded".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
            if (session != null)
                handleAsyncPaymentSucceeded(session);
        } else if ("charge.dispute.created".equals(event.getType())) {
            Dispute dispute = (Dispute) event.getDataObjectDeserializer().getObject().orElse(null);
            if (dispute != null)
                handleDisputeCreated(dispute);
        } else if ("charge.refunded".equals(event.getType())) {
            Charge charge = (Charge) event.getDataObjectDeserializer().getObject().orElse(null);
            if (charge != null)
                handleChargeRefunded(charge);
        }

        return ResponseEntity.ok("Received");
    }

    private void handleCheckoutSessionCompleted(Session session) {
        if (orderRepository.findByStripeSessionId(session.getId()) != null) {
            return; // Already processed
        }

        Stripe.apiKey = stripeApiKey; // Ensure API key is set for fetching line items

        Order order = new Order();
        order.setStripeSessionId(session.getId());
        order.setPaymentIntentId(session.getPaymentIntent());
        order.setCustomerName(session.getCustomerDetails().getName());
        order.setCustomerEmail(session.getCustomerDetails().getEmail());
        order.setTotalAmount(session.getAmountTotal());

        // Check if payment is actually paid or just pending (e.g. Bank Transfer)
        String paymentStatus = session.getPaymentStatus();
        order.setStatus("paid".equals(paymentStatus) ? "PAID" : "PENDING");
        order.setCreatedAt(LocalDateTime.now());

        if (session.getCustomerDetails() != null && session.getCustomerDetails().getAddress() != null) {
            Address address = session.getCustomerDetails().getAddress();
            order.setShippingLine1(address.getLine1());
            order.setShippingLine2(address.getLine2());
            order.setShippingCity(address.getCity());
            order.setShippingPostalCode(address.getPostalCode());
            order.setShippingCountry(address.getCountry());
        }

        List<OrderItem> items = new ArrayList<>();
        try {
            SessionListLineItemsParams params = SessionListLineItemsParams.builder().build();
            LineItemCollection lineItems = session.listLineItems(params);

            for (LineItem item : lineItems.getData()) {
                OrderItem orderItem = new OrderItem();
                orderItem.setProductName(item.getDescription()); // Contains "Name (Size)"
                orderItem.setQuantity(item.getQuantity().intValue());
                orderItem.setPrice(item.getAmountTotal() / item.getQuantity());
                orderItem.setOrder(order);
                items.add(orderItem);
            }
        } catch (Exception e) {
            logger.error("Error fetching line items for session {}: {}", session.getId(), e.getMessage());
        }

        order.setItems(items);
        orderRepository.save(order);
    }

    private void handleAsyncPaymentSucceeded(Session session) {
        Order order = orderRepository.findByStripeSessionId(session.getId());
        if (order != null && !"PAID".equals(order.getStatus())) {
            order.setStatus("PAID");
            orderRepository.save(order);
        }
    }

    private void handleDisputeCreated(Dispute dispute) {
        Order order = orderRepository.findByPaymentIntentId(dispute.getPaymentIntent());
        if (order != null) {
            order.setStatus("DISPUTED");
            orderRepository.save(order);
        }
    }

    private void handleChargeRefunded(Charge charge) {
        Order order = orderRepository.findByPaymentIntentId(charge.getPaymentIntent());
        if (order != null) {
            order.setStatus("REFUNDED");
            orderRepository.save(order);
        }
    }
}