package com.prod.ploy.repository;

import com.prod.ploy.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByOrderId(Long orderId);

    /** Sum of approved amounts for today's revenue calculation */
    @Query("""
        SELECT COALESCE(SUM(p.approvedAmount), 0)
        FROM Payment p
        WHERE p.status = :status
          AND p.approvedAt >= :from
    """)
    BigDecimal sumApprovedAmountAfter(@Param("status") Payment.PaymentStatus status,
                                      @Param("from") LocalDateTime from);

    /** Daily approved amounts for the 7-day chart */
    @Query("""
        SELECT COALESCE(SUM(p.approvedAmount), 0)
        FROM Payment p
        WHERE p.status = :status
          AND p.approvedAt >= :from
          AND p.approvedAt < :to
    """)
    BigDecimal sumApprovedAmountBetween(@Param("status") Payment.PaymentStatus status,
                                        @Param("from") LocalDateTime from,
                                        @Param("to")   LocalDateTime to);
}
