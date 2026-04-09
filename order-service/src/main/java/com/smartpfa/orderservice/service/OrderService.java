package com.smartpfa.orderservice.service;

import com.smartpfa.orderservice.entity.Order;
import com.smartpfa.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    // Récupérer toutes les commandes
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Récupérer une commande par ID
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
    }

    // Créer une commande
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    // Modifier une commande
    public Order updateOrder(Long id, Order order) {
        Order existing = getOrderById(id);
        existing.setClientName(order.getClientName());
        existing.setStatus(order.getStatus());
        return orderRepository.save(existing);
    }

    // Supprimer une commande
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}