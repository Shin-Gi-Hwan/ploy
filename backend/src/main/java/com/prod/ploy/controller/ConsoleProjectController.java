package com.prod.ploy.controller;

import com.prod.ploy.dto.*;
import com.prod.ploy.model.Member;
import com.prod.ploy.service.ConsoleAuditLogService;
import com.prod.ploy.service.ConsoleProjectService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/console/projects")
@RequiredArgsConstructor
public class ConsoleProjectController {

    private final ConsoleProjectService service;
    private final ConsoleAuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<ConsoleProjectListItem>> list(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    String status,
            @RequestParam(required = false)    String q) {
        return ResponseEntity.ok(service.listProjects(page, size, status, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsoleProjectDetail> detail(@PathVariable Long id) {
        return ResponseEntity.ok(service.getProject(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ConsoleProjectListItem> updateStatus(
            @PathVariable Long id,
            @RequestBody ProjectStatusUpdateRequest req,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        ConsoleProjectListItem updated = service.updateStatus(id, req);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "PROJECT_STATUS_CHANGE", "PROJECT", id,
                null, req.status(), request.getRemoteAddr(), null);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<ConsoleProjectListItem> addNote(
            @PathVariable Long id,
            @RequestBody ProjectNoteRequest req,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        ConsoleProjectListItem updated = service.addNote(id, req);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "PROJECT_NOTE_ADDED", "PROJECT", id,
                null, req.note(), request.getRemoteAddr(), null);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ConsoleProjectListItem> assign(
            @PathVariable Long id,
            @RequestBody ProjectAssignRequest req,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        ConsoleProjectListItem updated = service.assign(id, req);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "PROJECT_ASSIGNED", "PROJECT", id,
                null, String.valueOf(req.freelancerId()), request.getRemoteAddr(), null);
        return ResponseEntity.ok(updated);
    }
}
