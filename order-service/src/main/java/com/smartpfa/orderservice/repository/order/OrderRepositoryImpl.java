package com.smartpfa.orderservice.repository.order;

import com.smartpfa.orderservice.entity.order.Order;
import com.smartpfa.orderservice.repository.order.jpa.OrderJpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.UUID;

@Repository
public class OrderRepositoryImpl implements IOrderRepository {

    @Autowired
    private OrderJpaRepository jpaRepository;  // Spring Data JPA

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
        return jpaRepository.findByStatut(statut);
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

