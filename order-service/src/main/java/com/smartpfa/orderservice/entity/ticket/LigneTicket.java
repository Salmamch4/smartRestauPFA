package com.smartpfa.orderservice.entity.ticket;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "LigneTicket")
public class LigneTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ProduitId")
    private String produitId;

    private double prix;
    private int quantite;
    private double total;

    @ManyToOne
    @JoinColumn(name = "TicketId")
    @JsonBackReference
    private Ticket ticket;

    @Column(name = "ProduitNom")
    private String produitNom;

    public LigneTicket() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProduitId() { return produitId; }
    public void setProduitId(String produitId) { this.produitId = produitId; }

    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }

    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }

    public String getProduitNom() { return produitNom; }
    public void setProduitNom(String produitNom) { this.produitNom = produitNom; }
}