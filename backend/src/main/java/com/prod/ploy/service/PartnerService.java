package com.prod.ploy.service;

import com.prod.ploy.dto.*;
import com.prod.ploy.model.*;
import com.prod.ploy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PartnerService {

    private final PartnerProfileRepository partnerProfileRepo;
    private final PartnerApplicationRepository partnerApplicationRepo;
    private final MemberRepository memberRepo;

    @Transactional(readOnly = true)
    public List<PartnerSummaryResponse> listVisiblePartners() {
        return partnerProfileRepo.findAllVisible().stream()
                .map(PartnerSummaryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PartnerDetailResponse getPartner(Long profileId) {
        PartnerProfile profile = partnerProfileRepo.findById(profileId)
                .filter(PartnerProfile::getVisible)
                .orElseThrow(() -> new PartnerNotFoundException("Partner not found."));
        return PartnerDetailResponse.from(profile);
    }

    @Transactional
    public PartnerApplicationResponse applyAsPartner(Member member, PartnerApplicationRequest req) {
        if (partnerApplicationRepo.existsByMemberId(member.getId())) {
            throw new AlreadyAppliedException("You have already submitted a partner application.");
        }
        PartnerApplication app = new PartnerApplication();
        app.setMember(member);
        app.setIntroduction(req.introduction());
        app.setPortfolioUrl(req.portfolioUrl());
        return PartnerApplicationResponse.from(partnerApplicationRepo.save(app));
    }

    @Transactional(readOnly = true)
    public PartnerApplicationResponse getMyApplication(Member member) {
        PartnerApplication app = partnerApplicationRepo.findByMemberId(member.getId())
                .orElseThrow(() -> new PartnerNotFoundException("No application found."));
        return PartnerApplicationResponse.from(app);
    }

    @Transactional(readOnly = true)
    public List<PartnerApplicationResponse> listAllApplications() {
        return partnerApplicationRepo.findAllByOrderByAppliedAtDesc().stream()
                .map(PartnerApplicationResponse::from)
                .toList();
    }

    @Transactional
    public PartnerApplicationResponse approveApplication(Long applicationId) {
        PartnerApplication app = partnerApplicationRepo.findById(applicationId)
                .orElseThrow(() -> new PartnerNotFoundException("Application not found."));
        Member member = app.getMember();
        member.setRole(Member.UserRole.OUTSOURCING_PARTNER);
        memberRepo.save(member);
        PartnerProfile profile = new PartnerProfile();
        profile.setMember(member);
        profile.setDisplayName(member.getName());
        profile.setBio(app.getIntroduction());
        profile.setVisible(true);
        partnerProfileRepo.save(profile);
        app.setStatus(PartnerApplication.ApplicationStatus.APPROVED);
        app.setReviewedAt(LocalDateTime.now());
        return PartnerApplicationResponse.from(partnerApplicationRepo.save(app));
    }

    @Transactional
    public PartnerApplicationResponse rejectApplication(Long applicationId, String reason) {
        PartnerApplication app = partnerApplicationRepo.findById(applicationId)
                .orElseThrow(() -> new PartnerNotFoundException("Application not found."));
        app.setStatus(PartnerApplication.ApplicationStatus.REJECTED);
        app.setRejectionReason(reason);
        app.setReviewedAt(LocalDateTime.now());
        return PartnerApplicationResponse.from(partnerApplicationRepo.save(app));
    }

    public static class PartnerNotFoundException extends RuntimeException {
        public PartnerNotFoundException(String msg) { super(msg); }
    }

    public static class AlreadyAppliedException extends RuntimeException {
        public AlreadyAppliedException(String msg) { super(msg); }
    }
}
