package com.smartpfa.orderservice.enums;

public enum OrderStatus {
    EN_CONFIRMATION("En cours de confirmation"),  // ✅ Changé de EN_ATTENTE à EN_CONFIRMATION
    CONFIRMEE("Commande confirmée"),
    EN_PREPARATION("En préparation"),
    PRETE("Prête à être servie"),
    LIVREE("Commande livrée"),
    REJETEE("Commande rejetée");

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
        return EN_CONFIRMATION;  // ✅ Changé ici aussi
    }
}