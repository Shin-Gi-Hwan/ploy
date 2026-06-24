package com.prod.ploy.service;

import com.prod.ploy.dto.MemberDetailResponse;
import com.prod.ploy.dto.MemberListItem;
import com.prod.ploy.dto.MemberRoleUpdateRequest;
import com.prod.ploy.dto.MemberStatusUpdateRequest;
import com.prod.ploy.model.Member;
import com.prod.ploy.repository.MemberRepository;
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
public class ConsoleUserService {

    private final MemberRepository memberRepository;
    private final ConsoleAuditLogService auditLogService;

    /** Paged, filtered, searchable member list */
    public Page<MemberListItem> listMembers(int page, int size,
                                             String roleStr, String activeStr, String q) {
        Member.UserRole role = null;
        if (roleStr != null && !roleStr.isBlank()) {
            try { role = Member.UserRole.valueOf(roleStr.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }

        Boolean active = null;
        if ("true".equalsIgnoreCase(activeStr))  active = Boolean.TRUE;
        if ("false".equalsIgnoreCase(activeStr)) active = Boolean.FALSE;

        String search = (q != null && !q.isBlank()) ? q.trim() : null;

        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return memberRepository.searchMembers(role, active, search, pageable)
                               .map(MemberListItem::from);
    }

    /** Full member detail including recent projects */
    @Transactional(readOnly = true)
    public MemberDetailResponse getMember(Long id) {
        Member m = memberRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."));
        return MemberDetailResponse.from(m);
    }

    /** Change a member's role */
    @Transactional
    public MemberListItem updateRole(Long id, MemberRoleUpdateRequest req, Long adminId, String adminEmail) {
        Member m = memberRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."));

        Member.UserRole newRole;
        try { newRole = Member.UserRole.valueOf(req.role().toUpperCase()); }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 역할: " + req.role());
        }

        String before = m.getRole().name();
        m.setRole(newRole);
        memberRepository.save(m);

        auditLogService.log(adminId, adminEmail, "ROLE_CHANGED", "MEMBER", id,
                before, newRole.name(), null, null);

        return MemberListItem.from(m);
    }

    /** Activate or deactivate a member account */
    @Transactional
    public MemberListItem updateStatus(Long id, MemberStatusUpdateRequest req, Long adminId, String adminEmail) {
        Member m = memberRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."));

        if (!req.active() && id.equals(adminId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "자기 자신을 비활성화할 수 없습니다.");
        }

        String before = String.valueOf(m.isActive());
        m.setActive(req.active());
        memberRepository.save(m);

        auditLogService.log(adminId, adminEmail, "STATUS_TOGGLED", "MEMBER", id,
                before, String.valueOf(req.active()), null, null);

        return MemberListItem.from(m);
    }
}
