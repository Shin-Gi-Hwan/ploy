package com.prod.ploy.controller;

import com.prod.ploy.dto.ConsoleReviewListItem;
import com.prod.ploy.model.Member;
import com.prod.ploy.service.ConsoleAuditLogService;
import com.prod.ploy.service.ConsoleReviewService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/console/reviews")
@RequiredArgsConstructor
public class ConsoleReviewController {

    private final ConsoleReviewService   service;
    private final ConsoleAuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<ConsoleReviewListItem>> list(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    String visible,
            @RequestParam(required = false)    String q) {
        return ResponseEntity.ok(service.listReviews(page, size, visible, q));
    }

    @PatchMapping("/{id}/visible")
    public ResponseEntity<ConsoleReviewListItem> updateVisible(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        Boolean visible = body.get("visible");
        ConsoleReviewListItem updated = service.updateVisibility(id, visible);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "REVIEW_VISIBILITY_CHANGED", "REVIEW", id,
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
                "REVIEW_DELETED", "REVIEW", id,
                null, null, request.getRemoteAddr(), null);
        return ResponseEntity.noContent().build();
    }
}
