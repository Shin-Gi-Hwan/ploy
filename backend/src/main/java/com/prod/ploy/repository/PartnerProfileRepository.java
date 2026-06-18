package com.prod.ploy.repository;

import com.prod.ploy.model.PartnerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PartnerProfileRepository extends JpaRepository<PartnerProfile, Long> {
    Optional<PartnerProfile> findByMemberId(Long memberId);

    @Query("SELECT p FROM PartnerProfile p WHERE p.visible = true ORDER BY p.averageRating DESC, p.completedCount DESC")
    List<PartnerProfile> findAllVisible();
}
