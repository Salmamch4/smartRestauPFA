package com.smartpfa.orderservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class MenuServiceClient {

    private final RestTemplate restTemplate;

    @Value("${menu.service.url:http://localhost:5160}")
    private String menuServiceUrl;

    public MenuServiceClient() {
        this.restTemplate = new RestTemplate();
    }

    // Récupérer les ingrédients d'un produit par nom
    public List<Map<String, Object>> getProduitIngredients(String productName) {
        try {
            String url = menuServiceUrl + "/api/produits";
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);

            if (response.getBody() == null) return new ArrayList<>();

            for (Object obj : response.getBody()) {
                Map<String, Object> produit = (Map<String, Object>) obj;
                String nom = (String) produit.get("nom");
                if (nom != null && nom.equalsIgnoreCase(productName)) {
                    Object ingredients = produit.get("ingrédients");
                    if (ingredients instanceof List) {
                        return (List<Map<String, Object>>) ingredients;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Erreur Menu service: " + e.getMessage());
        }
        return new ArrayList<>();
    }

    // ✅ NOUVEAU - Vérifier si stock suffisant pour un produit
    public boolean isStockSuffisant(String productName, int quantiteCommande) {
        try {
            List<Map<String, Object>> ingredients = getProduitIngredients(productName);

            // Si pas d'ingrédients → disponible par défaut
            if (ingredients == null || ingredients.isEmpty()) {
                return false;
            }

            for (Map<String, Object> ingredient : ingredients) {
                String articleId = (String) ingredient.get("articleId");
                int quantiteNecessaire = ((Number) ingredient.get("quantite")).intValue()
                        * quantiteCommande;

                String url = menuServiceUrl + "/api/articles/" + articleId
                        + "/disponible?quantiteNecessaire=" + quantiteNecessaire;

                Map response = restTemplate.getForObject(url, Map.class);

                if (response != null) {
                    boolean disponible = (Boolean) response.get("disponible");
                    System.out.println("📦 Article: " + articleId
                            + " - Necessaire: " + quantiteNecessaire
                            + " - Disponible: " + disponible);
                    if (!disponible) return false;
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur vérification stock: " + e.getMessage());
            return true; // Par défaut disponible si erreur
        }
        return true;
    }

    // Décrémenter le stock d'un article
    public void decrementStock(String articleId, int quantite) {
        try {
            String url = menuServiceUrl + "/api/articles/" + articleId + "/decrement";

            Map<String, Object> body = new HashMap<>();
            body.put("quantite", quantite);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.exchange(url, HttpMethod.PUT, request, String.class);

            System.out.println("✅ Stock décrémenté - Article: " + articleId
                    + " - Quantite: " + quantite);
        } catch (Exception e) {
            System.err.println("❌ Erreur décrémentation: " + e.getMessage());
        }
    }
}