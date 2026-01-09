package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stripeSessionId;
    private String paymentIntentId;
    private String customerName;
    private String customerEmail;
    private Long totalAmount; // pence
    private String status; // PENDING, PAID, SHIPPED, DISPUTED
    private LocalDateTime createdAt;

    // Shipping Details
    private String shippingLine1;
    private String shippingLine2;
    private String shippingCity;
    private String shippingPostalCode;
    private String shippingCountry;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
}