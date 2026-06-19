package com.prod.ploy.repository;

import com.prod.ploy.model.PartnerApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PartnerApplicationRepository extends JpaRepository<PartnerApplication, Long> {
    Optional<PartnerApplication> findByMemberId(Long memberId);
    boolean existsByMemberId(Long memberId);
    List<PartnerApplication> findAllByOrderByAppliedAtDesc();

    long countByStatus(PartnerApplication.ApplicationStatus status);
    List<PartnerApplication> findTop5ByOrderByAppliedAtDesc();
}
