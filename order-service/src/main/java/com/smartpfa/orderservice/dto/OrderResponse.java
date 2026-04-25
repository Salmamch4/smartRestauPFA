package com.smartpfa.orderservice.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String clientName;
    private String serverName;
    private Integer tableNumber;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}