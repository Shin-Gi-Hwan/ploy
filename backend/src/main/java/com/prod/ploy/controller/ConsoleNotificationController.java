package com.prod.ploy.controller;

import com.prod.ploy.dto.ConsoleNotificationListItem;
import com.prod.ploy.service.ConsoleNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/console/notifications")
@RequiredArgsConstructor
public class ConsoleNotificationController {

    private final ConsoleNotificationService service;

    @GetMapping
    public ResponseEntity<Page<ConsoleNotificationListItem>> list(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    String type,
            @RequestParam(required = false)    String status) {
        return ResponseEntity.ok(service.listNotifications(page, size, type, status));
    }

    @PostMapping("/{id}/retry")
    public ResponseEntity<ConsoleNotificationListItem> retry(@PathVariable Long id) {
        return ResponseEntity.ok(service.retry(id));
    }
}
