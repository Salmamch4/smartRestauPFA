package com.smartpfa.orderservice.service;

import com.smartpfa.orderservice.dto.kafka.OrderValidationEvent;
import com.smartpfa.orderservice.dto.order.OrderRequestDTO;
import com.smartpfa.orderservice.dto.order.OrderResponseDTO;
import com.smartpfa.orderservice.entity.order.Order;
import com.smartpfa.orderservice.entity.order.OrderItem;
import com.smartpfa.orderservice.mappers.order.OrderMapper;
import com.smartpfa.orderservice.repository.order.IOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements IOrderService {

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private OrderMapper orderMapper;
    @PostConstruct
    public void testKafka() {
        System.out.println("=== TEST KAFKA CONNECTION ===");
        OrderValidationEvent testEvent = new OrderValidationEvent();
        testEvent.setOrderNumber("TEST-001");
        testEvent.setNomClient("Test");
        kafkaProducerService.sendOrderForValidation(testEvent);
    }

    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        System.out.println("=== CRÉATION COMMANDE ===");

        //  Créer la commande SANS items
        Order order = new Order();
        order.setNomClient(request.getNomClient());
        order.setTelephone(request.getTelephone());
        order.setNumeroTable(request.getNumeroTable());
        order.setTotal(request.getTotal());
        order.setStatut(com.smartpfa.orderservice.enums.OrderStatus.EN_ATTENTE);
        order.setNumeroCommande(generateOrderNumber());
        order.setDateCommande(LocalDateTime.now());

        //  Sauvegarder la commande d'abord (pour générer l'ID)
        Order savedOrder = orderRepository.save(order);
        System.out.println("Commande sauvegardée ID: " + savedOrder.getId());

        // Créer et sauvegarder les items avec l'ID de la commande
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (OrderRequestDTO.OrderItemRequestDTO itemDTO : request.getItems()) {
                OrderItem item = new OrderItem();
                item.setCommande(savedOrder);
                item.setProduitId(itemDTO.getProduitId());
                item.setProduitLibelle(itemDTO.getProduitLibelle());
                item.setQuantite(itemDTO.getQuantite());
                item.setPrixUnitaire(itemDTO.getPrixUnitaire());
                item.calculateTotal();
                savedOrder.getItems().add(item);
            }
            orderRepository.save(savedOrder);
        }



        // ENVOYER À KAFKA
        OrderValidationEvent event = new OrderValidationEvent();
        event.setOrderId(savedOrder.getId().toString());
        event.setOrderNumber(savedOrder.getNumeroCommande());
        event.setNomClient(savedOrder.getNomClient());
        event.setTelephone(savedOrder.getTelephone());
        event.setNumeroTable(savedOrder.getNumeroTable());
        event.setTotal(savedOrder.getTotal());

        if (request.getItems() != null) {
            List<OrderValidationEvent.OrderItemEvent> items = request.getItems().stream()
                    .map(item -> new OrderValidationEvent.OrderItemEvent(
                            item.getProduitId(),
                            item.getProduitLibelle(),
                            item.getQuantite(),
                            item.getPrixUnitaire()
                    ))
                    .collect(Collectors.toList());
            event.setItems(items);
        }

        kafkaProducerService.sendOrderForValidation(event);

        // Retourner la réponse
        return orderMapper.toResponseDTO(savedOrder);
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDTO getOrderById(UUID id) {
        Order order = orderRepository.findById(id);
        return order != null ? orderMapper.toResponseDTO(order) : null;
    }

    @Override
    public List<OrderResponseDTO> getOrdersByTelephone(String telephone) {
        return orderRepository.findByTelephoneOrderByDateCommandeDesc(telephone).stream()
                .map(orderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public String generateOrderNumber() {
        return "CMD-" + System.currentTimeMillis();
    }
}