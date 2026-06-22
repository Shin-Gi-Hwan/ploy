package com.prod.ploy.dto;

import com.prod.ploy.model.Review;

import java.time.LocalDateTime;

public record ConsoleReviewListItem(
        Long id,
        String reviewerName,
        String reviewerEmail,
        String projectTitle,
        Long projectId,
        Integer rating,
        String contentPreview,
        Boolean visible,
        LocalDateTime createdAt
) {
    /** Mask name: 김민수 → 김*수, 이현 → 이* */
    public static String maskName(String name) {
        if (name == null || name.length() <= 1) return name;
        if (name.length() == 2) return name.charAt(0) + "*";
        return name.charAt(0) + "*".repeat(name.length() - 2) + name.charAt(name.length() - 1);
    }

    public static ConsoleReviewListItem from(Review r) {
        String rawName = r.getMember() != null ? r.getMember().getName() : "익명";
        String email   = r.getMember() != null ? r.getMember().getEmail() : null;
        String projectTitle = r.getProject() != null
                ? (r.getProject().getTitle() != null ? r.getProject().getTitle() : r.getProject().getType().name())
                : null;
        String preview = r.getContent() != null && r.getContent().length() > 80
                ? r.getContent().substring(0, 80) + "..."
                : r.getContent();

        return new ConsoleReviewListItem(
                r.getId(), maskName(rawName), email,
                projectTitle, r.getProject() != null ? r.getProject().getId() : null,
                r.getRating(), preview, r.getVisible(), r.getCreatedAt()
        );
    }
}
