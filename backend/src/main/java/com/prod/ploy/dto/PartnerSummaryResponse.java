package com.prod.ploy.dto;

import com.prod.ploy.model.PartnerProfile;

public record PartnerSummaryResponse(
    Long id,
    String displayName,
    String bio,
    String profileImageUrl,
    String specialties,
    Integer yearsOfExperience,
    Double averageRating,
    Integer completedCount
) {
    public static PartnerSummaryResponse from(PartnerProfile p) {
        String bio = p.getBio();
        if (bio != null && bio.length() > 120) bio = bio.substring(0, 120) + "…";
        return new PartnerSummaryResponse(
            p.getId(), p.getDisplayName(), bio, p.getProfileImageUrl(),
            p.getSpecialties(), p.getYearsOfExperience(), p.getAverageRating(), p.getCompletedCount()
        );
    }
}
