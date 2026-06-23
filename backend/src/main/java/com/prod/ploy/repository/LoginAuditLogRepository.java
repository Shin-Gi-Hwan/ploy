package com.prod.ploy.repository;

import com.prod.ploy.model.LoginAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface LoginAuditLogRepository extends JpaRepository<LoginAuditLog, Long> {

    @Query("""
        SELECT l FROM LoginAuditLog l
        WHERE (:provider  IS NULL OR l.provider  = :provider)
          AND (:success   IS NULL OR l.success   = :success)
          AND (:from      IS NULL OR l.createdAt >= :from)
          AND (:to        IS NULL OR l.createdAt <= :to)
        ORDER BY l.createdAt DESC
        """)
    Page<LoginAuditLog> search(
            @Param("provider") String provider,
            @Param("success")  Boolean success,
            @Param("from")     LocalDateTime from,
            @Param("to")       LocalDateTime to,
            Pageable pageable);
}
