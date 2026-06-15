package com.prod.ploy.dto;

public record DeliverableUploadResponse(
        Long id,
        Integer version,
        String note,
        String downloadUrl
) {}
