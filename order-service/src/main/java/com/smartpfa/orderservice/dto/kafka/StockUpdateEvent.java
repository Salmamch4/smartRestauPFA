// StockUpdateEvent.java
package com.smartpfa.orderservice.dto.kafka;

import java.time.LocalDateTime;
import java.util.List;

public class StockUpdateEvent {
    private String orderId;
    private String orderNumber;
    private String nomClient;
    private LocalDateTime timestamp;
    private List<StockItem> items;

    public StockUpdateEvent() {}

    public StockUpdateEvent(String orderId, String orderNumber, String nomClient, List<StockItem> items) {
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.nomClient = nomClient;
        this.timestamp = LocalDateTime.now();
        this.items = items;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getNomClient() { return nomClient; }
    public void setNomClient(String nomClient) { this.nomClient = nomClient; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public List<StockItem> getItems() { return items; }
    public void setItems(List<StockItem> items) { this.items = items; }

    public static class StockItem {
        private String productId;
        private String productName;
        private int quantity;
        private double price;

        public StockItem() {}

        public StockItem(String productId, String productName, int quantity, double price) {
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.price = price;
        }

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }

        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
    }
}