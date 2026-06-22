package com.prod.ploy.dto;

import com.prod.ploy.model.NotificationLog;

import java.time.LocalDateTime;

public record ConsoleNotificationListItem(
        Long id,
        String eventType,
        String status,
        String recipientEmail,
        String recipientName,
        String subject,
        String errorMessage,
        Integer retryCount,
        LocalDateTime createdAt,
        LocalDateTime sentAt
) {
    public static ConsoleNotificationListItem from(NotificationLog n) {
        return new ConsoleNotificationListItem(
                n.getId(), n.getEventType().name(), n.getStatus().name(),
                n.getRecipientEmail(), n.getRecipientName(),
                n.getSubject(), n.getErrorMessage(), n.getRetryCount(),
                n.getCreatedAt(), n.getSentAt()
        );
    }
}
