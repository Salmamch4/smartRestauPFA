package com.smartpfa.orderservice.service.ticket;

import com.smartpfa.orderservice.entity.ticket.Ticket;
import java.util.List;

public interface TicketService {

    Ticket createTicket(Ticket ticket);
    List<Ticket> getAll();
    List<Ticket> getServeurTickets(String serveur);
    double getServeurTotal(String serveur);
    List<Ticket> getAdminTickets();
    double getAdminTotal();
    Ticket update(Long id, Ticket newTicket);
    void delete(Long id);
    void clearSession();

    // ✅ Modifier le type de retour: List<Ticket>
    List<Ticket> getTicketByOrderId(String orderId);
}