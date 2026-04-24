package com.smartpfa.orderservice.exception;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(Long id) {
        super("Commande non trouvée avec l'id : " + id);
    }
}