package com.prod.ploy.dto;

import com.prod.ploy.model.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PublicProductDto(
        Long id,
        String name,
        String description,
        String productType,
        BigDecimal price,
        Integer stock,
        String imageUrl,
        LocalDateTime createdAt
) {
    public static PublicProductDto from(Product p) {
        return new PublicProductDto(
                p.getId(), p.getName(), p.getDescription(),
                p.getProductType().name(), p.getPrice(),
                p.getStock(), p.getImageUrl(), p.getCreatedAt()
        );
    }
}
