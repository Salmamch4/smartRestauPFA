package com.smartpfa.orderservice.controller;

import com.smartpfa.orderservice.entity.ticket.Ticket;
import com.smartpfa.orderservice.service.ticket.TicketService;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        return service.createTicket(ticket);
    }

    @GetMapping
    public List<Ticket> getAll() {
        return service.getAll();
    }

    @GetMapping("/serveur/{name}")
    public List<Ticket> getByServeur(@PathVariable String name) {
        return service.getServeurTickets(name);
    }

    @GetMapping("/serveur/{name}/total")
    public double getServeurTotal(@PathVariable String name) {
        return service.getServeurTotal(name);
    }

    @GetMapping("/admin")
    public List<Ticket> getAdminTickets() {
        return service.getAdminTickets();
    }

    @GetMapping("/admin/total")
    public double getAdminTotal() {
        return service.getAdminTotal();
    }

    @PutMapping("/{id}")
    public Ticket update(@PathVariable Long id, @RequestBody Ticket ticket) {
        return service.update(id, ticket);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PostMapping("/admin/clear")
    public void clearAdmin() {
        service.clearSession();
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Ticket>> getTicketByOrderId(@PathVariable String orderId) {
        List<Ticket> tickets = service.getTicketByOrderId(orderId);
        if (tickets == null || tickets.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tickets);
    }
}