package com.prod.ploy.controller;

import com.prod.ploy.dto.SystemSettingItem;
import com.prod.ploy.dto.SystemSettingUpdateRequest;
import com.prod.ploy.model.Member;
import com.prod.ploy.service.ConsoleAuditLogService;
import com.prod.ploy.service.ConsoleSettingsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/console/settings")
@RequiredArgsConstructor
public class ConsoleSettingsController {

    private final ConsoleSettingsService service;
    private final ConsoleAuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<SystemSettingItem>> getAll() {
        return ResponseEntity.ok(service.getAllSettings());
    }

    @PutMapping("/{key}")
    public ResponseEntity<SystemSettingItem> upsert(
            @PathVariable String key,
            @RequestBody SystemSettingUpdateRequest req,
            @AuthenticationPrincipal Member admin,
            HttpServletRequest request) {
        SystemSettingItem updated = service.upsert(key, req);
        auditLogService.log(admin.getId(), admin.getEmail(),
                "SETTING_UPDATED", "SETTING", null,
                null, key + "=" + req.value(), request.getRemoteAddr(), null);
        return ResponseEntity.ok(updated);
    }
}
