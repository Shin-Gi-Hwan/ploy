package com.prod.ploy.dto;

import com.prod.ploy.model.PartnerProfile;

import java.util.List;

public record PartnerDetailResponse(
    Long id,
    String displayName,
    String bio,
    String profileImageUrl,
    String specialties,
    String skills,
    Integer yearsOfExperience,
    Double averageRating,
    Integer completedCount,
    List<PortfolioItemResponse> portfolioItems
) {
    public static PartnerDetailResponse from(PartnerProfile p) {
        return new PartnerDetailResponse(
            p.getId(), p.getDisplayName(), p.getBio(), p.getProfileImageUrl(),
            p.getSpecialties(), p.getSkills(), p.getYearsOfExperience(),
            p.getAverageRating(), p.getCompletedCount(),
            p.getPortfolioItems().stream().map(PortfolioItemResponse::from).toList()
        );
    }
}
