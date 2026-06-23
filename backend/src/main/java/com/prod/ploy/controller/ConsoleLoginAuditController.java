package com.prod.ploy.controller;

import com.prod.ploy.dto.ConsoleLoginAuditListItem;
import com.prod.ploy.service.LoginAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/console/login-audits")
@RequiredArgsConstructor
public class ConsoleLoginAuditController {

    private final LoginAuditService service;

    @GetMapping
    public ResponseEntity<Page<ConsoleLoginAuditListItem>> list(
            @RequestParam(defaultValue = "0")  int     page,
            @RequestParam(defaultValue = "20") int     size,
            @RequestParam(required = false)    String  provider,
            @RequestParam(required = false)    Boolean success,
            @RequestParam(required = false)    String  from,
            @RequestParam(required = false)    String  to) {
        return ResponseEntity.ok(service.list(page, size, provider, success, from, to));
    }
}
