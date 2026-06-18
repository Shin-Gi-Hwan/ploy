package com.prod.ploy.repository;

import com.prod.ploy.model.Member;
import com.prod.ploy.model.Project;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

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
}
