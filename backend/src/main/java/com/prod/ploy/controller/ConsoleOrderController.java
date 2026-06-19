package com.prod.ploy.controller;

import com.prod.ploy.dto.ConsoleOrderDetail;
import com.prod.ploy.dto.ConsoleOrderListItem;
import com.prod.ploy.service.ConsoleOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/console/orders")
@RequiredArgsConstructor
public class ConsoleOrderController {

    private final ConsoleOrderService service;

    @GetMapping
    public ResponseEntity<Page<ConsoleOrderListItem>> list(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    String status,
            @RequestParam(required = false)    String q) {
        return ResponseEntity.ok(service.listOrders(page, size, status, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsoleOrderDetail> detail(@PathVariable Long id) {
        return ResponseEntity.ok(service.getOrder(id));
    }
}
