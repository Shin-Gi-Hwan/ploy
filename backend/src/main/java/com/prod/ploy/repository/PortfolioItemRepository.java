package com.prod.ploy.repository;

import com.prod.ploy.model.PortfolioItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long> {
    List<PortfolioItem> findByPartnerProfileIdOrderByCreatedAtDesc(Long partnerProfileId);
}
