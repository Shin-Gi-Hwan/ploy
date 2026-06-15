package com.prod.ploy.dto;

public record IntakeResponse(
        Long projectId,
        String magicToken,
        String trackingUrl
) {}
