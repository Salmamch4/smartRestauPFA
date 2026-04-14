package com.smartpfa.orderservice.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ticket")
public class Ticket {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String produit;
    private double prix;
    private int quantite;
    private double total;
    private String serveur;
    private LocalDate date;

    // GETTERS & SETTERS

    public Long getId() { return id; }

    public String getProduit() { return produit; }
    public void setProduit(String produit) { this.produit = produit; }

    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }

    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getServeur() { return serveur; }
    public void setServeur(String serveur) { this.serveur = serveur; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}