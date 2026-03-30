package com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.model.Order;
import com.glasgowuniversityrowing.glasgowuniversityrowingwebsite.repository.OrderRepository;

@RestController
@RequestMapping("/api/admin/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MERCH_MANAGE')")
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/{id}/ship")
    @PreAuthorize("hasAuthority('MERCH_MANAGE')")
    public ResponseEntity<?> markAsShipped(@PathVariable Long id) {
        return orderRepository.findById(id)
            .map(order -> {
                if ("PAID".equals(order.getStatus())) {
                    order.setStatus("SHIPPED");
                    return ResponseEntity.ok(orderRepository.save(order));
                }
                return ResponseEntity.badRequest().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}