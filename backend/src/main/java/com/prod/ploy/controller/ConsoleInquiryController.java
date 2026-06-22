package com.prod.ploy.controller;

import com.prod.ploy.dto.*;
import com.prod.ploy.model.Member;
import com.prod.ploy.service.ConsoleAuditLogService;
import com.prod.ploy.service.ConsoleInquiryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/console/inquiries")
@RequiredArgsConstructor
public class ConsoleInquiryController {

    private final ConsoleInquiryService  service;
    private final ConsoleAuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<ConsoleProjectListItem>> list(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    String status,
            @RequestParam(required = false)    String q) {
        return ResponseEntity.ok(service.listInquiries(page, size, status, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsoleProjectDetail> detail(@PathVariable Long id) {
        return ResponseEntity.ok(service.getInquiry(id));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ConsoleProjectListItem> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        ConsoleProjectListItem updated = service.approve(id);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "INQUIRY_APPROVED", "PROJECT", id,
                null, "APPROVED", request.getRemoteAddr(), null);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ConsoleProjectListItem> reject(
            @PathVariable Long id,
            @RequestBody InquiryRejectRequest req,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        ConsoleProjectListItem updated = service.reject(id, req);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "INQUIRY_REJECTED", "PROJECT", id,
                null, req.reason(), request.getRemoteAddr(), null);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ConsoleProjectListItem> assign(
            @PathVariable Long id,
            @RequestBody InquiryAssignRequest req,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        ConsoleProjectListItem updated = service.assign(id, req);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "INQUIRY_PARTNER_ASSIGNED", "PROJECT", id,
                null, String.valueOf(req.freelancerId()), request.getRemoteAddr(), null);
        return ResponseEntity.ok(updated);
    }
}
