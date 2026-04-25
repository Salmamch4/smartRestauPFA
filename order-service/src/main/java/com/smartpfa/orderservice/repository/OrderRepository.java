package com.smartpfa.orderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

<<<<<<< HEAD
=======
import java.util.List;

@Repository
>>>>>>> 1dc615ab860c098c0c2e41e33129f822323f5571
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(String status);
}