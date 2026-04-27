package com.smartpfa.orderservice.entity.order;

import com.smartpfa.orderservice.enums.OrderStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "commandes")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "numero_commande", unique = true, nullable = false)
    private String numeroCommande;

    @Column(name = "nom_client", nullable = false)
    private String nomClient;

    @Column(name = "telephone", nullable = false)
    private String telephone;

    @Column(name = "numero_table")
    private Integer numeroTable;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private OrderStatus statut = OrderStatus.EN_CONFIRMATION;

    @Column(columnDefinition = "DECIMAL(10,2)")
    private Double total;

    @Column(name = "date_commande")
    private LocalDateTime dateCommande;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    //  Constructeurs
    public Order() {}

    public Order(String nomClient, String telephone, Integer numeroTable, Double total) {
        this.nomClient = nomClient;
        this.telephone = telephone;
        this.numeroTable = numeroTable;
        this.total = total;
        this.statut = OrderStatus.EN_CONFIRMATION;
        this.numeroCommande = "CMD-" + System.currentTimeMillis();
        this.dateCommande = LocalDateTime.now();
    }


    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNumeroCommande() { return numeroCommande; }
    public void setNumeroCommande(String numeroCommande) { this.numeroCommande = numeroCommande; }

    public String getNomClient() { return nomClient; }
    public void setNomClient(String nomClient) { this.nomClient = nomClient; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public Integer getNumeroTable() { return numeroTable; }
    public void setNumeroTable(Integer numeroTable) { this.numeroTable = numeroTable; }

    public OrderStatus getStatut() { return statut; }
    public void setStatut(OrderStatus statut) { this.statut = statut; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public LocalDateTime getDateCommande() { return dateCommande; }
    public void setDateCommande(LocalDateTime dateCommande) { this.dateCommande = dateCommande; }

    // Getter et Setter pour items (IMPORTANT)
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    // Méthode utilitaire pour ajouter un item
    public void addItem(OrderItem item) {
        items.add(item);
        item.setCommande(this);
    }

    @PrePersist
    protected void onCreate() {
        dateCommande = LocalDateTime.now();
        if (numeroCommande == null) {
            numeroCommande = "CMD-" + System.currentTimeMillis();
        }
        if (statut == null) {
            statut = OrderStatus.EN_CONFIRMATION;
        }
    }
}