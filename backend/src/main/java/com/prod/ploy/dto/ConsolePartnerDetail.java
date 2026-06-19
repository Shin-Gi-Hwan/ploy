package com.prod.ploy.dto;

import com.prod.ploy.model.PartnerApplication;
import com.prod.ploy.model.PartnerProfile;

import java.time.LocalDateTime;
import java.util.List;

public record ConsolePartnerDetail(
        // Application info
        Long applicationId,
        Long memberId,
        String name,
        String email,
        String status,
        String introduction,
        String portfolioUrl,
        String rejectionReason,
        LocalDateTime appliedAt,
        LocalDateTime reviewedAt,
        // Profile info (null if not yet created)
        String displayName,
        String bio,
        String profileImageUrl,
        String specialties,
        String skills,
        Integer yearsOfExperience,
        Double averageRating,
        Integer completedCount,
        Boolean visible,
        List<PortfolioItemResponse> portfolioItems
) {
    public static ConsolePartnerDetail from(PartnerApplication app, PartnerProfile profile) {
        List<PortfolioItemResponse> items = profile != null
                ? profile.getPortfolioItems().stream().map(PortfolioItemResponse::from).toList()
                : List.of();

        return new ConsolePartnerDetail(
                app.getId(),
                app.getMember().getId(),
                app.getMember().getName(),
                app.getMember().getEmail(),
                app.getStatus().name(),
                app.getIntroduction(),
                app.getPortfolioUrl(),
                app.getRejectionReason(),
                app.getAppliedAt(),
                app.getReviewedAt(),
                profile != null ? profile.getDisplayName()       : null,
                profile != null ? profile.getBio()               : null,
                profile != null ? profile.getProfileImageUrl()   : null,
                profile != null ? profile.getSpecialties()       : null,
                profile != null ? profile.getSkills()            : null,
                profile != null ? profile.getYearsOfExperience() : null,
                profile != null ? profile.getAverageRating()     : null,
                profile != null ? profile.getCompletedCount()    : null,
                profile != null ? profile.getVisible()           : null,
                items
        );
    }
}
