package com.smartpfa.orderservice.repository.ticket;

import com.smartpfa.orderservice.entity.ticket.LigneTicket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LigneTicketRepository extends JpaRepository<LigneTicket, Long> {
}