package com.prod.ploy.controller;

import com.prod.ploy.dto.ConsoleProductListItem;
import com.prod.ploy.dto.ProductUpsertRequest;
import com.prod.ploy.model.Member;
import com.prod.ploy.service.ConsoleAuditLogService;
import com.prod.ploy.service.ConsoleProductService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/console/products")
@RequiredArgsConstructor
public class ConsoleProductController {

    private final ConsoleProductService  service;
    private final ConsoleAuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<ConsoleProductListItem>> list(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    String type,
            @RequestParam(required = false)    String visible,
            @RequestParam(required = false)    String q) {
        return ResponseEntity.ok(service.listProducts(page, size, type, visible, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsoleProductListItem> detail(@PathVariable Long id) {
        return ResponseEntity.ok(service.getProduct(id));
    }

    @PostMapping
    public ResponseEntity<ConsoleProductListItem> create(
            @RequestBody ProductUpsertRequest req,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        ConsoleProductListItem created = service.create(req);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "PRODUCT_CREATED", "PRODUCT", created.id(),
                null, created.name(), request.getRemoteAddr(), null);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsoleProductListItem> update(
            @PathVariable Long id,
            @RequestBody ProductUpsertRequest req,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        ConsoleProductListItem updated = service.update(id, req);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "PRODUCT_UPDATED", "PRODUCT", id,
                null, req.name(), request.getRemoteAddr(), null);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/visibility")
    public ResponseEntity<ConsoleProductListItem> updateVisibility(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        Boolean visible = body.get("visible");
        ConsoleProductListItem updated = service.updateVisibility(id, visible);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "PRODUCT_VISIBILITY_CHANGED", "PRODUCT", id,
                null, String.valueOf(visible), request.getRemoteAddr(), null);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        service.delete(id);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "PRODUCT_DELETED", "PRODUCT", id,
                null, null, request.getRemoteAddr(), null);
        return ResponseEntity.noContent().build();
    }
}
