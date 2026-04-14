package com.smartpfa.orderservice.controller;

import com.smartpfa.orderservice.dto.ticket.ClientTicketDTO;
import com.smartpfa.orderservice.entity.Ticket;
import com.smartpfa.orderservice.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin("*")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    // ✅ CREATE
    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        return service.createTicket(ticket);
    }

    // ✅ GET ALL
    @GetMapping
    public List<Ticket> all() {
        return service.getAll();
    }

    // ✅ CLIENT
    @GetMapping("/{id}")
    public ClientTicketDTO clientTicket(@PathVariable Long id,
                                        @RequestParam(defaultValue = "false") boolean copie) {
        return service.getClientTicket(id, copie);
    }

    // ✅ SERVEUR
    @GetMapping("/serveur/{serveur}")
    public List<Ticket> serveur(@PathVariable String serveur) {
        return service.getServeurTickets(serveur);
    }

    // ✅ SERVEUR TOTAL
    @GetMapping("/serveur/{serveur}/total")
    public double serveurTotal(@PathVariable String serveur) {
        return service.getServeurTotal(serveur);
    }

    // ✅ ADMIN
    @GetMapping("/admin")
    public List<Ticket> admin() {
        return service.getAdminTickets();
    }

    // ✅ ADMIN TOTAL
    @GetMapping("/admin/total")
    public double adminTotal() {
        return service.getAdminTotal();
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Ticket update(@PathVariable Long id, @RequestBody Ticket ticket) {
        return service.update(id, ticket);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}