package com.prod.ploy.service;

import com.prod.ploy.dto.ConsoleChatMessageItem;
import com.prod.ploy.dto.ConsoleChatRoomListItem;
import com.prod.ploy.model.ChatRoom;
import com.prod.ploy.repository.ChatMessageRepository;
import com.prod.ploy.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsoleChatService {

    private final ChatRoomRepository    chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Transactional(readOnly = true)
    public Page<ConsoleChatRoomListItem> listRooms(int page, int size, String q) {
        String search = (q != null && !q.isBlank()) ? q.trim() : null;
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ChatRoom> roomPage = chatRoomRepository.searchRooms(search, pageable);

        // Batch-count messages to avoid N+1 (one query for all rooms on this page)
        List<Long> roomIds = roomPage.getContent().stream()
                .map(ChatRoom::getId).collect(Collectors.toList());
        Map<Long, Integer> countMap = new HashMap<>();
        if (!roomIds.isEmpty()) {
            chatMessageRepository.countByRoomIds(roomIds).forEach(row ->
                countMap.put((Long) row[0], ((Long) row[1]).intValue())
            );
        }
        return roomPage.map(r -> ConsoleChatRoomListItem.from(r, countMap.getOrDefault(r.getId(), 0)));
    }

    @Transactional(readOnly = true)
    public Page<ConsoleChatMessageItem> listMessages(Long roomId, int page, int size) {
        chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채팅방을 찾을 수 없습니다."));
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        return chatMessageRepository.findByChatRoomIdOrderByCreatedAtAsc(roomId, pageable)
                .map(ConsoleChatMessageItem::from);
    }
}
