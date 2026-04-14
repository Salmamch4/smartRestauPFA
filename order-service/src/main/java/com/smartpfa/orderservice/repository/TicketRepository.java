package com.smartpfa.orderservice.repository;

import com.smartpfa.orderservice.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // ✅ tickets dyal nhar (admin)
    List<Ticket> findByDate(LocalDate date);

    // ✅ tickets dyal serveur f nhar
    List<Ticket> findByServeurAndDate(String serveur, LocalDate date);
}