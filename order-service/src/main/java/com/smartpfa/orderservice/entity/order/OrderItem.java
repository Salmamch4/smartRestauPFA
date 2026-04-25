package com.smartpfa.orderservice.entity.order;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "commande_lignes")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    private Order commande;

    @Column(name = "produit_id", nullable = false)
    private String produitId;

    @Column(name = "produit_libelle", length = 200)
    private String produitLibelle;

    @Column(name = "quantite", nullable = false)
    private Integer quantite;

    @Column(name = "prix_unitaire", columnDefinition = "DECIMAL(10,2)")
    private Double prixUnitaire;

    @Column(name = "total_ligne", columnDefinition = "DECIMAL(10,2)")
    private Double totalLigne;

    // Constructeurs
    public OrderItem() {}

    public OrderItem(String produitId, String produitLibelle, Integer quantite, Double prixUnitaire) {
        this.produitId = produitId;
        this.produitLibelle = produitLibelle;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
        this.totalLigne = quantite * prixUnitaire;
    }


    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Order getCommande() { return commande; }
    public void setCommande(Order commande) { this.commande = commande; }

    public String getProduitId() { return produitId; }
    public void setProduitId(String produitId) { this.produitId = produitId; }

    public String getProduitLibelle() { return produitLibelle; }
    public void setProduitLibelle(String produitLibelle) { this.produitLibelle = produitLibelle; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }

    public Double getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(Double prixUnitaire) { this.prixUnitaire = prixUnitaire; }

    public Double getTotalLigne() { return totalLigne; }
    public void setTotalLigne(Double totalLigne) { this.totalLigne = totalLigne; }

    @PrePersist
    @PreUpdate
    public void calculateTotal() {
        if (quantite != null && prixUnitaire != null) {
            this.totalLigne = quantite * prixUnitaire;
        }
    }
}