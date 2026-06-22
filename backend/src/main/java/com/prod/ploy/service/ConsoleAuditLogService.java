package com.prod.ploy.service;

import com.prod.ploy.dto.ConsoleAuditLogListItem;
import com.prod.ploy.model.AdminAuditLog;
import com.prod.ploy.repository.AdminAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ConsoleAuditLogService {

    private final AdminAuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public Page<ConsoleAuditLogListItem> listLogs(
            int page, int size,
            Long adminId, String actionType, String targetType,
            String fromStr, String toStr) {

        LocalDateTime from = (fromStr != null && !fromStr.isBlank())
                ? LocalDate.parse(fromStr).atStartOfDay() : null;
        LocalDateTime to = (toStr != null && !toStr.isBlank())
                ? LocalDate.parse(toStr).plusDays(1).atStartOfDay() : null;

        String action = (actionType != null && !actionType.isBlank()) ? actionType : null;
        String target = (targetType != null && !targetType.isBlank()) ? targetType : null;

        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return auditLogRepository.search(adminId, action, target, from, to, pageable)
                .map(ConsoleAuditLogListItem::from);
    }

    /** Called by controllers to log admin actions */
    @Transactional
    public void log(Long adminId, String adminEmail,
                    String actionType, String targetType, Long targetId,
                    String beforeValue, String afterValue,
                    String ipAddress, String userAgent) {
        AdminAuditLog entry = new AdminAuditLog();
        entry.setAdminId(adminId);
        entry.setAdminEmail(adminEmail);
        entry.setActionType(actionType);
        entry.setTargetType(targetType);
        entry.setTargetId(targetId);
        entry.setBeforeValue(beforeValue);
        entry.setAfterValue(afterValue);
        entry.setIpAddress(ipAddress);
        entry.setUserAgent(userAgent);
        auditLogRepository.save(entry);
    }
}
