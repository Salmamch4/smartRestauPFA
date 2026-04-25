package com.smartpfa.orderservice.repository.order;

import com.smartpfa.orderservice.entity.order.Order;
import java.util.List;
import java.util.UUID;

public interface IOrderRepository {

    Order save(Order order);

    Order findById(UUID id);

    List<Order> findAll();

    List<Order> findByTelephoneOrderByDateCommandeDesc(String telephone);

    List<Order> findByStatut(String statut);

    void deleteById(UUID id);

    boolean existsById(UUID id);
}