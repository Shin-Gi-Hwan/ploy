package com.prod.ploy.repository;

import com.prod.ploy.model.Project;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findByMagicToken(String magicToken);

    // Admin list: eager-load client and deliverables to prevent N+1 queries.
    @EntityGraph(attributePaths = {"client", "deliverables"})
    List<Project> findAllByOrderByCreatedAtDesc();
}
