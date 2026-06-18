package com.prod.ploy.dto;

import com.prod.ploy.model.PartnerApplication;

public record PartnerApplicationResponse(
    Long id,
    Long memberId,
    String memberName,
    String memberEmail,
    String status,
    String introduction,
    String portfolioUrl,
    String rejectionReason,
    String appliedAt,
    String reviewedAt
) {
    public static PartnerApplicationResponse from(PartnerApplication a) {
        return new PartnerApplicationResponse(
            a.getId(), a.getMember().getId(), a.getMember().getName(), a.getMember().getEmail(),
            a.getStatus().name(), a.getIntroduction(), a.getPortfolioUrl(), a.getRejectionReason(),
            a.getAppliedAt().toString(),
            a.getReviewedAt() != null ? a.getReviewedAt().toString() : null
        );
    }
}
