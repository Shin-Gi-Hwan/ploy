package com.prod.ploy.dto;

import com.prod.ploy.model.LoginAuditLog;

import java.time.LocalDateTime;

public record ConsoleLoginAuditListItem(
        Long id,
        Long memberId,
        String memberEmail,
        String memberName,
        String provider,
        String ipAddress,
        String userAgent,
        boolean success,
        String failureReason,
        LocalDateTime createdAt
) {
    public static ConsoleLoginAuditListItem from(LoginAuditLog l) {
        return new ConsoleLoginAuditListItem(
                l.getId(), l.getMemberId(), l.getMemberEmail(), l.getMemberName(),
                l.getProvider(), l.getIpAddress(), l.getUserAgent(),
                l.isSuccess(), l.getFailureReason(), l.getCreatedAt()
        );
    }
}
