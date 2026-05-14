package com.smartpfa.orderservice.service.order;

import com.smartpfa.orderservice.dto.order.OrderRequestDTO;
import com.smartpfa.orderservice.dto.order.OrderResponseDTO;
import com.smartpfa.orderservice.entity.order.Order;
import com.smartpfa.orderservice.entity.order.OrderItem;
import com.smartpfa.orderservice.enums.OrderStatus;
import com.smartpfa.orderservice.mappers.order.OrderMapper;
import com.smartpfa.orderservice.repository.order.IOrderRepository;
import com.smartpfa.orderservice.service.stock.StockUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.smartpfa.orderservice.entity.ticket.Ticket;
import com.smartpfa.orderservice.entity.ticket.LigneTicket;
import com.smartpfa.orderservice.service.ticket.TicketService;

@Service
public class OrderServiceImpl implements IOrderService {

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private StockUpdateService stockUpdateService;

    @Autowired
    private TicketService ticketService;  // ✅ Déclaré une seule fois

    @Override
    public List<OrderResponseDTO> getPendingOrders() {
        System.out.println("=== getPendingOrders START ===");
        try {
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
    @Transactional
    public OrderResponseDTO confirmOrder(UUID id) {
        System.out.println("=== confirmOrder: " + id);

        Order order = orderRepository.findById(id);
        if (order == null) return null;

        boolean hasInvalidItems = order.getItems().stream()
                .anyMatch(item -> item.getQuantite() == 0);

        if (hasInvalidItems) {
            throw new RuntimeException("Impossible de confirmer. Articles indisponibles");
        }

        boolean stockUpdated = stockUpdateService.deductStock(order.getItems());

        if (!stockUpdated) {
            throw new RuntimeException("Erreur lors de la mise à jour du stock. Stock insuffisant.");
        }

        order.setStatut(OrderStatus.CONFIRMEE);
        Order updated = orderRepository.save(order);

        System.out.println("Commande confirmée: " + updated.getNumeroCommande());

        return orderMapper.toResponseDTO(updated);
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

    // ✅ Une seule méthode completeOrder
    @Override
    @Transactional
    public OrderResponseDTO completeOrder(UUID id) {
        System.out.println("=== completeOrder: " + id);

        Order order = orderRepository.findById(id);
        if (order == null) return null;

        order.setStatut(OrderStatus.PRETE);
        Order updated = orderRepository.save(order);

        // ✅ Créer le ticket uniquement quand la commande est PRETE
        createTicketFromOrder(updated);

        return orderMapper.toResponseDTO(updated);
    }

    private void createTicketFromOrder(Order order) {
        try {
            Ticket existingTicket = ticketService.getTicketByOrderId(order.getId().toString());
            if (existingTicket != null) {
                System.out.println("Ticket déjà existant pour la commande: " + order.getNumeroCommande());
                return;
            }

            Ticket ticket = new Ticket();
            ticket.setServeur(order.getNomClient());
            ticket.setDate(LocalDateTime.now());

            double total = 0;
            List<LigneTicket> lignes = new ArrayList<>();

            for (OrderItem item : order.getItems()) {
                LigneTicket ligne = new LigneTicket();
                ligne.setProduitId(item.getProduitId());
                ligne.setProduitNom(item.getProduitLibelle());
                ligne.setPrix(item.getPrixUnitaire());
                ligne.setQuantite(item.getQuantite());
                ligne.setTotal(item.getTotalLigne());
                ligne.setTicket(ticket);
                lignes.add(ligne);
                total += item.getTotalLigne();
            }

            ticket.setTotal(total);
            ticket.setLignes(lignes);
            ticket.setOrderId(order.getId().toString());  // ✅ Lier le ticket à la commande

            ticketService.createTicket(ticket);
            System.out.println("Ticket créé pour la commande PRETE: " + order.getNumeroCommande());

        } catch (Exception e) {
            System.err.println("Erreur création ticket: " + e.getMessage());
        }
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
        System.out.println("=== invalidateItem: orderId=" + id + ", itemId=" + itemId);

        Order order = orderRepository.findById(id);
        if (order == null) return null;

        for (OrderItem item : order.getItems()) {
            if (item.getId().toString().equals(String.valueOf(itemId))) {
                int ancienneQuantite = item.getQuantite();
                item.setQuantite(0);
                item.setTotalLigne(0.0);
                System.out.println("Item invalidé: " + item.getProduitLibelle() +
                        " (quantité: " + ancienneQuantite + " → 0)");
                break;
            }
        }

        double nouveauTotal = order.getItems().stream()
                .mapToDouble(OrderItem::getTotalLigne)
                .sum();
        order.setTotal(nouveauTotal);

        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toResponseDTO(updatedOrder);
    }

    @Override
    public OrderResponseDTO revalidateItem(UUID id, Long itemId) {
        System.out.println("=== revalidateItem: orderId=" + id + ", itemId=" + itemId);

        Order order = orderRepository.findById(id);
        if (order == null) return null;

        for (OrderItem item : order.getItems()) {
            if (item.getId().toString().equals(String.valueOf(itemId))) {
                if (item.getQuantite() == 0) {
                    item.setQuantite(1);
                    item.setTotalLigne(item.getPrixUnitaire() * 1);
                    System.out.println("Item réactivé: " + item.getProduitLibelle() + " → quantité: 1");
                }
                break;
            }
        }

        double nouveauTotal = order.getItems().stream()
                .mapToDouble(OrderItem::getTotalLigne)
                .sum();
        order.setTotal(nouveauTotal);

        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toResponseDTO(updatedOrder);
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

        Order order = new Order();
        order.setNomClient(request.getNomClient());
        order.setTelephone(request.getTelephone());
        order.setNumeroTable(request.getNumeroTable());
        order.setTotal(request.getTotal());
        order.setStatut(OrderStatus.EN_CONFIRMATION);
        order.setNumeroCommande("CMD-" + System.currentTimeMillis());
        order.setDateCommande(LocalDateTime.now());
        order.setItems(new ArrayList<>());

        Order savedOrder = orderRepository.save(order);
        System.out.println("Commande sauvegardée avec ID: " + savedOrder.getId());

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            System.out.println("Ajout des items...");

            for (OrderRequestDTO.OrderItemRequestDTO itemDTO : request.getItems()) {
                OrderItem item = new OrderItem();
                item.setCommande(savedOrder);
                item.setProduitId(itemDTO.getProduitId());
                item.setProduitLibelle(itemDTO.getProduitLibelle());
                item.setQuantite(itemDTO.getQuantite());
                item.setPrixUnitaire(itemDTO.getPrixUnitaire());
                item.calculateTotal();

                savedOrder.getItems().add(item);
                System.out.println("Item ajouté: " + item.getProduitLibelle() + " x " + item.getQuantite() + " = " + item.getTotalLigne());
            }

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