package com.prod.ploy.dto;

import com.prod.ploy.model.Project.ProjectStatus;
import com.prod.ploy.model.Project.ProjectType;

import java.time.LocalDateTime;
import java.util.List;

public record ClientProjectResponse(
        Long id,
        String title,
        ProjectType serviceType,
        ProjectStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        MemberView client,
        MemberView freelancer,
        List<DeliverableView> deliverables
) {
    public record MemberView(Long id, String name, String email, String role) {}
    public record DeliverableView(Long id, Integer version, String note, String downloadUrl, String uploadedAt) {}
}
