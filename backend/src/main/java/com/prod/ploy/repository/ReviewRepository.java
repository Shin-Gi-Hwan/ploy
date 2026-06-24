package com.prod.ploy.repository;

import com.prod.ploy.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query(
        value = """
            SELECT r FROM Review r
            LEFT JOIN r.member m
            LEFT JOIN r.project p
            WHERE r.deleted = false
              AND (:visible IS NULL OR r.visible = :visible)
              AND (:q IS NULL
                   OR LOWER(m.name)    LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(r.content) LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(p.title)   LIKE LOWER(CONCAT('%',:q,'%')))
            ORDER BY r.createdAt DESC
        """,
        countQuery = """
            SELECT COUNT(r) FROM Review r
            LEFT JOIN r.member m
            LEFT JOIN r.project p
            WHERE r.deleted = false
              AND (:visible IS NULL OR r.visible = :visible)
              AND (:q IS NULL
                   OR LOWER(m.name)    LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(r.content) LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(p.title)   LIKE LOWER(CONCAT('%',:q,'%')))
        """
    )
    Page<Review> searchReviews(
            @Param("visible") Boolean visible,
            @Param("q") String q,
            Pageable pageable);

    @Query("""
        SELECT r FROM Review r LEFT JOIN FETCH r.member
        WHERE r.productId = :productId
          AND r.deleted = false AND r.visible = true
        ORDER BY r.createdAt DESC
    """)
    Page<Review> findVisibleByProductId(@Param("productId") Long productId, Pageable pageable);

    boolean existsByMemberIdAndProductId(Long memberId, Long productId);
}
