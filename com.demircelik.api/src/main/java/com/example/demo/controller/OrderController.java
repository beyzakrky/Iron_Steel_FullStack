package com.example.demo.controller;
import com.example.demo.entity.Order;
import com.example.demo.entity.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.security.AccessControlService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/*
Mevcut controllera erişim kontrolü eklemek için;
AccessControlService'i inject edip, 
metodun en başında assertAccess(...) çağrılır. 

"orders" ismi ResourcePermissions.java'daki 
DEFAULT_ACCESS matrisindeki anahtarla birebir eşleşmelidir.
 */

/*
eski versiyon 
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        accessControlService.assertAccess(currentUser, "orders");  
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
*/

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final AccessControlService accessControlService;
    private final OrderRepository orderRepository;

    @GetMapping
    public List<Order> getOrders(@AuthenticationPrincipal User currentUser) {
        accessControlService.assertAccess(currentUser, "orders");
        return orderRepository.findAll();
    }
}