package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CheckoutDto.CheckoutItem;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.dto.CheckoutDto.CheckoutRequest;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.MerchItem;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.MerchItemRepository;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import jakarta.annotation.PostConstruct;

@Service
public class StripeService {

    @Value("${stripe.api.key:}")
    private String stripeApiKey;

    @Value("${frontend.url}")
    private String frontendUrl;

    private final MerchItemRepository merchItemRepository;

    public StripeService(MerchItemRepository merchItemRepository) {
        this.merchItemRepository = merchItemRepository;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public String createCheckoutSession(CheckoutRequest request) throws Exception {
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for (CheckoutItem item : request.items()) {
            if ("Delivery".equalsIgnoreCase(item.name())) {
                lineItems.add(SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency("gbp")
                        .setUnitAmount(500L)
                        .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName("Delivery")
                            .build())
                        .build())
                    .build());
                continue;
            }

            MerchItem dbItem = merchItemRepository.findByName(item.name()).orElse(null);
            if (dbItem == null) continue;
            Long price = dbItem.getPrice();

            String productName = item.name() + (item.size() != null && !item.size().isEmpty() ? " (" + item.size() + ")" : "");

            lineItems.add(SessionCreateParams.LineItem.builder()
                .setQuantity((long) item.quantity())
                .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency("gbp")
                    .setUnitAmount(price)
                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(productName)
                        .build())
                    .build())
                .build());
        }

        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setUiMode(SessionCreateParams.UiMode.EMBEDDED)
            .setShippingAddressCollection(SessionCreateParams.ShippingAddressCollection.builder()
                .addAllowedCountry(SessionCreateParams.ShippingAddressCollection.AllowedCountry.GB)
                .build())
            .setReturnUrl(frontendUrl + "/merch?success=true&session_id={CHECKOUT_SESSION_ID}")
            .addAllLineItem(lineItems)
            .build();

        Session session = Session.create(params);
        return session.getClientSecret();
    }
}