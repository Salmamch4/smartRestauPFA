package com.smartpfa.orderservice.enums;

public enum OrderStatus {
    EN_ATTENTE("En attente de validation"),
    CONFIRMEE("Commande confirmée"),
    REJETEE("Commande rejetée"),
    LIVREE("Commande livrée");

    private final String description;

    OrderStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public static OrderStatus fromString(String status) {
        for (OrderStatus s : OrderStatus.values()) {
            if (s.name().equalsIgnoreCase(status)) {
                return s;
            }
        }
        return EN_ATTENTE;
    }
}