package com.prod.ploy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_audit_logs", indexes = {
    @Index(name = "idx_login_audit_member",   columnList = "member_id"),
    @Index(name = "idx_login_audit_provider", columnList = "provider"),
    @Index(name = "idx_login_audit_created",  columnList = "created_at")
})
@Getter @Setter @NoArgsConstructor
public class LoginAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "member_email", length = 200)
    private String memberEmail;

    @Column(name = "member_name", length = 100)
    private String memberName;

    /** google | kakao | naver | email */
    @Column(nullable = false, length = 30)
    private String provider;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(nullable = false)
    private boolean success;

    @Column(name = "failure_reason", length = 300)
    private String failureReason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() { createdAt = LocalDateTime.now(); }
}
