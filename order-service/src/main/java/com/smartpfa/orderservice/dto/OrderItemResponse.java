package com.smartpfa.orderservice.dto;

import lombok.Data;

@Data
public class OrderItemResponse {
    private Long id;
    private String productName;
    private Double price;
    private Integer quantity;
    private String itemStatus;
}