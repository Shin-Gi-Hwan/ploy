package com.prod.ploy.repository;

import com.prod.ploy.model.NotificationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {

    @Query(
        value = """
            SELECT n FROM NotificationLog n
            WHERE (:eventType IS NULL OR n.eventType = :eventType)
              AND (:status IS NULL OR n.status = :status)
            ORDER BY n.createdAt DESC
        """,
        countQuery = """
            SELECT COUNT(n) FROM NotificationLog n
            WHERE (:eventType IS NULL OR n.eventType = :eventType)
              AND (:status IS NULL OR n.status = :status)
        """
    )
    Page<NotificationLog> search(
            @Param("eventType") NotificationLog.NotificationEvent eventType,
            @Param("status") NotificationLog.NotificationStatus status,
            Pageable pageable);

    Page<NotificationLog> findByRecipientEmailOrderByCreatedAtDesc(String email, Pageable pageable);
}
