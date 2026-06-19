package com.prod.ploy.dto;

import com.prod.ploy.model.Member;
import com.prod.ploy.model.Project;

import java.time.LocalDateTime;
import java.util.List;

public record MemberDetailResponse(
        Long id,
        String name,
        String email,
        String role,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<RecentProjectItem> recentProjects
) {
    public record RecentProjectItem(
            Long id,
            String title,
            String type,
            String status,
            LocalDateTime createdAt
    ) {
        public static RecentProjectItem from(Project p) {
            return new RecentProjectItem(
                    p.getId(),
                    p.getTitle() != null ? p.getTitle() : p.getType().name(),
                    p.getType().name(),
                    p.getStatus().name(),
                    p.getCreatedAt()
            );
        }
    }

    public static MemberDetailResponse from(Member m) {
        List<RecentProjectItem> projects = m.getProjects().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(RecentProjectItem::from)
                .toList();

        return new MemberDetailResponse(
                m.getId(), m.getName(), m.getEmail(),
                m.getRole().name(), m.isActive(),
                m.getCreatedAt(), m.getUpdatedAt(),
                projects
        );
    }
}
