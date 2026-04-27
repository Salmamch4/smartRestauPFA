package com.smartpfa.orderservice.mappers.order;

import com.smartpfa.orderservice.dto.order.OrderRequestDTO;
import com.smartpfa.orderservice.dto.order.OrderResponseDTO;
import com.smartpfa.orderservice.entity.order.Order;
import com.smartpfa.orderservice.entity.order.OrderItem;
import com.smartpfa.orderservice.enums.OrderStatus;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public Order toEntity(OrderRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Order order = new Order();
        order.setNomClient(dto.getNomClient());
        order.setTelephone(dto.getTelephone());
        order.setNumeroTable(dto.getNumeroTable());
        order.setTotal(dto.getTotal());
        order.setStatut(OrderStatus.EN_CONFIRMATION);
        order.setNumeroCommande("CMD-" + System.currentTimeMillis());
        order.setDateCommande(LocalDateTime.now());

        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            order.setItems(dto.getItems().stream()
                    .map(this::toItemEntity)
                    .collect(Collectors.toList()));
        } else {
            order.setItems(new ArrayList<>());
        }

        return order;
    }

    private OrderItem toItemEntity(OrderRequestDTO.OrderItemRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        OrderItem item = new OrderItem();
        item.setProduitId(dto.getProduitId());
        item.setProduitLibelle(dto.getProduitLibelle());
        item.setQuantite(dto.getQuantite());
        item.setPrixUnitaire(dto.getPrixUnitaire());
        item.calculateTotal();
        return item;
    }

    public OrderResponseDTO toResponseDTO(Order order) {
        if (order == null) {
            return null;
        }

        OrderResponseDTO response = new OrderResponseDTO();

        // Gestion sécurisée de l'ID
        response.setId(order.getId() != null ? order.getId().toString() : null);
        response.setNumeroCommande(order.getNumeroCommande());
        response.setNomClient(order.getNomClient());
        response.setTelephone(order.getTelephone());
        response.setNumeroTable(order.getNumeroTable());

        // Gestion sécurisée du statut
        if (order.getStatut() != null) {
            response.setStatut(order.getStatut().name());
        } else {
            response.setStatut("EN_CONFIRMATION");
        }

        response.setTotal(order.getTotal());
        response.setDateCommande(order.getDateCommande());

        // Gestion sécurisée des items
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            response.setItems(order.getItems().stream()
                    .filter(item -> item != null)
                    .map(this::toItemResponseDTO)
                    .collect(Collectors.toList()));
        } else {
            response.setItems(new ArrayList<>());
        }

        return response;
    }

    private OrderResponseDTO.OrderItemResponseDTO toItemResponseDTO(OrderItem item) {
        if (item == null) {
            return null;
        }

        OrderResponseDTO.OrderItemResponseDTO itemDTO = new OrderResponseDTO.OrderItemResponseDTO();

        // Gestion sécurisée de l'ID
        itemDTO.setId(item.getId() != null ? item.getId().toString() : null);
        itemDTO.setProduitId(item.getProduitId());
        itemDTO.setProduitLibelle(item.getProduitLibelle());
        itemDTO.setQuantite(item.getQuantite());
        itemDTO.setPrixUnitaire(item.getPrixUnitaire());
        itemDTO.setTotalLigne(item.getTotalLigne());

        return itemDTO;
    }
}