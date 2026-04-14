package com.smartpfa.orderservice.dto.ticket;

public class ClientTicketDTO {

    private String produit;
    private double prix;
    private int quantite;
    private double total;
    private boolean copie;

    public String getProduit() { return produit; }
    public void setProduit(String produit) { this.produit = produit; }

    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }

    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public boolean isCopie() { return copie; }
    public void setCopie(boolean copie) { this.copie = copie; }
}