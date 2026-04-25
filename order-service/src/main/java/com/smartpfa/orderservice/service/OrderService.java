package com.smartpfa.orderservice.service;

import com.smartpfa.orderservice.dto.OrderRequest;
import com.smartpfa.orderservice.dto.OrderResponse;
import com.smartpfa.orderservice.entity.Order;
import com.smartpfa.orderservice.entity.OrderItem;
import com.smartpfa.orderservice.exception.OrderNotFoundException;
import com.smartpfa.orderservice.mapper.OrderMapper;
import com.smartpfa.orderservice.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final MenuServiceClient menuServiceClient;

    public OrderService(OrderRepository orderRepository,
                        OrderMapper orderMapper,
                        MenuServiceClient menuServiceClient) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.menuServiceClient = menuServiceClient;
    }

    // ==================== CRUD ====================

    public OrderResponse createOrder(OrderRequest request) {
        Order order = orderMapper.toEntity(request);
        if (request.getItems() != null) {
            List<OrderItem> items = request.getItems()
                    .stream()
                    .map(itemRequest -> orderMapper.toItemEntity(itemRequest, order))
                    .collect(Collectors.toList());
            order.setItems(items);
        }
        return orderMapper.toResponse(orderRepository.save(order));
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new OrderNotFoundException(id);
        }
        orderRepository.deleteById(id);
    }

    // ==================== CHEF CUISINIER ====================

    // ✅ Vérification automatique du stock
    public List<OrderResponse> getPendingOrders() {
        return orderRepository.findByStatus("EN_ATTENTE")
                .stream()
                .map(order -> {
                    List<OrderItem> items = new ArrayList<>(order.getItems());
                    for (OrderItem item : items) {
                        // ✅ Skip INVALIDE et VALIDE_MANUELLEMENT
                        if (!"INVALIDE".equals(item.getItemStatus())
                                && !"VALIDE_MANUELLEMENT".equals(item.getItemStatus())) {
                            boolean stockOk = menuServiceClient.isStockSuffisant(
                                    item.getProductName(),
                                    item.getQuantity() != null ? item.getQuantity() : 1
                            );
                            if (!stockOk) {
                                item.setItemStatus("INVALIDE");
                                System.out.println("🔴 Auto-indisponible: " + item.getProductName());
                            } else {
                                System.out.println("🟢 Disponible: " + item.getProductName());
                            }
                        }
                    }
                    orderRepository.save(order);
                    return orderMapper.toResponse(order);
                })
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getInProgressOrders() {
        return orderRepository.findByStatus("EN_COURS")
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse invalidateItem(Long orderId, Long itemId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        order.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .ifPresent(item -> item.setItemStatus("INVALIDE"));
        return orderMapper.toResponse(orderRepository.save(order));
    }

    // ✅ Revalider manuellement (ne sera plus re-invalidé automatiquement)
    public OrderResponse revalidateItem(Long orderId, Long itemId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        order.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .ifPresent(item -> item.setItemStatus("VALIDE_MANUELLEMENT"));
        return orderMapper.toResponse(orderRepository.save(order));
    }

    public OrderResponse clientAcceptsOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        order.setStatus("EN_COURS");
        return orderMapper.toResponse(orderRepository.save(order));
    }

    public OrderResponse cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        order.setStatus("ANNULEE");
        return orderMapper.toResponse(orderRepository.save(order));
    }

    public OrderResponse startOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        order.setStatus("EN_COURS");
        return orderMapper.toResponse(orderRepository.save(order));
    }

    // ✅ Chef termine → commande PRETE + décrémentation stock
    public OrderResponse completeOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        order.setStatus("PRETE");

        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                if (!"INVALIDE".equals(item.getItemStatus())) {
                    List<Map<String, Object>> ingredients =
                            menuServiceClient.getProduitIngredients(item.getProductName());

                    for (Map<String, Object> ingredient : ingredients) {
                        String articleId = (String) ingredient.get("articleId");
                        int quantite = ((Number) ingredient.get("quantite")).intValue();
                        int quantiteCommande = item.getQuantity() != null ? item.getQuantity() : 1;
                        menuServiceClient.decrementStock(articleId, quantite * quantiteCommande);
                    }
                }
            }
        }

        return orderMapper.toResponse(orderRepository.save(order));
    }
}