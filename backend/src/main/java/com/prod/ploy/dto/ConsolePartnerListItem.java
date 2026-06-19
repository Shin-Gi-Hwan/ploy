package com.prod.ploy.dto;

import com.prod.ploy.model.PartnerApplication;
import com.prod.ploy.model.PartnerProfile;

import java.time.LocalDateTime;

public record ConsolePartnerListItem(
        Long id,                  // PartnerApplication.id
        Long memberId,
        String name,
        String email,
        String status,            // ApplicationStatus name
        Boolean visible,          // PartnerProfile.visible (null if no profile yet)
        String specialties,
        Double averageRating,
        Integer completedCount,
        LocalDateTime appliedAt,
        LocalDateTime reviewedAt
) {
    public static ConsolePartnerListItem from(PartnerApplication app, PartnerProfile profile) {
        return new ConsolePartnerListItem(
                app.getId(),
                app.getMember().getId(),
                app.getMember().getName(),
                app.getMember().getEmail(),
                app.getStatus().name(),
                profile != null ? profile.getVisible() : null,
                profile != null ? profile.getSpecialties() : null,
                profile != null ? profile.getAverageRating() : null,
                profile != null ? profile.getCompletedCount() : null,
                app.getAppliedAt(),
                app.getReviewedAt()
        );
    }
}
