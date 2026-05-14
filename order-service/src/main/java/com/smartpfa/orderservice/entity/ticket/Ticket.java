package com.smartpfa.orderservice.entity.ticket;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ticket")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serveur;
    private double total;
    private LocalDateTime date;


    @Column(name = "order_id", nullable = true)
    private String orderId;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<LigneTicket> lignes = new ArrayList<>();

    public Ticket() {}

    public Long getId() { return id; }

    public String getServeur() { return serveur; }
    public void setServeur(String serveur) { this.serveur = serveur; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public List<LigneTicket> getLignes() { return lignes; }
    public void setLignes(List<LigneTicket> lignes) { this.lignes = lignes; }

    // ✅ Getters et Setters pour orderId
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
}