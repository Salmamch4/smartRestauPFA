package com.smartpfa.orderservice.service.order;

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

    // Commandes par statut
    List<OrderResponseDTO> getPendingOrders();
    List<OrderResponseDTO> getConfirmedOrders();
    List<OrderResponseDTO> getInProgressOrders();
    List<OrderResponseDTO> getReadyOrders();
    List<OrderResponseDTO> getDeliveredOrders();
    List<OrderResponseDTO> getCancelledOrders();

    // Actions
    OrderResponseDTO confirmOrder(UUID id);
    OrderResponseDTO startOrder(UUID id);
    OrderResponseDTO completeOrder(UUID id);
    OrderResponseDTO deliverOrder(UUID id);
    OrderResponseDTO cancelOrder(UUID id);
    OrderResponseDTO invalidateItem(UUID id, Long itemId);
    OrderResponseDTO revalidateItem(UUID id, Long itemId);

}