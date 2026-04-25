package com.smartpfa.orderservice.repository;

import com.smartpfa.orderservice.entity.LigneTicket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LigneTicketRepository extends JpaRepository<LigneTicket, Long> {
}