package com.prod.ploy.service;

import com.prod.ploy.dto.ConsoleLoginAuditListItem;
import com.prod.ploy.model.LoginAuditLog;
import com.prod.ploy.model.Member;
import com.prod.ploy.repository.LoginAuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LoginAuditService {

    private final LoginAuditLogRepository repo;

    /** Record a successful OAuth login asynchronously (non-blocking). */
    @Async
    public void recordOAuthSuccess(Member member, String provider, HttpServletRequest request) {
        LoginAuditLog log = new LoginAuditLog();
        log.setMemberId(member.getId());
        log.setMemberEmail(member.getEmail());
        log.setMemberName(member.getName());
        log.setProvider(provider);
        log.setIpAddress(resolveIp(request));
        log.setUserAgent(truncate(request.getHeader("User-Agent"), 500));
        log.setSuccess(true);
        repo.save(log);
    }

    /** Record a failed OAuth login asynchronously. */
    @Async
    public void recordOAuthFailure(String provider, String reason, HttpServletRequest request) {
        LoginAuditLog log = new LoginAuditLog();
        log.setProvider(provider);
        log.setIpAddress(resolveIp(request));
        log.setUserAgent(truncate(request.getHeader("User-Agent"), 500));
        log.setSuccess(false);
        log.setFailureReason(truncate(reason, 300));
        repo.save(log);
    }

    public Page<ConsoleLoginAuditListItem> list(int page, int size,
                                                 String provider, Boolean success,
                                                 String fromDate, String toDate) {
        LocalDateTime from = fromDate != null ? LocalDate.parse(fromDate).atStartOfDay() : null;
        LocalDateTime to   = toDate   != null ? LocalDate.parse(toDate).atTime(23, 59, 59) : null;
        return repo.search(
                provider != null && !provider.isBlank() ? provider : null,
                success,
                from, to,
                PageRequest.of(page, size)
        ).map(ConsoleLoginAuditListItem::from);
    }

    private static String resolveIp(HttpServletRequest req) {
        String forwarded = req.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }

    private static String truncate(String s, int max) {
        if (s == null) return null;
        return s.length() <= max ? s : s.substring(0, max);
    }
}
