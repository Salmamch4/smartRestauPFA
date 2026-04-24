package com.smartpfa.orderservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "order_items")
@Data
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private Double price;
    private Integer quantity;
    private String itemStatus; // VALIDE, INVALIDE

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}