package com.prod.ploy.controller;

import com.prod.ploy.dto.ConsoleNotificationListItem;
import com.prod.ploy.model.Member;
import com.prod.ploy.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/notifications/my")
@RequiredArgsConstructor
public class UserNotificationController {

    private final NotificationLogRepository repo;

    @GetMapping
    public ResponseEntity<Page<ConsoleNotificationListItem>> myNotifications(
            @AuthenticationPrincipal Member member,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        if (member == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return ResponseEntity.ok(
                repo.findByRecipientEmailOrderByCreatedAtDesc(member.getEmail(), PageRequest.of(page, size))
                    .map(ConsoleNotificationListItem::from));
    }
}
