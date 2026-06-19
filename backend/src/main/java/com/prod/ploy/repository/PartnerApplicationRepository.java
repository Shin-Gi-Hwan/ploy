package com.prod.ploy.repository;

import com.prod.ploy.model.PartnerApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PartnerApplicationRepository extends JpaRepository<PartnerApplication, Long> {
    Optional<PartnerApplication> findByMemberId(Long memberId);
    boolean existsByMemberId(Long memberId);
    List<PartnerApplication> findAllByOrderByAppliedAtDesc();

    long countByStatus(PartnerApplication.ApplicationStatus status);
    List<PartnerApplication> findTop5ByOrderByAppliedAtDesc();

    @Query(
        value = """
            SELECT a FROM PartnerApplication a
            JOIN a.member m
            WHERE (:status IS NULL OR a.status = :status)
              AND (:q IS NULL
                   OR LOWER(m.name)  LIKE LOWER(CONCAT('%', :q, '%'))
                   OR LOWER(m.email) LIKE LOWER(CONCAT('%', :q, '%')))
            ORDER BY a.appliedAt DESC
        """,
        countQuery = """
            SELECT COUNT(a) FROM PartnerApplication a
            JOIN a.member m
            WHERE (:status IS NULL OR a.status = :status)
              AND (:q IS NULL
                   OR LOWER(m.name)  LIKE LOWER(CONCAT('%', :q, '%'))
                   OR LOWER(m.email) LIKE LOWER(CONCAT('%', :q, '%')))
        """
    )
    Page<PartnerApplication> searchApplications(@Param("status") PartnerApplication.ApplicationStatus status,
                                                @Param("q")      String q,
                                                Pageable pageable);
}
