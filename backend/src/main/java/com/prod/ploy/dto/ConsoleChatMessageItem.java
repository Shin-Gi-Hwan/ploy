package com.prod.ploy.dto;

import com.prod.ploy.model.ChatMessage;

import java.time.LocalDateTime;

public record ConsoleChatMessageItem(
        Long id,
        Long senderId,
        String senderName,
        String content,
        String attachmentUrl,
        LocalDateTime createdAt
) {
    public static ConsoleChatMessageItem from(ChatMessage m) {
        return new ConsoleChatMessageItem(
                m.getId(),
                m.getSender() != null ? m.getSender().getId()   : null,
                m.getSender() != null ? m.getSender().getName() : "시스템",
                m.getContent(),
                m.getAttachmentUrl(),
                m.getCreatedAt()
        );
    }
}
