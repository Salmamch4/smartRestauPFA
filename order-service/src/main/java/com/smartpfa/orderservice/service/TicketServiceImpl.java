package com.smartpfa.orderservice.service;

import com.smartpfa.orderservice.entity.LigneTicket;
import com.smartpfa.orderservice.entity.Ticket;
import com.smartpfa.orderservice.repository.TicketRepository;
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

            // 🔥 récupérer nom produit
            try {
                Map produit = restTemplate.getForObject(
                        MENU_URL + ligne.getProduitId(),
                        Map.class
                );

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

    // =========================
    // 🔥 GET ALL
    // =========================
    @Override
    public List<Ticket> getAll() {
        List<Ticket> tickets = repo.findAll();
        enrichTickets(tickets);
        return tickets;
    }

    // =========================
    // 🔥 SERVEUR (اليوم فقط)
    // =========================
    @Override
    public List<Ticket> getServeurTickets(String serveur) {

        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        List<Ticket> tickets = repo.findByServeurAndDateBetween(serveur, start, end);
        enrichTickets(tickets);

        return tickets;
    }

    @Override
    public double getServeurTotal(String serveur) {

        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        return repo.findByServeurAndDateBetween(serveur, start, end)
                .stream()
                .mapToDouble(Ticket::getTotal)
                .sum();
    }

    // =========================
    // 🔥 ADMIN (اليوم فقط)
    // =========================
    @Override
    public List<Ticket> getAdminTickets() {

        List<Ticket> tickets;

        if (lastClearTime == null) {
            tickets = repo.findAll();
        } else {
            tickets = repo.findByDateAfter(lastClearTime);
        }

        enrichTickets(tickets);

        return tickets;
    }

    @Override
    public double getAdminTotal() {

        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        return repo.findByDateBetween(start, end)
                .stream()
                .mapToDouble(Ticket::getTotal)
                .sum();
    }

    // =========================
    // 🔥 UPDATE
    // =========================
    @Override
    public Ticket update(Long id, Ticket newTicket) {

        Ticket existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        existing.setServeur(newTicket.getServeur());

        if (newTicket.getLignes() != null && !newTicket.getLignes().isEmpty()) {

            existing.getLignes().clear();
            double totalTicket = 0;

            for (LigneTicket ligne : newTicket.getLignes()) {

                ligne.setTicket(existing);

                double totalLigne = ligne.getPrix() * ligne.getQuantite();
                ligne.setTotal(totalLigne);

                try {
                    Map produit = restTemplate.getForObject(
                            MENU_URL + ligne.getProduitId(),
                            Map.class
                    );

                    if (produit != null) {
                        ligne.setProduitNom((String) produit.get("nom"));
                    }

                } catch (Exception e) {
                    ligne.setProduitNom("Produit inconnu");
                }

                existing.getLignes().add(ligne);
                totalTicket += totalLigne;
            }

            existing.setTotal(totalTicket);
        }

        return repo.save(existing);
    }

    // =========================
    // 🔥 DELETE
    // =========================
    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
    @Override
    public void clearSession() {
        lastClearTime = LocalDateTime.now();
    }

    // =========================
    // 🔥 ENRICH (affichage)
    // =========================
    private void enrichTickets(List<Ticket> tickets) {

        for (Ticket t : tickets) {
            for (LigneTicket ligne : t.getLignes()) {

                try {
                    Map produit = restTemplate.getForObject(
                            MENU_URL + ligne.getProduitId(),
                            Map.class
                    );

                    if (produit != null) {
                        ligne.setProduitNom((String) produit.get("nom"));
                    }

                } catch (Exception e) {
                    ligne.setProduitNom("Produit inconnu");
                }
            }
        }
    }
}