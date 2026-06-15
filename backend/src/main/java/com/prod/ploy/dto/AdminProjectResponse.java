package com.prod.ploy.dto;

import com.prod.ploy.model.Project.ProjectStatus;
import com.prod.ploy.model.Project.ProjectType;

import java.time.LocalDateTime;
import java.util.List;

public record AdminProjectResponse(
        Long id,
        ProjectType type,
        ProjectStatus status,
        String magicToken,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        ClientView client,
        List<DeliverableView> deliverables
) {
    public record ClientView(Long id, String name, String email, String phone) {}

    public record DeliverableView(Long id, Integer version, String note, String downloadUrl, String uploadedAt) {}
}
