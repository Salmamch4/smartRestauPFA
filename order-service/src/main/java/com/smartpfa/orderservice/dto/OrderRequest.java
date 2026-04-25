package com.smartpfa.orderservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String clientName;
    private String serverName;
    private Integer tableNumber;
    private List<OrderItemRequest> items;
}