package com.prod.ploy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_items", indexes = {
    @Index(name = "idx_order_items_order_id",   columnList = "order_id"),
    @Index(name = "idx_order_items_product_id", columnList = "product_id"),
    @Index(name = "idx_order_items_project_id", columnList = "project_id"),
})
@Getter @Setter @NoArgsConstructor
public class OrderItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /** Nullable: physical product or e-book */
    @Column(name = "product_id")
    private Long productId;

    /** Nullable: outsourcing project payment */
    @Column(name = "project_id")
    private Long projectId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ItemType itemType;

    /** Snapshot of the product/service name at time of purchase */
    @Column(nullable = false, length = 255)
    private String itemName;

    @Column(nullable = false)
    private Integer quantity = 1;

    /** Snapshot unit price at time of purchase */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() { createdAt = LocalDateTime.now(); }

    public enum ItemType {
        PRODUCT,
        SERVICE,
        PROJECT_EXTRA_REVISION
    }
}
