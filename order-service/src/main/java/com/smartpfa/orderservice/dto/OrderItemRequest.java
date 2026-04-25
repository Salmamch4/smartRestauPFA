package com.smartpfa.orderservice.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    private String productName;
    private Double price;
    private Integer quantity;
}