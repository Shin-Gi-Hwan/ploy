package com.prod.ploy.service;

import com.prod.ploy.dto.ConsoleNotificationListItem;
import com.prod.ploy.model.NotificationLog;
import com.prod.ploy.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ConsoleNotificationService {

    private final NotificationLogRepository notificationLogRepository;

    @Transactional(readOnly = true)
    public Page<ConsoleNotificationListItem> listNotifications(int page, int size, String typeStr, String statusStr) {
        NotificationLog.NotificationEvent eventType = null;
        if (typeStr != null && !typeStr.isBlank()) {
            try { eventType = NotificationLog.NotificationEvent.valueOf(typeStr.toUpperCase()); } catch (IllegalArgumentException ignored) {}
        }
        NotificationLog.NotificationStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try { status = NotificationLog.NotificationStatus.valueOf(statusStr.toUpperCase()); } catch (IllegalArgumentException ignored) {}
        }
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return notificationLogRepository.search(eventType, status, pageable).map(ConsoleNotificationListItem::from);
    }

    /** Placeholder retry — marks FAILED → PENDING for future job to pick up */
    @Transactional
    public ConsoleNotificationListItem retry(Long id) {
        NotificationLog n = notificationLogRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "알림을 찾을 수 없습니다."));
        if (n.getStatus() != NotificationLog.NotificationStatus.FAILED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "실패 상태인 알림만 재시도할 수 있습니다.");
        }
        n.setStatus(NotificationLog.NotificationStatus.PENDING);
        n.setRetryCount(n.getRetryCount() + 1);
        return ConsoleNotificationListItem.from(notificationLogRepository.save(n));
    }
}
