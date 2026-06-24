package com.prod.ploy.dto;

import com.prod.ploy.model.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ConsoleProductListItem(
        Long id,
        String name,
        String description,
        String productType,
        BigDecimal price,
        Integer stock,
        String imageUrl,
        Boolean visible,
        LocalDateTime createdAt
) {
    public static ConsoleProductListItem from(Product p) {
        return new ConsoleProductListItem(
                p.getId(), p.getName(), p.getDescription(), p.getProductType().name(),
                p.getPrice(), p.getStock(), p.getImageUrl(),
                p.getVisible(), p.getCreatedAt()
        );
    }
}
