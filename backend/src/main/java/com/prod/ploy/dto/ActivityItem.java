package com.prod.ploy.dto;

import java.time.LocalDateTime;

public record ActivityItem(
        String type,        // "project" | "member" | "partner"
        String description,
        LocalDateTime timestamp
) {}
