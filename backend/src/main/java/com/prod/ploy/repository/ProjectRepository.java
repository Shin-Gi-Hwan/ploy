package com.prod.ploy.repository;

import com.prod.ploy.model.Member;
import com.prod.ploy.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findByMagicToken(String magicToken);

    // Admin list: eager-load client, member, and deliverables to prevent N+1 queries.
    @EntityGraph(attributePaths = {"client", "member", "deliverables"})
    List<Project> findAllByOrderByCreatedAtDesc();

    // Client dashboard: projects for a registered member
    @EntityGraph(attributePaths = {"member", "freelancer", "deliverables"})
    List<Project> findByMemberOrderByCreatedAtDesc(Member member);

    // Single project access — verifies ownership in one query
    Optional<Project> findByIdAndMember(Long id, Member member);

    long countByStatus(Project.ProjectStatus status);
    long countByCreatedAtAfter(LocalDateTime dateTime);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    long countByStatusAndCreatedAtAfter(Project.ProjectStatus status, LocalDateTime dateTime);
    long countByStatusAndCreatedAtBetween(Project.ProjectStatus status, LocalDateTime start, LocalDateTime end);
    List<Project> findTop10ByOrderByCreatedAtDesc();

    @Query(
        value = """
            SELECT p FROM Project p
            LEFT JOIN p.member m
            LEFT JOIN p.client c
            WHERE (:status IS NULL OR p.status = :status)
              AND (:q IS NULL
                   OR LOWER(p.title)  LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(m.name)   LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(m.email)  LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(c.name)   LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(c.email)  LIKE LOWER(CONCAT('%',:q,'%')))
            ORDER BY p.createdAt DESC
        """,
        countQuery = """
            SELECT COUNT(p) FROM Project p
            LEFT JOIN p.member m
            LEFT JOIN p.client c
            WHERE (:status IS NULL OR p.status = :status)
              AND (:q IS NULL
                   OR LOWER(p.title)  LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(m.name)   LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(m.email)  LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(c.name)   LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(c.email)  LIKE LOWER(CONCAT('%',:q,'%')))
        """
    )
    Page<Project> searchProjects(
            @Param("status") Project.ProjectStatus status,
            @Param("q") String q,
            Pageable pageable);
}
