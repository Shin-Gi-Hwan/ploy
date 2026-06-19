package com.prod.ploy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payments_order_id",    columnList = "order_id"),
    @Index(name = "idx_payments_status",      columnList = "status"),
    @Index(name = "idx_payments_payment_key", columnList = "payment_key"),
    @Index(name = "idx_payments_approved_at", columnList = "approved_at"),
})
@Getter @Setter @NoArgsConstructor
public class Payment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentProvider paymentProvider;

    /** PG provider transaction key — unique within the provider */
    @Column(name = "payment_key", length = 255)
    private String paymentKey;

    /** Our internal unique payment request ID sent to the PG */
    @Column(nullable = false, unique = true, length = 100)
    private String merchantUid;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentStatus status = PaymentStatus.READY;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal requestedAmount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal approvedAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal cancelledAmount = BigDecimal.ZERO;

    @Column(nullable = false, length = 10)
    private String currency = "KRW";

    @Column(name = "requested_at") private LocalDateTime requestedAt;
    @Column(name = "approved_at")  private LocalDateTime approvedAt;
    @Column(name = "failed_at")    private LocalDateTime failedAt;
    @Column(name = "cancelled_at") private LocalDateTime cancelledAt;

    @Column(length = 100) private String failCode;
    @Column(length = 500) private String failMessage;

    /**
     * Raw PG response payload stored as TEXT.
     * (Use JSON column type if the DB/dialect supports it cleanly.)
     */
    @Column(columnDefinition = "TEXT")
    private String rawResponse;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentRefund> refunds = new ArrayList<>();

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt  = LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate() { updatedAt = LocalDateTime.now(); }

    // ── Enums ─────────────────────────────────────────────────────────────────

    public enum PaymentProvider {
        TOSS, IAMPORT, NAVER_PAY, KAKAO_PAY, MANUAL
    }

    public enum PaymentStatus {
        READY, REQUESTED, APPROVED, FAILED, CANCELLED, PARTIAL_CANCELLED, REFUNDED
    }

    public enum PaymentMethod {
        CARD, BANK_TRANSFER, VIRTUAL_ACCOUNT, EASY_PAY, PHONE, MANUAL
    }
}
