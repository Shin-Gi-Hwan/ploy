package com.prod.ploy.controller;

import com.prod.ploy.dto.ConsolePartnerDetail;
import com.prod.ploy.dto.ConsolePartnerListItem;
import com.prod.ploy.dto.PartnerActiveRequest;
import com.prod.ploy.dto.PartnerRejectRequest;
import com.prod.ploy.service.ConsolePartnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/console/partners")
@RequiredArgsConstructor
public class ConsolePartnerController {

    private final ConsolePartnerService service;

    @GetMapping
    public ResponseEntity<Page<ConsolePartnerListItem>> list(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    String status,
            @RequestParam(required = false)    String q) {
        return ResponseEntity.ok(service.listPartners(page, size, status, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsolePartnerDetail> detail(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPartner(id));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ConsolePartnerListItem> approve(@PathVariable Long id) {
        return ResponseEntity.ok(service.approve(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ConsolePartnerListItem> reject(
            @PathVariable Long id,
            @RequestBody PartnerRejectRequest req) {
        return ResponseEntity.ok(service.reject(id, req));
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<ConsolePartnerListItem> updateActive(
            @PathVariable Long id,
            @RequestBody PartnerActiveRequest req) {
        return ResponseEntity.ok(service.updateActive(id, req));
    }
}
