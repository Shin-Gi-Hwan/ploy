package com.prod.ploy.dto;

import com.prod.ploy.model.Member;

import java.time.LocalDateTime;

public record MemberListItem(
        Long id,
        String name,
        String email,
        String role,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static MemberListItem from(Member m) {
        return new MemberListItem(
                m.getId(), m.getName(), m.getEmail(),
                m.getRole().name(), m.isActive(),
                m.getCreatedAt(), m.getUpdatedAt()
        );
    }
}
