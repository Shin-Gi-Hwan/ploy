package com.prod.ploy.controller;

import com.prod.ploy.dto.MemberDetailResponse;
import com.prod.ploy.dto.MemberListItem;
import com.prod.ploy.dto.MemberRoleUpdateRequest;
import com.prod.ploy.dto.MemberStatusUpdateRequest;
import com.prod.ploy.model.Member;
import com.prod.ploy.service.ConsoleUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/console/users")
@RequiredArgsConstructor
public class ConsoleUserController {

    private final ConsoleUserService service;

    @GetMapping
    public ResponseEntity<Page<MemberListItem>> list(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    String role,
            @RequestParam(required = false)    String active,
            @RequestParam(required = false)    String q) {
        return ResponseEntity.ok(service.listMembers(page, size, role, active, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberDetailResponse> detail(@PathVariable Long id) {
        return ResponseEntity.ok(service.getMember(id));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<MemberListItem> updateRole(
            @PathVariable Long id,
            @RequestBody MemberRoleUpdateRequest req,
            @AuthenticationPrincipal Member admin) {
        return ResponseEntity.ok(service.updateRole(id, req, admin.getId()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<MemberListItem> updateStatus(
            @PathVariable Long id,
            @RequestBody MemberStatusUpdateRequest req,
            @AuthenticationPrincipal Member admin) {
        return ResponseEntity.ok(service.updateStatus(id, req, admin.getId()));
    }
}
