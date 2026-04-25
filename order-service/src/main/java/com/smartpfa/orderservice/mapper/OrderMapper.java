package com.smartpfa.orderservice.mapper;

import com.smartpfa.orderservice.dto.OrderItemRequest;
import com.smartpfa.orderservice.dto.OrderItemResponse;
import com.smartpfa.orderservice.dto.OrderRequest;
import com.smartpfa.orderservice.dto.OrderResponse;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class OrderMapper {

    // OrderItemRequest → OrderItem
    public OrderItem toItemEntity(OrderItemRequest request, Order order) {
        OrderItem item = new OrderItem();
        item.setProductName(request.getProductName());
        item.setPrice(request.getPrice());
        item.setQuantity(request.getQuantity());
        item.setItemStatus("VALIDE");
        item.setOrder(order);
        return item;
    }

    // OrderItem → OrderItemResponse
    public OrderItemResponse toItemResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setProductName(item.getProductName());
        response.setPrice(item.getPrice());
        response.setQuantity(item.getQuantity());
        response.setItemStatus(item.getItemStatus());
        return response;
    }

    // OrderRequest → Order
    public Order toEntity(OrderRequest request) {
        Order order = new Order();
        order.setClientName(request.getClientName());
        order.setServerName(request.getServerName());
        order.setTableNumber(request.getTableNumber());
        return order;
    }

    // Order → OrderResponse
    public OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setClientName(order.getClientName());
        response.setServerName(order.getServerName());
        response.setTableNumber(order.getTableNumber());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        response.setItems(
                order.getItems()
                        .stream()
                        .map(this::toItemResponse)
                        .collect(Collectors.toList())
        );
        return response;
    }
}