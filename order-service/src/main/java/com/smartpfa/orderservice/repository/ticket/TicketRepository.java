package com.smartpfa.orderservice.repository.ticket;

import com.smartpfa.orderservice.entity.ticket.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByDateBetween(LocalDateTime start, LocalDateTime end);
    List<Ticket> findByServeurAndDateBetween(String serveur, LocalDateTime start, LocalDateTime end);
    List<Ticket> findByDateAfter(LocalDateTime lastClearTime);

    // ✅ Recherche par orderId
    List<Ticket> findByOrderId(String orderId);
}