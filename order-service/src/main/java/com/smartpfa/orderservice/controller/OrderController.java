package com.smartpfa.orderservice.controller;

import com.smartpfa.orderservice.dto.order.OrderRequestDTO;
import com.smartpfa.orderservice.dto.order.OrderResponseDTO;
import com.smartpfa.orderservice.service.order.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    @Autowired
    private IOrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        List<OrderResponseDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<OrderResponseDTO>> getPendingOrders() {
        List<OrderResponseDTO> orders = orderService.getPendingOrders();
        return ResponseEntity.ok(orders);
    }

    // ✅ NOUVEAU ENDPOINT - Commandes confirmées
    @GetMapping("/confirmed")
    public ResponseEntity<List<OrderResponseDTO>> getConfirmedOrders() {
        List<OrderResponseDTO> orders = orderService.getConfirmedOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/inprogress")
    public ResponseEntity<List<OrderResponseDTO>> getInProgressOrders() {
        List<OrderResponseDTO> orders = orderService.getInProgressOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/ready")
    public ResponseEntity<List<OrderResponseDTO>> getReadyOrders() {
        List<OrderResponseDTO> orders = orderService.getReadyOrders();
        return ResponseEntity.ok(orders);
    }

    // ✅ NOUVEAU ENDPOINT - Commandes livrées
    @GetMapping("/delivered")
    public ResponseEntity<List<OrderResponseDTO>> getDeliveredOrders() {
        List<OrderResponseDTO> orders = orderService.getDeliveredOrders();
        return ResponseEntity.ok(orders);
    }

    // ✅ NOUVEAU ENDPOINT - Commandes annulées
    @GetMapping("/cancelled")
    public ResponseEntity<List<OrderResponseDTO>> getCancelledOrders() {
        List<OrderResponseDTO> orders = orderService.getCancelledOrders();
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO request) {
        OrderResponseDTO response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable UUID id) {
        OrderResponseDTO order = orderService.getOrderById(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<OrderResponseDTO> confirmOrder(@PathVariable UUID id) {
        OrderResponseDTO order = orderService.confirmOrder(id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<OrderResponseDTO> startOrder(@PathVariable UUID id) {
        OrderResponseDTO order = orderService.startOrder(id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<OrderResponseDTO> completeOrder(@PathVariable UUID id) {
        OrderResponseDTO order = orderService.completeOrder(id);
        return ResponseEntity.ok(order);
    }

    // ✅ NOUVEAU ENDPOINT - Marquer comme livrée
    @PutMapping("/{id}/deliver")
    public ResponseEntity<OrderResponseDTO> deliverOrder(@PathVariable UUID id) {
        OrderResponseDTO order = orderService.deliverOrder(id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponseDTO> cancelOrder(@PathVariable UUID id) {
        OrderResponseDTO order = orderService.cancelOrder(id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/items/{itemId}/invalidate")
    public ResponseEntity<OrderResponseDTO> invalidateItem(
            @PathVariable UUID id,
            @PathVariable Long itemId) {
        OrderResponseDTO order = orderService.invalidateItem(id, itemId);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/items/{itemId}/revalidate")
    public ResponseEntity<OrderResponseDTO> revalidateItem(
            @PathVariable UUID id,
            @PathVariable Long itemId) {
        OrderResponseDTO order = orderService.revalidateItem(id, itemId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/telephone/{telephone}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByTelephone(@PathVariable String telephone) {
        List<OrderResponseDTO> orders = orderService.getOrdersByTelephone(telephone);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Application is working!");
    }

    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debug() {
        Map<String, Object> debug = new HashMap<>();
        try {
            debug.put("status", "OK");
            debug.put("message", "Controller is reachable");

            try {
                List<OrderResponseDTO> orders = orderService.getAllOrders();
                debug.put("serviceCall", "Success");
                debug.put("ordersCount", orders != null ? orders.size() : 0);
            } catch (Exception e) {
                debug.put("serviceCall", "Error: " + e.getMessage());
                debug.put("serviceError", e.getClass().getName());
            }

            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            debug.put("status", "ERROR");
            debug.put("error", e.getMessage());
            debug.put("stackTrace", e.getClass().getName());
            return ResponseEntity.status(500).body(debug);
        }
    }
}