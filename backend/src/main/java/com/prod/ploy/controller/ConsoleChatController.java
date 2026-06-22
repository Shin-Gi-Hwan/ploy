package com.prod.ploy.controller;

import com.prod.ploy.dto.ConsoleChatMessageItem;
import com.prod.ploy.dto.ConsoleChatRoomListItem;
import com.prod.ploy.service.ConsoleChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/console/chat")
@RequiredArgsConstructor
public class ConsoleChatController {

    private final ConsoleChatService service;

    @GetMapping("/rooms")
    public ResponseEntity<Page<ConsoleChatRoomListItem>> listRooms(
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    String q) {
        return ResponseEntity.ok(service.listRooms(page, size, q));
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<Page<ConsoleChatMessageItem>> listMessages(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0")   int page,
            @RequestParam(defaultValue = "50")  int size) {
        return ResponseEntity.ok(service.listMessages(roomId, page, size));
    }
}
