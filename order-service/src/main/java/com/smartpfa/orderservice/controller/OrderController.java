package com.smartpfa.orderservice.controller;

import com.smartpfa.orderservice.dto.OrderRequest;
import com.smartpfa.orderservice.dto.OrderResponse;
import com.smartpfa.orderservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    // ==================== CRUD ====================

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== CHEF CUISINIER ====================

    @GetMapping("/pending")
    public List<OrderResponse> getPendingOrders() {
        return orderService.getPendingOrders();
    }

    @GetMapping("/inprogress")
    public List<OrderResponse> getInProgressOrders() {
        return orderService.getInProgressOrders();
    }

    @PutMapping("/{orderId}/items/{itemId}/invalidate")
    public ResponseEntity<OrderResponse> invalidateItem(
            @PathVariable Long orderId,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(orderService.invalidateItem(orderId, itemId));
    }

    // ✅ NOUVEAU - Revalider un item (Indisponible → Disponible)
    @PutMapping("/{orderId}/items/{itemId}/revalidate")
    public ResponseEntity<OrderResponse> revalidateItem(
            @PathVariable Long orderId,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(orderService.revalidateItem(orderId, itemId));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<OrderResponse> clientAcceptsOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.clientAcceptsOrder(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<OrderResponse> startOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.startOrder(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<OrderResponse> completeOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.completeOrder(id));
    }
}