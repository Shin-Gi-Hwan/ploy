package com.prod.ploy.dto;

import com.prod.ploy.model.AdminAuditLog;

import java.time.LocalDateTime;

public record ConsoleAuditLogListItem(
        Long id,
        Long adminId,
        String adminEmail,
        String actionType,
        String targetType,
        Long targetId,
        String beforeValue,
        String afterValue,
        String ipAddress,
        LocalDateTime createdAt
) {
    public static ConsoleAuditLogListItem from(AdminAuditLog a) {
        return new ConsoleAuditLogListItem(
                a.getId(), a.getAdminId(), a.getAdminEmail(),
                a.getActionType(), a.getTargetType(), a.getTargetId(),
                a.getBeforeValue(), a.getAfterValue(),
                a.getIpAddress(), a.getCreatedAt()
        );
    }
}
