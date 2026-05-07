package com.smartpfa.orderservice.service.stock;

import com.smartpfa.orderservice.entity.order.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class StockUpdateService {

    @Autowired
    private RestTemplate restTemplate;

    private final String MENU_SERVICE_URL = "http://localhost:5160/api/stock/deduct";

    public boolean deductStock(List<OrderItem> items) {
        try {
            System.out.println("📤 APPEL API: " + MENU_SERVICE_URL);
            System.out.println("📦 Articles à déduire: " + items.size());

            List<StockDeductionRequest> requests = new ArrayList<>();

            for (OrderItem item : items) {
                StockDeductionRequest request = new StockDeductionRequest();
                request.setProductId(item.getProduitId());
                request.setProductName(item.getProduitLibelle());
                request.setQuantity(item.getQuantite());
                requests.add(request);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<List<StockDeductionRequest>> entity = new HttpEntity<>(requests, headers);

            ResponseEntity<Boolean> response = restTemplate.postForEntity(
                    MENU_SERVICE_URL,
                    entity,
                    Boolean.class
            );

            System.out.println("📥 Réponse reçue: " + response.getStatusCode());
            System.out.println("📥 Body: " + response.getBody());

            return response.getBody() != null && response.getBody();

        } catch (Exception e) {
            System.err.println("❌ Erreur déduction stock: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public static class StockDeductionRequest {
        private String productId;
        private String productName;
        private int quantity;

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
}