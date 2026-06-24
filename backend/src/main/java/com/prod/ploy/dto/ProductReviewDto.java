package com.prod.ploy.dto;

import com.prod.ploy.model.Review;

import java.time.LocalDateTime;

public record ProductReviewDto(
        Long id,
        String memberName,
        int rating,
        String content,
        LocalDateTime createdAt
) {
    public static ProductReviewDto from(Review r) {
        String name = r.getMember() != null ? r.getMember().getName() : "익명";
        return new ProductReviewDto(r.getId(), name, r.getRating(), r.getContent(), r.getCreatedAt());
    }
}
