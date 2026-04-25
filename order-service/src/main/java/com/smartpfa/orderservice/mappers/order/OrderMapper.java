package com.smartpfa.orderservice.mappers.order;

import com.smartpfa.orderservice.dto.order.OrderRequestDTO;
import com.smartpfa.orderservice.dto.order.OrderResponseDTO;
import com.smartpfa.orderservice.entity.order.Order;
import com.smartpfa.orderservice.entity.order.OrderItem;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public Order toEntity(OrderRequestDTO dto) {
        Order order = new Order();
        order.setNomClient(dto.getNomClient());
        order.setTelephone(dto.getTelephone());
        order.setNumeroTable(dto.getNumeroTable());
        order.setTotal(dto.getTotal());
        order.setStatut(com.smartpfa.orderservice.enums.OrderStatus.EN_ATTENTE);
        order.setNumeroCommande("CMD-" + System.currentTimeMillis());
        order.setDateCommande(LocalDateTime.now());

        if (dto.getItems() != null) {
            order.setItems(dto.getItems().stream()
                    .map(this::toItemEntity)
                    .collect(Collectors.toList()));
        }
        return order;
    }

    private OrderItem toItemEntity(OrderRequestDTO.OrderItemRequestDTO dto) {
        OrderItem item = new OrderItem();
        item.setProduitId(dto.getProduitId());
        item.setProduitLibelle(dto.getProduitLibelle());
        item.setQuantite(dto.getQuantite());
        item.setPrixUnitaire(dto.getPrixUnitaire());
        item.calculateTotal();
        return item;
    }

    public OrderResponseDTO toResponseDTO(Order order) {
        OrderResponseDTO response = new OrderResponseDTO();
        response.setId(order.getId().toString());
        response.setNumeroCommande(order.getNumeroCommande());
        response.setNomClient(order.getNomClient());
        response.setTelephone(order.getTelephone());
        response.setNumeroTable(order.getNumeroTable());
        response.setStatut(order.getStatut() != null ? order.getStatut().name() : "EN_ATTENTE");
        response.setTotal(order.getTotal());
        response.setDateCommande(order.getDateCommande());

        if (order.getItems() != null) {
            response.setItems(order.getItems().stream()
                    .map(this::toItemResponseDTO)
                    .collect(Collectors.toList()));
        }
        return response;
    }

    private OrderResponseDTO.OrderItemResponseDTO toItemResponseDTO(OrderItem item) {
        OrderResponseDTO.OrderItemResponseDTO itemDTO = new OrderResponseDTO.OrderItemResponseDTO();
        itemDTO.setId(item.getId().toString());
        itemDTO.setProduitId(item.getProduitId());
        itemDTO.setProduitLibelle(item.getProduitLibelle());
        itemDTO.setQuantite(item.getQuantite());
        itemDTO.setPrixUnitaire(item.getPrixUnitaire());
        itemDTO.setTotalLigne(item.getTotalLigne());
        return itemDTO;
    }
}