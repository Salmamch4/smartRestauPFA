package com.smartpfa.orderservice.service;

import com.smartpfa.orderservice.dto.ticket.ClientTicketDTO;
import com.smartpfa.orderservice.entity.Ticket;
import com.smartpfa.orderservice.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository repo;

    public TicketServiceImpl(TicketRepository repo) {
        this.repo = repo;
    }

    @Override
    public Ticket createTicket(Ticket ticket) {
        ticket.setTotal(ticket.getPrix() * ticket.getQuantite());
        ticket.setDate(LocalDate.now());
        return repo.save(ticket);
    }

    @Override
    public List<Ticket> getAll() {
        return repo.findAll();
    }

    @Override
    public ClientTicketDTO getClientTicket(Long id, boolean copie) {
        Ticket t = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ClientTicketDTO dto = new ClientTicketDTO();
        dto.setProduit(t.getProduit());
        dto.setPrix(t.getPrix());
        dto.setQuantite(t.getQuantite());
        dto.setTotal(t.getTotal());
        dto.setCopie(copie);

        return dto;
    }

    @Override
    public List<Ticket> getServeurTickets(String serveur) {
        return repo.findByServeurAndDate(serveur, LocalDate.now());
    }

    @Override
    public double getServeurTotal(String serveur) {
        return repo.findByServeurAndDate(serveur, LocalDate.now())
                .stream()
                .mapToDouble(Ticket::getTotal)
                .sum();
    }

    @Override
    public List<Ticket> getAdminTickets() {
        return repo.findByDate(LocalDate.now());
    }

    @Override
    public double getAdminTotal() {
        return repo.findByDate(LocalDate.now())
                .stream()
                .mapToDouble(Ticket::getTotal)
                .sum();
    }

    @Override
    public Ticket update(Long id, Ticket newTicket) {
        Ticket existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        existing.setProduit(newTicket.getProduit());
        existing.setPrix(newTicket.getPrix());
        existing.setQuantite(newTicket.getQuantite());
        existing.setServeur(newTicket.getServeur());
        existing.setTotal(existing.getPrix() * existing.getQuantite());

        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}