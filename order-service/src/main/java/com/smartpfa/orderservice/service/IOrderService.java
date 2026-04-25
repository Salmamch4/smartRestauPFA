package com.smartpfa.orderservice.service;

import com.smartpfa.orderservice.dto.order.OrderRequestDTO;
import com.smartpfa.orderservice.dto.order.OrderResponseDTO;
import java.util.List;
import java.util.UUID;

public interface IOrderService {

    OrderResponseDTO createOrder(OrderRequestDTO request);

    List<OrderResponseDTO> getAllOrders();

    OrderResponseDTO getOrderById(UUID id);

    List<OrderResponseDTO> getOrdersByTelephone(String telephone);

    String generateOrderNumber();
}