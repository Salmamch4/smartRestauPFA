package com.smartpfa.orderservice.repository.order.jpa;

import com.smartpfa.orderservice.entity.order.Order;
import com.smartpfa.orderservice.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderJpaRepository extends JpaRepository<Order, UUID> {

    List<Order> findByTelephoneOrderByDateCommandeDesc(String telephone);

    // ✅ Changer pour accepter OrderStatus au lieu de String
    List<Order> findByStatut(OrderStatus statut);
}