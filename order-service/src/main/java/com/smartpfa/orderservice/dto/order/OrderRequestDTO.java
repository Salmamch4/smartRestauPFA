package com.smartpfa.orderservice.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public class OrderRequestDTO {

    @NotBlank(message = "Le nom du client est requis")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'-]+$", message = "Le nom ne doit contenir que des lettres")
    private String nomClient;

    @NotBlank(message = "Le téléphone est requis")
    @Pattern(regexp = "^[0-9]{10}$", message = "Le téléphone doit contenir exactement 10 chiffres")
    private String telephone;

    @Min(value = 1, message = "Le numéro de table doit être au minimum 1")
    @Max(value = 50, message = "Le numéro de table ne peut pas dépasser 50")
    private Integer numeroTable;

    @NotNull(message = "Le total est requis")
    @DecimalMin(value = "0.01", message = "Le total doit être positif")
    @DecimalMax(value = "99999.99", message = "Le total ne peut pas dépasser 99999.99")
    private Double total;

    @Valid
    private List<OrderItemRequestDTO> items;

    // Constructeurs
    public OrderRequestDTO() {}

    public OrderRequestDTO(String nomClient, String telephone, Integer numeroTable, Double total, List<OrderItemRequestDTO> items) {
        this.nomClient = nomClient;
        this.telephone = telephone;
        this.numeroTable = numeroTable;
        this.total = total;
        this.items = items;
    }

    // Getters
    public String getNomClient() { return nomClient; }
    public String getTelephone() { return telephone; }
    public Integer getNumeroTable() { return numeroTable; }
    public Double getTotal() { return total; }
    public List<OrderItemRequestDTO> getItems() { return items; }

    // Setters
    public void setNomClient(String nomClient) { this.nomClient = nomClient; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public void setNumeroTable(Integer numeroTable) { this.numeroTable = numeroTable; }
    public void setTotal(Double total) { this.total = total; }
    public void setItems(List<OrderItemRequestDTO> items) { this.items = items; }

    // Inner class
    public static class OrderItemRequestDTO {

        @NotBlank(message = "L'ID du produit est requis")
        private String produitId;

        @NotBlank(message = "Le libellé du produit est requis")
        @Size(max = 200, message = "Le libellé ne peut pas dépasser 200 caractères")
        private String produitLibelle;

        @NotNull(message = "La quantité est requise")
        @Min(value = 1, message = "La quantité doit être au minimum 1")
        @Max(value = 100, message = "La quantité ne peut pas dépasser 100")
        private Integer quantite;

        @NotNull(message = "Le prix unitaire est requis")
        @DecimalMin(value = "0.01", message = "Le prix unitaire doit être positif")
        @DecimalMax(value = "9999.99", message = "Le prix unitaire ne peut pas dépasser 9999.99")
        private Double prixUnitaire;

        public OrderItemRequestDTO() {}

        public OrderItemRequestDTO(String produitId, String produitLibelle, Integer quantite, Double prixUnitaire) {
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