package com.prod.ploy.controller;

import com.prod.ploy.dto.ConsoleAuditLogListItem;
import com.prod.ploy.service.ConsoleAuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/console/audit-logs")
@RequiredArgsConstructor
public class ConsoleAuditLogController {

    private final ConsoleAuditLogService service;

    @GetMapping
    public ResponseEntity<Page<ConsoleAuditLogListItem>> list(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    Long   adminId,
            @RequestParam(required = false)    String action,
            @RequestParam(required = false)    String targetType,
            @RequestParam(required = false)    String from,
            @RequestParam(required = false)    String to) {
        return ResponseEntity.ok(service.listLogs(page, size, adminId, action, targetType, from, to));
    }
}
