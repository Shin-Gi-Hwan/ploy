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
public class ConsoleProjectService {

    private final ProjectRepository projectRepository;
    private final MemberRepository  memberRepository;

    // ── List ────────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<ConsoleProjectListItem> listProjects(int page, int size, String statusStr, String q) {
        Project.ProjectStatus status = parseStatus(statusStr);
        String search = (q != null && !q.isBlank()) ? q.trim() : null;
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return projectRepository.searchProjects(status, search, pageable)
                .map(ConsoleProjectListItem::from);
    }

    // ── Detail ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ConsoleProjectDetail getProject(Long id) {
        return ConsoleProjectDetail.from(findById(id));
    }

    // ── Status update ────────────────────────────────────────────────────────────

    @Transactional
    public ConsoleProjectListItem updateStatus(Long id, ProjectStatusUpdateRequest req) {
        Project p = findById(id);
        try {
            p.setStatus(Project.ProjectStatus.valueOf(req.status().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 상태값: " + req.status());
        }
        return ConsoleProjectListItem.from(projectRepository.save(p));
    }

    // ── Admin note ───────────────────────────────────────────────────────────────

    @Transactional
    public ConsoleProjectListItem addNote(Long id, ProjectNoteRequest req) {
        Project p = findById(id);
        p.setAdminNote(req.note());
        return ConsoleProjectListItem.from(projectRepository.save(p));
    }

    // ── Assign partner ───────────────────────────────────────────────────────────

    @Transactional
    public ConsoleProjectListItem assign(Long id, ProjectAssignRequest req) {
        Project p = findById(id);
        if (req.freelancerId() == null) {
            p.setFreelancer(null);
        } else {
            Member freelancer = memberRepository.findById(req.freelancerId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파트너를 찾을 수 없습니다."));
            p.setFreelancer(freelancer);
            if (p.getStatus() == Project.ProjectStatus.APPROVED ||
                p.getStatus() == Project.ProjectStatus.REVIEWING) {
                p.setStatus(Project.ProjectStatus.ASSIGNED);
            }
        }
        return ConsoleProjectListItem.from(projectRepository.save(p));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "프로젝트를 찾을 수 없습니다."));
    }

    private static Project.ProjectStatus parseStatus(String s) {
        if (s == null || s.isBlank()) return null;
        try { return Project.ProjectStatus.valueOf(s.toUpperCase()); }
        catch (IllegalArgumentException e) { return null; }
    }
}
