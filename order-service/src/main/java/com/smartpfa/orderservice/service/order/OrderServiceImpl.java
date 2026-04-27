package com.smartpfa.orderservice.service.order;

import com.smartpfa.orderservice.dto.order.OrderRequestDTO;
import com.smartpfa.orderservice.dto.order.OrderResponseDTO;
import com.smartpfa.orderservice.entity.order.Order;
import com.smartpfa.orderservice.entity.order.OrderItem;
import com.smartpfa.orderservice.enums.OrderStatus;
import com.smartpfa.orderservice.mappers.order.OrderMapper;
import com.smartpfa.orderservice.repository.order.IOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements IOrderService {

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public List<OrderResponseDTO> getPendingOrders() {
        System.out.println("=== getPendingOrders START ===");
        try {
            // ✅ Utiliser .name() pour convertir l'enum en String
            List<Order> orders = orderRepository.findByStatut(OrderStatus.EN_CONFIRMATION.name());
            System.out.println("Found " + orders.size() + " orders");
            return orders.stream()
                    .map(orderMapper::toResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<OrderResponseDTO> getInProgressOrders() {
        List<Order> orders = orderRepository.findByStatut(OrderStatus.EN_PREPARATION.name());
        return orders.stream()
                .map(orderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getReadyOrders() {
        List<Order> orders = orderRepository.findByStatut(OrderStatus.PRETE.name());
        return orders.stream()
                .map(orderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDTO confirmOrder(UUID id) {
        Order order = orderRepository.findById(id);
        if (order != null) {
            order.setStatut(OrderStatus.CONFIRMEE);
            return orderMapper.toResponseDTO(orderRepository.save(order));
        }
        return null;
    }

    @Override
    public OrderResponseDTO startOrder(UUID id) {
        Order order = orderRepository.findById(id);
        if (order != null) {
            order.setStatut(OrderStatus.EN_PREPARATION);
            return orderMapper.toResponseDTO(orderRepository.save(order));
        }
        return null;
    }

    @Override
    public OrderResponseDTO completeOrder(UUID id) {
        Order order = orderRepository.findById(id);
        if (order != null) {
            order.setStatut(OrderStatus.PRETE);
            return orderMapper.toResponseDTO(orderRepository.save(order));
        }
        return null;
    }

    @Override
    public OrderResponseDTO cancelOrder(UUID id) {
        Order order = orderRepository.findById(id);
        if (order != null) {
            order.setStatut(OrderStatus.REJETEE);
            return orderMapper.toResponseDTO(orderRepository.save(order));
        }
        return null;
    }

    @Override
    public OrderResponseDTO invalidateItem(UUID id, Long itemId) {
        Order order = orderRepository.findById(id);
        return order != null ? orderMapper.toResponseDTO(order) : null;
    }

    @Override
    public OrderResponseDTO revalidateItem(UUID id, Long itemId) {
        Order order = orderRepository.findById(id);
        return order != null ? orderMapper.toResponseDTO(order) : null;
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        System.out.println("=== createOrder START ===");
        System.out.println("Nombre d'items reçus: " + (request.getItems() != null ? request.getItems().size() : 0));

        // 1. Créer la commande
        Order order = new Order();
        order.setNomClient(request.getNomClient());
        order.setTelephone(request.getTelephone());
        order.setNumeroTable(request.getNumeroTable());
        order.setTotal(request.getTotal());
        order.setStatut(OrderStatus.EN_CONFIRMATION);
        order.setNumeroCommande("CMD-" + System.currentTimeMillis());
        order.setDateCommande(LocalDateTime.now());
        order.setItems(new ArrayList<>()); // Initialiser la liste des items

        // 2. Sauvegarder d'abord la commande pour avoir un ID
        Order savedOrder = orderRepository.save(order);
        System.out.println("Commande sauvegardée avec ID: " + savedOrder.getId());

        // 3. Ajouter les items s'ils existent
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            System.out.println("Ajout des items...");

            for (OrderRequestDTO.OrderItemRequestDTO itemDTO : request.getItems()) {
                OrderItem item = new OrderItem();
                item.setCommande(savedOrder); // Lier l'item à la commande
                item.setProduitId(itemDTO.getProduitId());
                item.setProduitLibelle(itemDTO.getProduitLibelle());
                item.setQuantite(itemDTO.getQuantite());
                item.setPrixUnitaire(itemDTO.getPrixUnitaire());
                item.calculateTotal(); // Calculer le total de la ligne

                savedOrder.getItems().add(item);
                System.out.println("Item ajouté: " + item.getProduitLibelle() + " x " + item.getQuantite() + " = " + item.getTotalLigne());
            }

            // 4. Sauvegarder à nouveau la commande avec les items
            savedOrder = orderRepository.save(savedOrder);
            System.out.println("Commande sauvegardée avec " + savedOrder.getItems().size() + " items");
        } else {
            System.out.println("Aucun item à ajouter");
        }

        return orderMapper.toResponseDTO(savedOrder);
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


    @Override
    public List<OrderResponseDTO> getConfirmedOrders() {
        System.out.println("=== getConfirmedOrders START ===");
        try {
            List<Order> orders = orderRepository.findByStatut(OrderStatus.CONFIRMEE.name());
            System.out.println("Found " + orders.size() + " confirmed orders");
            return orders.stream()
                    .map(orderMapper::toResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getConfirmedOrders: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<OrderResponseDTO> getDeliveredOrders() {
        System.out.println("=== getDeliveredOrders START ===");
        try {
            List<Order> orders = orderRepository.findByStatut(OrderStatus.LIVREE.name());
            System.out.println("Found " + orders.size() + " delivered orders");
            return orders.stream()
                    .map(orderMapper::toResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getDeliveredOrders: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<OrderResponseDTO> getCancelledOrders() {
        System.out.println("=== getCancelledOrders START ===");
        try {
            List<Order> orders = orderRepository.findByStatut(OrderStatus.REJETEE.name());
            System.out.println("Found " + orders.size() + " cancelled orders");
            return orders.stream()
                    .map(orderMapper::toResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getCancelledOrders: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public OrderResponseDTO deliverOrder(UUID id) {
        System.out.println("=== deliverOrder: " + id);
        try {
            Order order = orderRepository.findById(id);
            if (order == null) {
                System.out.println("Order not found: " + id);
                return null;
            }
            order.setStatut(OrderStatus.LIVREE);
            Order updated = orderRepository.save(order);
            System.out.println("Order delivered: " + updated.getId());
            return orderMapper.toResponseDTO(updated);
        } catch (Exception e) {
            System.err.println("Error deliverOrder: " + e.getMessage());
            return null;
        }
    }



}