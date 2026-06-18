package com.prod.ploy.dto;

import com.prod.ploy.model.PortfolioItem;

public record PortfolioItemResponse(
    Long id,
    String title,
    String description,
    String category,
    String thumbnailUrl,
    String fileUrl,
    String createdAt
) {
    public static PortfolioItemResponse from(PortfolioItem item) {
        return new PortfolioItemResponse(
            item.getId(), item.getTitle(), item.getDescription(),
            item.getCategory().name(), item.getThumbnailUrl(),
            item.getFileUrl(), item.getCreatedAt().toString()
        );
    }
}
