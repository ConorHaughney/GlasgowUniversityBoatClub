package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findByStripeSessionId(String stripeSessionId);
    Order findByPaymentIntentId(String paymentIntentId);
    List<Order> findAllByOrderByCreatedAtDesc();
}