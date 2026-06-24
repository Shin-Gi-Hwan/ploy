package com.prod.ploy.service;

import com.prod.ploy.dto.ConsolePartnerDetail;
import com.prod.ploy.dto.ConsolePartnerListItem;
import com.prod.ploy.dto.PartnerActiveRequest;
import com.prod.ploy.dto.PartnerRejectRequest;
import com.prod.ploy.model.PartnerApplication;
import com.prod.ploy.model.PartnerProfile;
import com.prod.ploy.repository.PartnerApplicationRepository;
import com.prod.ploy.repository.PartnerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ConsolePartnerService {

    private final PartnerApplicationRepository applicationRepository;
    private final PartnerProfileRepository     profileRepository;
    private final ConsoleAuditLogService       auditLogService;

    @Transactional(readOnly = true)
    public Page<ConsolePartnerListItem> listPartners(int page, int size, String statusStr, String q) {
        PartnerApplication.ApplicationStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try { status = PartnerApplication.ApplicationStatus.valueOf(statusStr.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }

        String search = (q != null && !q.isBlank()) ? q.trim() : null;
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));

        return applicationRepository.searchApplications(status, search, pageable)
                .map(app -> {
                    PartnerProfile profile = profileRepository.findByMemberId(app.getMember().getId()).orElse(null);
                    return ConsolePartnerListItem.from(app, profile);
                });
    }

    @Transactional(readOnly = true)
    public ConsolePartnerDetail getPartner(Long applicationId) {
        PartnerApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파트너 신청을 찾을 수 없습니다."));
        PartnerProfile profile = profileRepository.findByMemberId(app.getMember().getId()).orElse(null);
        return ConsolePartnerDetail.from(app, profile);
    }

    @Transactional
    public ConsolePartnerListItem approve(Long applicationId, Long adminId, String adminEmail) {
        PartnerApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파트너 신청을 찾을 수 없습니다."));

        if (app.getStatus() != PartnerApplication.ApplicationStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PENDING 상태의 신청만 승인할 수 있습니다.");
        }

        app.setStatus(PartnerApplication.ApplicationStatus.APPROVED);
        app.setReviewedAt(LocalDateTime.now());
        applicationRepository.save(app);

        auditLogService.log(adminId, adminEmail, "APPROVED", "PARTNER", applicationId,
                "PENDING", "APPROVED", null, null);

        PartnerProfile profile = profileRepository.findByMemberId(app.getMember().getId()).orElse(null);
        return ConsolePartnerListItem.from(app, profile);
    }

    @Transactional
    public ConsolePartnerListItem reject(Long applicationId, PartnerRejectRequest req, Long adminId, String adminEmail) {
        if (req.reason() == null || req.reason().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "거절 사유를 입력해주세요.");
        }

        PartnerApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파트너 신청을 찾을 수 없습니다."));

        if (app.getStatus() != PartnerApplication.ApplicationStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PENDING 상태의 신청만 거절할 수 있습니다.");
        }

        app.setStatus(PartnerApplication.ApplicationStatus.REJECTED);
        app.setRejectionReason(req.reason());
        app.setReviewedAt(LocalDateTime.now());
        applicationRepository.save(app);

        auditLogService.log(adminId, adminEmail, "REJECTED", "PARTNER", applicationId,
                "PENDING", "REJECTED: " + req.reason(), null, null);

        PartnerProfile profile = profileRepository.findByMemberId(app.getMember().getId()).orElse(null);
        return ConsolePartnerListItem.from(app, profile);
    }

    @Transactional
    public ConsolePartnerListItem updateActive(Long applicationId, PartnerActiveRequest req, Long adminId, String adminEmail) {
        PartnerApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파트너 신청을 찾을 수 없습니다."));

        PartnerProfile profile = profileRepository.findByMemberId(app.getMember().getId()).orElse(null);
        if (profile == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파트너 프로필이 아직 없습니다.");
        }

        String before = String.valueOf(profile.getVisible());
        profile.setVisible(req.active());
        profileRepository.save(profile);

        auditLogService.log(adminId, adminEmail, "VISIBILITY_CHANGED", "PARTNER", applicationId,
                before, String.valueOf(req.active()), null, null);

        // If disabling, also set application status to DISABLED
        if (!req.active()) {
            app.setStatus(PartnerApplication.ApplicationStatus.DISABLED);
            applicationRepository.save(app);
        }

        return ConsolePartnerListItem.from(app, profile);
    }
}
