package com.smartpfa.orderservice.service;

import com.smartpfa.orderservice.dto.ticket.ClientTicketDTO;
import com.smartpfa.orderservice.entity.Ticket;

import java.util.List;

public interface TicketService {

    Ticket createTicket(Ticket ticket);

    List<Ticket> getAll();

    ClientTicketDTO getClientTicket(Long id, boolean copie);

    List<Ticket> getServeurTickets(String serveur);

    double getServeurTotal(String serveur);

    List<Ticket> getAdminTickets();

    double getAdminTotal();

    Ticket update(Long id, Ticket newTicket);

    void delete(Long id);
}