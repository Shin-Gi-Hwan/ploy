package com.prod.ploy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs", indexes = {
    @Index(name = "idx_notif_status", columnList = "status"),
    @Index(name = "idx_notif_type",   columnList = "event_type"),
    @Index(name = "idx_notif_created",columnList = "created_at")
})
@Getter @Setter @NoArgsConstructor
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private NotificationEvent eventType;

    @Column(nullable = false, length = 200)
    private String recipientEmail;

    @Column(length = 100)
    private String recipientName;

    @Column(length = 300)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status = NotificationStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @Column(nullable = false)
    private Integer retryCount = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime sentAt;

    @PrePersist
    void prePersist() { createdAt = LocalDateTime.now(); }

    public enum NotificationEvent {
        INQUIRY_SUBMITTED, INQUIRY_APPROVED, INQUIRY_REJECTED,
        DRAFT_UPLOADED, REVISION_REQUESTED,
        FINAL_DELIVERY_UPLOADED, PROJECT_COMPLETED,
        PARTNER_APPROVED, PARTNER_REJECTED,
        MEMBER_REGISTERED
    }

    public enum NotificationStatus {
        PENDING, SENT, FAILED
    }
}
