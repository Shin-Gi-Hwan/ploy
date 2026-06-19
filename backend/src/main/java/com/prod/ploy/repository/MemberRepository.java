package com.prod.ploy.repository;

import com.prod.ploy.model.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);

    long countByRole(Member.UserRole role);
    long countByCreatedAtAfter(LocalDateTime dateTime);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Member> findTop10ByOrderByCreatedAtDesc();

    @Query("""
        SELECT m FROM Member m
        WHERE (:role IS NULL OR m.role = :role)
          AND (:active IS NULL OR m.active = :active)
          AND (:q IS NULL
               OR LOWER(m.name)  LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(m.email) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY m.createdAt DESC
    """)
    Page<Member> searchMembers(@Param("role")   Member.UserRole role,
                               @Param("active") Boolean active,
                               @Param("q")      String q,
                               Pageable pageable);
}
