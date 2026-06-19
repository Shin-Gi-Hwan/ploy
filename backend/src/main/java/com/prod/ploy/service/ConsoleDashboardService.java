package com.prod.ploy.service;

import com.prod.ploy.dto.ActivityItem;
import com.prod.ploy.dto.DashboardStatsResponse;
import com.prod.ploy.model.Member;
import com.prod.ploy.model.PartnerApplication;
import com.prod.ploy.model.Project;
import com.prod.ploy.repository.MemberRepository;
import com.prod.ploy.repository.PartnerApplicationRepository;
import com.prod.ploy.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ConsoleDashboardService {

    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final PartnerApplicationRepository partnerApplicationRepository;

    public DashboardStatsResponse getStats() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        long totalMembers = memberRepository.countByRole(Member.UserRole.USER);
        long newMembersToday = memberRepository.countByCreatedAtAfter(startOfToday);
        long totalPartners = memberRepository.countByRole(Member.UserRole.OUTSOURCING_PARTNER);
        long pendingPartnerApplications = partnerApplicationRepository.countByStatus(PartnerApplication.ApplicationStatus.PENDING);
        long totalProjects = projectRepository.count();
        long newProjectsToday = projectRepository.countByCreatedAtAfter(startOfToday);

        // Active = projects that are in flight (not finished or rejected)
        long activeProjects =
                projectRepository.countByStatus(Project.ProjectStatus.IN_PROGRESS) +
                projectRepository.countByStatus(Project.ProjectStatus.REVIEWING) +
                projectRepository.countByStatus(Project.ProjectStatus.APPROVED) +
                projectRepository.countByStatus(Project.ProjectStatus.ASSIGNED) +
                projectRepository.countByStatus(Project.ProjectStatus.REVIEW);

        // Pending approvals = REQUESTED projects awaiting admin action
        long pendingApprovals = projectRepository.countByStatus(Project.ProjectStatus.REQUESTED);

        Map<String, Long> projectsByStatus = new LinkedHashMap<>();
        for (Project.ProjectStatus s : Project.ProjectStatus.values()) {
            projectsByStatus.put(s.name(), projectRepository.countByStatus(s));
        }

        return new DashboardStatsResponse(
                totalMembers, newMembersToday,
                totalPartners, pendingPartnerApplications,
                totalProjects, activeProjects, newProjectsToday, pendingApprovals,
                projectsByStatus
        );
    }

    @Transactional(readOnly = true)
    public List<ActivityItem> getRecentActivity() {
        List<ActivityItem> items = new ArrayList<>();

        // Recent projects
        projectRepository.findTop10ByOrderByCreatedAtDesc().forEach(p ->
                items.add(new ActivityItem(
                        "project",
                        "프로젝트 생성: " + (p.getTitle() != null ? p.getTitle() : p.getType().name()) +
                                " (" + p.getOwnerName() + ")",
                        p.getCreatedAt()
                ))
        );

        // Recent members
        memberRepository.findTop10ByOrderByCreatedAtDesc().forEach(m ->
                items.add(new ActivityItem(
                        "member",
                        "신규 회원 가입: " + m.getName() + " (" + m.getEmail() + ")",
                        m.getCreatedAt()
                ))
        );

        // Recent partner applications
        partnerApplicationRepository.findTop5ByOrderByAppliedAtDesc().forEach(a ->
                items.add(new ActivityItem(
                        "partner",
                        "파트너 신청: " + a.getMember().getName() + " — " + a.getStatus().name(),
                        a.getAppliedAt()
                ))
        );

        // Sort all combined activities by timestamp desc, take top 20
        items.sort(Comparator.comparing(ActivityItem::timestamp).reversed());
        return items.stream().limit(20).toList();
    }
}
