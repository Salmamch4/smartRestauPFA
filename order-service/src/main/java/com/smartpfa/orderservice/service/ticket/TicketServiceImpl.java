package com.smartpfa.orderservice.service.ticket;

import com.smartpfa.orderservice.entity.ticket.LigneTicket;
import com.smartpfa.orderservice.entity.ticket.Ticket;
import com.smartpfa.orderservice.repository.ticket.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository repo;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String MENU_URL = "http://localhost:5160/api/produits/";
    private LocalDateTime lastClearTime = null;

    public TicketServiceImpl(TicketRepository repo) {
        this.repo = repo;
    }

    @Override
    public Ticket createTicket(Ticket ticket) {
        double totalTicket = 0;

        if (ticket.getLignes() == null || ticket.getLignes().isEmpty()) {
            throw new RuntimeException("Ticket vide !");
        }

        for (LigneTicket ligne : ticket.getLignes()) {
            ligne.setTicket(ticket);
            double totalLigne = ligne.getPrix() * ligne.getQuantite();
            ligne.setTotal(totalLigne);

            try {
                Map produit = restTemplate.getForObject(MENU_URL + ligne.getProduitId(), Map.class);
                if (produit != null) {
                    ligne.setProduitNom((String) produit.get("nom"));
                }
            } catch (Exception e) {
                ligne.setProduitNom("Produit inconnu");
            }

            totalTicket += totalLigne;
        }

        ticket.setTotal(totalTicket);
        if (ticket.getDate() == null) {
            ticket.setDate(LocalDateTime.now());
        }

        return repo.save(ticket);
    }

    @Override
    public List<Ticket> getAll() {
        return repo.findAll();
    }

    @Override
    public List<Ticket> getServeurTickets(String serveur) {
        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        return repo.findByServeurAndDateBetween(serveur, start, end);
    }

    @Override
    public double getServeurTotal(String serveur) {
        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        return repo.findByServeurAndDateBetween(serveur, start, end)
                .stream().mapToDouble(Ticket::getTotal).sum();
    }

    @Override
    public List<Ticket> getAdminTickets() {
        if (lastClearTime == null) {
            return repo.findAll();
        } else {
            return repo.findByDateAfter(lastClearTime);
        }
    }

    @Override
    public double getAdminTotal() {
        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        return repo.findByDateBetween(start, end)
                .stream().mapToDouble(Ticket::getTotal).sum();
    }

    @Override
    public Ticket update(Long id, Ticket newTicket) {
        Ticket existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        existing.setServeur(newTicket.getServeur());
        // Mise à jour des lignes...

        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public void clearSession() {
        lastClearTime = LocalDateTime.now();
    }

    // ✅ Implémentation de getTicketByOrderId (retourne une liste)
    @Override
    public List<Ticket> getTicketByOrderId(String orderId) {
        System.out.println("🔍 Recherche ticket par orderId: " + orderId);
        List<Ticket> tickets = repo.findByOrderId(orderId);
        if (tickets != null && !tickets.isEmpty()) {
            System.out.println("✅ Ticket trouvé: " + tickets.get(0).getId());
        } else {
            System.out.println("❌ Aucun ticket trouvé pour orderId: " + orderId);
        }
        return tickets;
    }
}