package com.smartpfa.orderservice.repository.order;

import com.smartpfa.orderservice.entity.order.Order;
import com.smartpfa.orderservice.enums.OrderStatus;
import com.smartpfa.orderservice.repository.order.jpa.OrderJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public class OrderRepositoryImpl implements IOrderRepository {

    @Autowired
    private OrderJpaRepository jpaRepository;

    @Override
    public Order save(Order order) {
        return jpaRepository.save(order);
    }

    @Override
    public Order findById(UUID id) {
        return jpaRepository.findById(id).orElse(null);
    }

    @Override
    public List<Order> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public List<Order> findByTelephoneOrderByDateCommandeDesc(String telephone) {
        return jpaRepository.findByTelephoneOrderByDateCommandeDesc(telephone);
    }

    @Override
    public List<Order> findByStatut(String statut) {
        // Convertir String en OrderStatus
        try {
            OrderStatus status = OrderStatus.valueOf(statut);
            return jpaRepository.findByStatut(status);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid status: " + statut);
            return List.of();
        }
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaRepository.existsById(id);
    }
}