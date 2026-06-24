package com.prod.ploy.repository;

import com.prod.ploy.model.AdminAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long> {

    @Query(
        value = """
            SELECT a FROM AdminAuditLog a
            WHERE (:adminEmail IS NULL OR LOWER(a.adminEmail) LIKE LOWER(CONCAT('%', :adminEmail, '%')))
              AND (:actionType IS NULL OR a.actionType = :actionType)
              AND (:targetType IS NULL OR a.targetType = :targetType)
              AND (:from IS NULL OR a.createdAt >= :from)
              AND (:to IS NULL OR a.createdAt <= :to)
            ORDER BY a.createdAt DESC
        """,
        countQuery = """
            SELECT COUNT(a) FROM AdminAuditLog a
            WHERE (:adminEmail IS NULL OR LOWER(a.adminEmail) LIKE LOWER(CONCAT('%', :adminEmail, '%')))
              AND (:actionType IS NULL OR a.actionType = :actionType)
              AND (:targetType IS NULL OR a.targetType = :targetType)
              AND (:from IS NULL OR a.createdAt >= :from)
              AND (:to IS NULL OR a.createdAt <= :to)
        """
    )
    Page<AdminAuditLog> search(
            @Param("adminEmail") String adminEmail,
            @Param("actionType") String actionType,
            @Param("targetType") String targetType,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);
}
