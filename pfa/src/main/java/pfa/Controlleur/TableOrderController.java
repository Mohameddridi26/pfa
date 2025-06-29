package pfa.Controlleur;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pfa.Entity.TableOrder;
import pfa.Service.TableOrderService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Collections;
import java.util.ArrayList;
import java.util.Date;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class TableOrderController {

    // Endpoint pour tester le front avec des données mockées
    @GetMapping("/mock")
    public List<Map<String, Object>> getMockOrders() {
        List<Map<String, Object>> mockOrders = new ArrayList<>();
        // Table 12 - NOUVELLE
        mockOrders.add(Map.of(
            "id", "1",
            "tableNumber", 12,
            "status", "NOUVELLE",
            "items", List.of(
                Map.of("name", "Burger Royal", "type", "PLAT", "quantity", 2),
                Map.of("name", "Frites", "type", "PLAT", "quantity", 2),
                Map.of("name", "Coca Cola", "type", "BOISSON", "quantity", 2)
            ),
            "specialNotes", List.of("Sans oignons"),
            "estimatedTime", 15,
            "timeElapsed", 5,
            "createdAt", new Date(),
            "updatedAt", new Date()
        ));
        // Table 8 - EN_COURS
        mockOrders.add(Map.of(
            "id", "2",
            "tableNumber", 8,
            "status", "EN_COURS",
            "items", List.of(
                Map.of("name", "Salade César", "type", "ENTRÉE", "quantity", 1),
                Map.of("name", "Saumon grillé", "type", "PLAT", "quantity", 1),
                Map.of("name", "Vin blanc", "type", "BOISSON", "quantity", 1)
            ),
            "specialNotes", List.of("Cuisson à point"),
            "estimatedTime", 20,
            "timeElapsed", 12,
            "createdAt", new Date(),
            "updatedAt", new Date()
        ));
        // Table 15 - PRETE
        mockOrders.add(Map.of(
            "id", "3",
            "tableNumber", 15,
            "status", "PRETE",
            "items", List.of(
                Map.of("name", "Pizza Margherita", "type", "PLAT", "quantity", 1),
                Map.of("name", "Tiramisu", "type", "DESSERT", "quantity", 1)
            ),
            "specialNotes", List.of(),
            "estimatedTime", 12,
            "timeElapsed", 18,
            "createdAt", new Date(),
            "updatedAt", new Date()
        ));
        return mockOrders;
    }
    @Autowired
    private TableOrderService service;

    @GetMapping
    public List<Map<String, Object>> getAllOrders() {
        List<TableOrder> orders = service.getAllOrders();
        return orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("tableNumber", order.getTableNumber());
            // Map status to Angular expected values
            String status = order.getStatus();
            if (status != null) {
                switch (status.toUpperCase()) {
                    case "NOUVELLE":
                        map.put("status", "NOUVELLE");
                        break;
                    case "EN COURS":
                    case "EN_COURS":
                        map.put("status", "EN_COURS");
                        break;
                    case "PRETE":
                        map.put("status", "PRETE");
                        break;
                    case "SERVIE":
                        map.put("status", "SERVIE");
                        break;
                    default:
                        map.put("status", status);
                }
            } else {
                map.put("status", "NOUVELLE");
            }
            map.put("items", order.getItems());
            // specialNotes as list
            map.put("specialNotes", order.getSpecialInstructions() != null ? List.of(order.getSpecialInstructions()) : Collections.emptyList());
            // Convert "5min" to int
            map.put("estimatedTime", parseMinutes(order.getPreparationTime()));
            // Calculate timeElapsed
            map.put("timeElapsed", calcElapsedMinutes(order.getTimestamp()));
            map.put("createdAt", order.getTimestamp());
            map.put("updatedAt", order.getTimestamp());
            return map;
        }).collect(Collectors.toList());
    }

    private int parseMinutes(String prep) {
        if (prep == null) return 0;
        try {
            return Integer.parseInt(prep.replaceAll("\\D", ""));
        } catch (Exception e) {
            return 0;
        }
    }

    private int calcElapsedMinutes(Date timestamp) {
        if (timestamp == null) return 0;
        long diff = (new Date().getTime() - timestamp.getTime()) / (60 * 1000);
        return (int) diff;
    }

    @GetMapping("/{id}")
    public ResponseEntity<TableOrder> getOrderById(@PathVariable String id) {
        return service.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public TableOrder addOrder(@RequestBody TableOrder order) {
        return service.addOrder(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TableOrder> updateOrder(@PathVariable String id, @RequestBody TableOrder order) {
        TableOrder updatedOrder = service.updateOrder(id, order);
        return updatedOrder != null ? ResponseEntity.ok(updatedOrder) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        service.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}