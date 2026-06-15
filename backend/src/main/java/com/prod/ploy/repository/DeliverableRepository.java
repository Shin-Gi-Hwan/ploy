package com.prod.ploy.repository;

import com.prod.ploy.model.Deliverable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DeliverableRepository extends JpaRepository<Deliverable, Long> {

    List<Deliverable> findByProjectIdOrderByVersionDesc(Long projectId);

    @Query("SELECT COALESCE(MAX(d.version), 0) FROM Deliverable d WHERE d.project.id = :projectId")
    int findMaxVersionByProjectId(Long projectId);

    Optional<Deliverable> findByIdAndProjectMagicToken(Long id, String magicToken);
}
