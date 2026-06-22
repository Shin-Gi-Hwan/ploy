package com.prod.ploy.dto;

import java.math.BigDecimal;

public record ProductUpsertRequest(
        String name,
        String description,
        String productType,
        BigDecimal price,
        Integer stock,
        String imageUrl,
        Boolean visible
) {}
