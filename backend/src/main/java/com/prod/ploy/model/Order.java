package com.prod.ploy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_orders_member_id",  columnList = "member_id"),
    @Index(name = "idx_orders_status",     columnList = "status"),
    @Index(name = "idx_orders_created_at", columnList = "created_at"),
})
@Getter @Setter @NoArgsConstructor
public class Order {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String orderNo;

    // Nullable: guest orders don't have a member
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // Guest info (set when member is null)
    @Column(length = 255)
    private String guestEmail;
    @Column(length = 100)
    private String guestName;
    @Column(length = 30)
    private String guestPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderType orderType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalProductAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal deliveryFee = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPaymentAmount = BigDecimal.ZERO;

    // Delivery info
    @Column(length = 100) private String receiverName;
    @Column(length = 30)  private String receiverPhone;
    @Column(length = 20)  private String postalCode;
    @Column(length = 255) private String address1;
    @Column(length = 255) private String address2;
    @Column(length = 500) private String deliveryMemo;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt  = LocalDateTime.now();
        if (orderNo == null) {
            orderNo = "ORD-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        }
    }

    @PreUpdate
    void preUpdate() { updatedAt = LocalDateTime.now(); }

    // ── Enums ─────────────────────────────────────────────────────────────────

    public enum OrderType {
        PRODUCT,
        SERVICE,
        PROJECT_EXTRA_REVISION
    }

    public enum OrderStatus {
        PENDING,
        PAYMENT_READY,
        PAID,
        PREPARING,
        SHIPPED,
        DELIVERED,
        CANCELLED,
        REFUNDED,
        PARTIAL_REFUNDED,
        FAILED
    }
}
