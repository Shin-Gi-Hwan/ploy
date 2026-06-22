package com.prod.ploy.dto;

import com.prod.ploy.model.ChatRoom;

import java.time.LocalDateTime;

public record ConsoleChatRoomListItem(
        Long id,
        Long projectId,
        String projectTitle,
        String ownerName,
        String ownerEmail,
        int messageCount,
        LocalDateTime createdAt
) {
    public static ConsoleChatRoomListItem from(ChatRoom r, int messageCount) {
        var p = r.getProject();
        String title = p != null
                ? (p.getTitle() != null ? p.getTitle() : p.getType().name())
                : "—";
        String ownerName  = p != null ? p.getOwnerName() : "—";
        String ownerEmail = p != null && p.getMember() != null ? p.getMember().getEmail()
                          : p != null && p.getClient()  != null ? p.getClient().getEmail()
                          : null;
        return new ConsoleChatRoomListItem(
                r.getId(), p != null ? p.getId() : null,
                title, ownerName, ownerEmail,
                messageCount, r.getCreatedAt()
        );
    }
}
