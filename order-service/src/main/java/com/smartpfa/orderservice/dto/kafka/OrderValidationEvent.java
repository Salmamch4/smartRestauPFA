package com.smartpfa.orderservice.dto.kafka;

import java.util.List;

public class OrderValidationEvent {

    private String orderId;
    private String orderNumber;
    private String nomClient;
    private String telephone;
    private Integer numeroTable;
    private Double total;
    private List<OrderItemEvent> items;

    public OrderValidationEvent() {}

    public OrderValidationEvent(String orderId, String orderNumber, String nomClient,
                                String telephone, Integer numeroTable, Double total,
                                List<OrderItemEvent> items) {
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.nomClient = nomClient;
        this.telephone = telephone;
        this.numeroTable = numeroTable;
        this.total = total;
        this.items = items;
    }


    public String getOrderId() { return orderId; }
    public String getOrderNumber() { return orderNumber; }
    public String getNomClient() { return nomClient; }
    public String getTelephone() { return telephone; }
    public Integer getNumeroTable() { return numeroTable; }
    public Double getTotal() { return total; }
    public List<OrderItemEvent> getItems() { return items; }


    public void setOrderId(String orderId) { this.orderId = orderId; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public void setNomClient(String nomClient) { this.nomClient = nomClient; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public void setNumeroTable(Integer numeroTable) { this.numeroTable = numeroTable; }
    public void setTotal(Double total) { this.total = total; }
    public void setItems(List<OrderItemEvent> items) { this.items = items; }


    public static class OrderItemEvent {
        private String produitId;
        private String produitLibelle;
        private Integer quantite;
        private Double prixUnitaire;

        public OrderItemEvent() {}

        public OrderItemEvent(String produitId, String produitLibelle, Integer quantite, Double prixUnitaire) {
            this.produitId = produitId;
            this.produitLibelle = produitLibelle;
            this.quantite = quantite;
            this.prixUnitaire = prixUnitaire;
        }

        public String getProduitId() { return produitId; }
        public String getProduitLibelle() { return produitLibelle; }
        public Integer getQuantite() { return quantite; }
        public Double getPrixUnitaire() { return prixUnitaire; }

        public void setProduitId(String produitId) { this.produitId = produitId; }
        public void setProduitLibelle(String produitLibelle) { this.produitLibelle = produitLibelle; }
        public void setQuantite(Integer quantite) { this.quantite = quantite; }
        public void setPrixUnitaire(Double prixUnitaire) { this.prixUnitaire = prixUnitaire; }
    }
}