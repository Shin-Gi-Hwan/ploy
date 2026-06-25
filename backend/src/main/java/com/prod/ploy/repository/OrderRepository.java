package com.prod.ploy.repository;

import com.prod.ploy.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query(
        value = """
            SELECT o FROM Order o
            LEFT JOIN o.member m
            WHERE (:status IS NULL OR o.status = :status)
              AND (:q IS NULL
                   OR LOWER(o.orderNo)    LIKE LOWER(CONCAT('%', :q, '%'))
                   OR LOWER(o.guestEmail) LIKE LOWER(CONCAT('%', :q, '%'))
                   OR LOWER(o.guestName)  LIKE LOWER(CONCAT('%', :q, '%'))
                   OR (m IS NOT NULL AND (
                        LOWER(m.name)  LIKE LOWER(CONCAT('%', :q, '%'))
                     OR LOWER(m.email) LIKE LOWER(CONCAT('%', :q, '%')))))
            ORDER BY o.createdAt DESC
        """,
        countQuery = """
            SELECT COUNT(o) FROM Order o
            LEFT JOIN o.member m
            WHERE (:status IS NULL OR o.status = :status)
              AND (:q IS NULL
                   OR LOWER(o.orderNo)    LIKE LOWER(CONCAT('%', :q, '%'))
                   OR LOWER(o.guestEmail) LIKE LOWER(CONCAT('%', :q, '%'))
                   OR LOWER(o.guestName)  LIKE LOWER(CONCAT('%', :q, '%'))
                   OR (m IS NOT NULL AND (
                        LOWER(m.name)  LIKE LOWER(CONCAT('%', :q, '%'))
                     OR LOWER(m.email) LIKE LOWER(CONCAT('%', :q, '%')))))
        """
    )
    Page<Order> searchOrders(@Param("status") Order.OrderStatus status,
                             @Param("q")      String q,
                             Pageable pageable);

    @Query("""
        SELECT COUNT(o) > 0 FROM Order o JOIN o.items i
        WHERE o.member.id = :memberId
          AND i.productId = :productId
          AND o.status IN :statuses
    """)
    boolean hasPurchasedProduct(@Param("memberId")  Long memberId,
                                @Param("productId") Long productId,
                                @Param("statuses")  java.util.List<Order.OrderStatus> statuses);

    @Query("SELECT o FROM Order o WHERE o.member.id = :memberId ORDER BY o.createdAt DESC")
    Page<Order> findByMemberId(@Param("memberId") Long memberId, Pageable pageable);
}
