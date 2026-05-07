package com.smartpfa.orderservice.service.kafka;

import com.smartpfa.orderservice.dto.kafka.StockUpdateEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final String STOCK_UPDATE_TOPIC = "stock-updates";

    public void sendStockUpdate(StockUpdateEvent event) {
        try {
            kafkaTemplate.send(STOCK_UPDATE_TOPIC, event.getOrderId(), event);
            System.out.println("Message Kafka envoye - Commande: " + event.getOrderNumber());
        } catch (Exception e) {
            System.err.println("Erreur envoi Kafka: " + e.getMessage());
        }
    }
}