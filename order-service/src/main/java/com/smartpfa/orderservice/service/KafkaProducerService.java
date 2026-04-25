package com.smartpfa.orderservice.service;

import com.smartpfa.orderservice.dto.kafka.OrderValidationEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private static final String TOPIC = "order-validation";

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void sendOrderForValidation(OrderValidationEvent event) {
        System.out.println(" Envoi de la commande à Kafka: " + event.getOrderNumber());
        kafkaTemplate.send(TOPIC, event);
        System.out.println(" Commande envoyée à Kafka");
    }
}
