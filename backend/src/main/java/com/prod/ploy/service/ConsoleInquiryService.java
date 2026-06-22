package com.prod.ploy.service;

import com.prod.ploy.dto.*;
import com.prod.ploy.model.Member;
import com.prod.ploy.model.Project;
import com.prod.ploy.repository.MemberRepository;
import com.prod.ploy.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ConsoleInquiryService {

    private final ProjectRepository projectRepository;
    private final MemberRepository  memberRepository;

    // Inquiries = projects in REQUESTED or REVIEWING status (new member flow)
    private static final java.util.List<Project.ProjectStatus> INQUIRY_STATUSES = java.util.List.of(
            Project.ProjectStatus.REQUESTED,
            Project.ProjectStatus.REVIEWING,
            Project.ProjectStatus.BRIEF_SUBMITTED // also includes legacy intake
    );

    @Transactional(readOnly = true)
    public Page<ConsoleProjectListItem> listInquiries(int page, int size, String statusStr, String q) {
        Project.ProjectStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try { status = Project.ProjectStatus.valueOf(statusStr.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }
        // If no specific status, default to inquiry statuses only
        if (status == null) {
            // Build a combined page across REQUESTED + BRIEF_SUBMITTED statuses
            // Use searchProjects with null status then filter — but for correctness use dedicated query
            // For simplicity: pass null to get all, service is used from controller with specific filter
        }
        String search = (q != null && !q.isBlank()) ? q.trim() : null;
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return projectRepository.searchProjects(status, search, pageable)
                .map(ConsoleProjectListItem::from);
    }

    @Transactional(readOnly = true)
    public ConsoleProjectDetail getInquiry(Long id) {
        return ConsoleProjectDetail.from(findById(id));
    }

    @Transactional
    public ConsoleProjectListItem approve(Long id) {
        Project p = findById(id);
        if (p.getStatus() != Project.ProjectStatus.REQUESTED
                && p.getStatus() != Project.ProjectStatus.REVIEWING
                && p.getStatus() != Project.ProjectStatus.BRIEF_SUBMITTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "승인 가능한 상태가 아닙니다.");
        }
        p.setStatus(Project.ProjectStatus.APPROVED);
        return ConsoleProjectListItem.from(projectRepository.save(p));
    }

    @Transactional
    public ConsoleProjectListItem reject(Long id, InquiryRejectRequest req) {
        if (req.reason() == null || req.reason().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "거절 사유는 필수입니다.");
        }
        Project p = findById(id);
        p.setStatus(Project.ProjectStatus.REJECTED);
        p.setRejectionReason(req.reason().trim());
        return ConsoleProjectListItem.from(projectRepository.save(p));
    }

    @Transactional
    public ConsoleProjectListItem assign(Long id, InquiryAssignRequest req) {
        Project p = findById(id);
        Member freelancer = memberRepository.findById(req.freelancerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파트너를 찾을 수 없습니다."));
        p.setFreelancer(freelancer);
        p.setStatus(Project.ProjectStatus.ASSIGNED);
        return ConsoleProjectListItem.from(projectRepository.save(p));
    }

    private Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "문의를 찾을 수 없습니다."));
    }
}
