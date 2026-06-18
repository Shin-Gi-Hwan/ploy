package com.prod.ploy.controller;

import com.prod.ploy.dto.*;
import com.prod.ploy.model.Member;
import com.prod.ploy.service.PartnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    @GetMapping("/api/partners")
    public List<PartnerSummaryResponse> listPartners() {
        return partnerService.listVisiblePartners();
    }

    @GetMapping("/api/partners/{id}")
    public PartnerDetailResponse getPartner(@PathVariable Long id) {
        return partnerService.getPartner(id);
    }

    @PostMapping("/api/partner/apply")
    public ResponseEntity<PartnerApplicationResponse> apply(
            @Valid @RequestBody PartnerApplicationRequest req,
            @AuthenticationPrincipal Member member) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(partnerService.applyAsPartner(member, req));
    }

    @GetMapping("/api/partner/application")
    public PartnerApplicationResponse getMyApplication(@AuthenticationPrincipal Member member) {
        return partnerService.getMyApplication(member);
    }

    @GetMapping("/api/admin/partner-applications")
    public List<PartnerApplicationResponse> listApplications() {
        return partnerService.listAllApplications();
    }

    @PostMapping("/api/admin/partner-applications/{id}/approve")
    public PartnerApplicationResponse approve(@PathVariable Long id) {
        return partnerService.approveApplication(id);
    }

    @PostMapping("/api/admin/partner-applications/{id}/reject")
    public PartnerApplicationResponse reject(
            @PathVariable Long id,
            @RequestBody ApplicationReviewRequest req) {
        return partnerService.rejectApplication(id, req.rejectionReason());
    }

    @ExceptionHandler(PartnerService.PartnerNotFoundException.class)
    ResponseEntity<String> handleNotFound(PartnerService.PartnerNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(PartnerService.AlreadyAppliedException.class)
    ResponseEntity<String> handleAlreadyApplied(PartnerService.AlreadyAppliedException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
}
