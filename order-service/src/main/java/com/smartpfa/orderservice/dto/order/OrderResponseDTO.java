package com.smartpfa.orderservice.dto.order;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {

    private String id;
    private String numeroCommande;
    private String nomClient;
    private String telephone;
    private Integer numeroTable;
    private String statut;
    private Double total;
    private LocalDateTime dateCommande;
    private List<OrderItemResponseDTO> items;

    // ✅ Constructeurs
    public OrderResponseDTO() {}

    public OrderResponseDTO(String id, String numeroCommande, String nomClient, String telephone,
                            Integer numeroTable, String statut, Double total,
                            LocalDateTime dateCommande, List<OrderItemResponseDTO> items) {
        this.id = id;
        this.numeroCommande = numeroCommande;
        this.nomClient = nomClient;
        this.telephone = telephone;
        this.numeroTable = numeroTable;
        this.statut = statut;
        this.total = total;
        this.dateCommande = dateCommande;
        this.items = items;
    }

    // ✅ Getters
    public String getId() { return id; }
    public String getNumeroCommande() { return numeroCommande; }
    public String getNomClient() { return nomClient; }
    public String getTelephone() { return telephone; }
    public Integer getNumeroTable() { return numeroTable; }
    public String getStatut() { return statut; }
    public Double getTotal() { return total; }
    public LocalDateTime getDateCommande() { return dateCommande; }
    public List<OrderItemResponseDTO> getItems() { return items; }

    // ✅ Setters
    public void setId(String id) { this.id = id; }
    public void setNumeroCommande(String numeroCommande) { this.numeroCommande = numeroCommande; }
    public void setNomClient(String nomClient) { this.nomClient = nomClient; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public void setNumeroTable(Integer numeroTable) { this.numeroTable = numeroTable; }
    public void setStatut(String statut) { this.statut = statut; }
    public void setTotal(Double total) { this.total = total; }
    public void setDateCommande(LocalDateTime dateCommande) { this.dateCommande = dateCommande; }
    public void setItems(List<OrderItemResponseDTO> items) { this.items = items; }

    // ✅ Inner class
    public static class OrderItemResponseDTO {
        private String id;
        private String produitId;
        private String produitLibelle;
        private Integer quantite;
        private Double prixUnitaire;
        private Double totalLigne;

        public OrderItemResponseDTO() {}

        public OrderItemResponseDTO(String id, String produitId, String produitLibelle,
                                    Integer quantite, Double prixUnitaire, Double totalLigne) {
            this.id = id;
            this.produitId = produitId;
            this.produitLibelle = produitLibelle;
            this.quantite = quantite;
            this.prixUnitaire = prixUnitaire;
            this.totalLigne = totalLigne;
        }

        public String getId() { return id; }
        public String getProduitId() { return produitId; }
        public String getProduitLibelle() { return produitLibelle; }
        public Integer getQuantite() { return quantite; }
        public Double getPrixUnitaire() { return prixUnitaire; }
        public Double getTotalLigne() { return totalLigne; }

        public void setId(String id) { this.id = id; }
        public void setProduitId(String produitId) { this.produitId = produitId; }
        public void setProduitLibelle(String produitLibelle) { this.produitLibelle = produitLibelle; }
        public void setQuantite(Integer quantite) { this.quantite = quantite; }
        public void setPrixUnitaire(Double prixUnitaire) { this.prixUnitaire = prixUnitaire; }
        public void setTotalLigne(Double totalLigne) { this.totalLigne = totalLigne; }
    }
}