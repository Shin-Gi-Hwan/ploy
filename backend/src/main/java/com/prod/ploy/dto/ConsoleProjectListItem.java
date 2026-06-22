package com.prod.ploy.dto;

import com.prod.ploy.model.Project;

import java.time.LocalDateTime;

public record ConsoleProjectListItem(
        Long id,
        String title,
        String type,
        String status,
        String ownerName,
        String ownerEmail,
        String freelancerName,
        boolean hasDeliverable,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ConsoleProjectListItem from(Project p) {
        String ownerEmail = p.getMember() != null ? p.getMember().getEmail()
                          : p.getClient()  != null ? p.getClient().getEmail()
                          : null;
        return new ConsoleProjectListItem(
                p.getId(),
                p.getTitle() != null ? p.getTitle() : p.getType().name(),
                p.getType().name(),
                p.getStatus().name(),
                p.getOwnerName(),
                ownerEmail,
                p.getFreelancer() != null ? p.getFreelancer().getName() : null,
                !p.getDeliverables().isEmpty(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
