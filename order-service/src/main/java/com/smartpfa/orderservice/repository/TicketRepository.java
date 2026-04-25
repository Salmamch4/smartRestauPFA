package com.smartpfa.orderservice.repository;

import com.smartpfa.orderservice.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // 🔥 filtre اليوم
    List<Ticket> findByDateBetween(LocalDateTime start, LocalDateTime end);

    // 🔥 filtre serveur + اليوم
    List<Ticket> findByServeurAndDateBetween(String serveur, LocalDateTime start, LocalDateTime end);

	List<Ticket> findByDateAfter(LocalDateTime lastClearTime);
}