package com.prod.ploy.service;

import com.prod.ploy.dto.ActivityItem;
import com.prod.ploy.dto.DashboardStatsResponse;
import com.prod.ploy.dto.RevenueDataPoint;
import com.prod.ploy.model.Member;
import com.prod.ploy.model.PartnerApplication;
import com.prod.ploy.model.Project;
import com.prod.ploy.repository.MemberRepository;
import com.prod.ploy.repository.OrderRepository;
import com.prod.ploy.repository.PartnerApplicationRepository;
import com.prod.ploy.repository.PaymentRepository;
import com.prod.ploy.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class ConsoleDashboardService {

    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final PartnerApplicationRepository partnerApplicationRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    // ── Stats ─────────────────────────────────────────────────────────────────

    public DashboardStatsResponse getStats() {
        LocalDateTime startOfToday     = LocalDate.now().atStartOfDay();
        LocalDateTime startOfYesterday = startOfToday.minusDays(1);

        // ── Today's KPIs ──────────────────────────────────────────────────────
        // Today's orders: use real Order table (falls back to project count if no orders exist)
        long todayOrders    = orderRepository.count() > 0
                ? orderRepository.searchOrders(null, null, org.springframework.data.domain.PageRequest.of(0, 1)).getTotalElements()
                : projectRepository.countByCreatedAtAfter(startOfToday);
        // Use projects as proxy for inquiries (no separate inquiry entity yet)
        long todayInquiries = projectRepository.countByStatusAndCreatedAtAfter(
                                  Project.ProjectStatus.REQUESTED, startOfToday)
                            + projectRepository.countByStatusAndCreatedAtAfter(
                                  Project.ProjectStatus.BRIEF_SUBMITTED, startOfToday);

        long activeProjects =
                projectRepository.countByStatus(Project.ProjectStatus.IN_PROGRESS)
              + projectRepository.countByStatus(Project.ProjectStatus.REVIEWING)
              + projectRepository.countByStatus(Project.ProjectStatus.APPROVED)
              + projectRepository.countByStatus(Project.ProjectStatus.ASSIGNED)
              + projectRepository.countByStatus(Project.ProjectStatus.REVIEW);

        long pendingApprovals = projectRepository.countByStatus(Project.ProjectStatus.REQUESTED);
        long newMembers   = memberRepository.countByCreatedAtAfter(startOfToday);
        // Real payment revenue from Payment table; returns 0 until real payments are processed
        long todayRevenue = paymentRepository.sumApprovedAmountAfter(
                com.prod.ploy.model.Payment.PaymentStatus.APPROVED, startOfToday).longValue();

        // ── Yesterday's KPIs (for change calculation) ─────────────────────────
        long yesterdayOrders    = projectRepository.countByCreatedAtBetween(startOfYesterday, startOfToday);
        long yesterdayInquiries = projectRepository.countByStatusAndCreatedAtBetween(
                                      Project.ProjectStatus.REQUESTED, startOfYesterday, startOfToday)
                                + projectRepository.countByStatusAndCreatedAtBetween(
                                      Project.ProjectStatus.BRIEF_SUBMITTED, startOfYesterday, startOfToday);
        long yesterdayApprovals = projectRepository.countByStatusAndCreatedAtBetween(
                                      Project.ProjectStatus.REQUESTED, startOfYesterday, startOfToday);
        long yesterdayMembers   = memberRepository.countByCreatedAtBetween(startOfYesterday, startOfToday);

        // ── Supplementary totals ──────────────────────────────────────────────
        long totalMembers               = memberRepository.countByRole(Member.UserRole.USER);
        long totalProjects              = projectRepository.count();
        long totalPartners              = memberRepository.countByRole(Member.UserRole.OUTSOURCING_PARTNER);
        long pendingPartnerApplications = partnerApplicationRepository.countByStatus(
                                              PartnerApplication.ApplicationStatus.PENDING);

        Map<String, Long> projectsByStatus = new LinkedHashMap<>();
        for (Project.ProjectStatus s : Project.ProjectStatus.values()) {
            projectsByStatus.put(s.name(), projectRepository.countByStatus(s));
        }

        return new DashboardStatsResponse(
                todayOrders,     todayInquiries,  activeProjects,  pendingApprovals,
                newMembers,      todayRevenue,
                todayOrders    - yesterdayOrders,
                todayInquiries - yesterdayInquiries,
                todayOrders    - yesterdayOrders,   // projectChange = same as orderChange
                pendingApprovals - yesterdayApprovals,
                newMembers     - yesterdayMembers,
                0.0,                                // revenueChange — mock
                totalMembers,    totalProjects,     totalPartners,
                pendingPartnerApplications,         projectsByStatus
        );
    }

    // ── Activity Feed ─────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ActivityItem> getRecentActivity() {
        List<ActivityItem> items = new ArrayList<>();
        AtomicLong seq = new AtomicLong(1);

        // Projects
        projectRepository.findTop10ByOrderByCreatedAtDesc().forEach(p -> {
            String type    = projectActivityType(p.getStatus());
            String message = buildProjectMessage(p, type);
            items.add(new ActivityItem(seq.getAndIncrement(), type, message, p.getId(), p.getCreatedAt()));
        });

        // Members
        memberRepository.findTop10ByOrderByCreatedAtDesc().forEach(m ->
            items.add(new ActivityItem(
                seq.getAndIncrement(),
                "MEMBER_REGISTERED",
                m.getName() + "님이 회원가입했습니다.",
                m.getId(),
                m.getCreatedAt()
            ))
        );

        // Partner applications
        partnerApplicationRepository.findTop5ByOrderByAppliedAtDesc().forEach(a -> {
            String type = partnerActivityType(a.getStatus());
            String message = a.getMember().getName() + "님이 " + partnerStatusLabel(a.getStatus()) + "했습니다.";
            items.add(new ActivityItem(seq.getAndIncrement(), type, message, a.getId(), a.getAppliedAt()));
        });

        items.sort(Comparator.comparing(ActivityItem::createdAt).reversed());
        return items.stream().limit(20).toList();
    }

    // ── Revenue / Chart ───────────────────────────────────────────────────────

    public List<RevenueDataPoint> getRevenueLast7Days() {
        List<RevenueDataPoint> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate date  = today.minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end   = start.plusDays(1);

            long orders    = projectRepository.countByCreatedAtBetween(start, end);
            long inquiries = projectRepository.countByStatusAndCreatedAtBetween(
                                 Project.ProjectStatus.REQUESTED, start, end)
                           + projectRepository.countByStatusAndCreatedAtBetween(
                                 Project.ProjectStatus.BRIEF_SUBMITTED, start, end);
            // Real payment revenue per day; 0 until payment data exists
            long revenue   = paymentRepository.sumApprovedAmountBetween(
                                 com.prod.ploy.model.Payment.PaymentStatus.APPROVED, start, end).longValue();

            result.add(new RevenueDataPoint(date.toString(), revenue, orders, inquiries));
        }

        return result;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static String projectActivityType(Project.ProjectStatus status) {
        return switch (status) {
            case BRIEF_SUBMITTED, REQUESTED -> "INQUIRY_SUBMITTED";
            case REVIEWING                  -> "INQUIRY_REVIEWING";
            case APPROVED                   -> "INQUIRY_APPROVED";
            case REJECTED                   -> "INQUIRY_REJECTED";
            case ASSIGNED                   -> "PROJECT_ASSIGNED";
            case IN_PROGRESS                -> "PROJECT_STARTED";
            case REVIEW                     -> "DRAFT_UPLOADED";
            case DELIVERED, COMPLETED       -> "ORDER_COMPLETED";
        };
    }

    private static String buildProjectMessage(Project p, String type) {
        String owner = p.getOwnerName();
        String subject = p.getTitle() != null && !p.getTitle().isBlank()
                ? p.getTitle()
                : p.getType().name();
        return switch (type) {
            case "INQUIRY_SUBMITTED"  -> owner + "님이 " + subject + " 문의를 제출했습니다.";
            case "INQUIRY_REVIEWING"  -> subject + " 문의가 검토 중입니다.";
            case "INQUIRY_APPROVED"   -> subject + " 문의가 승인되었습니다.";
            case "INQUIRY_REJECTED"   -> subject + " 문의가 거절되었습니다.";
            case "PROJECT_ASSIGNED"   -> subject + " 프로젝트에 파트너가 배정되었습니다.";
            case "PROJECT_STARTED"    -> subject + " 프로젝트가 시작되었습니다.";
            case "DRAFT_UPLOADED"     -> subject + " 초안이 업로드되었습니다.";
            case "ORDER_COMPLETED"    -> subject + " 프로젝트가 완료되었습니다.";
            default                   -> owner + "님의 " + subject + " 프로젝트가 업데이트되었습니다.";
        };
    }

    private static String partnerActivityType(PartnerApplication.ApplicationStatus status) {
        return switch (status) {
            case PENDING  -> "PARTNER_APPLIED";
            case APPROVED -> "PARTNER_APPROVED";
            case REJECTED -> "PARTNER_REJECTED";
            case DISABLED -> "PARTNER_REJECTED";
        };
    }

    private static String partnerStatusLabel(PartnerApplication.ApplicationStatus status) {
        return switch (status) {
            case PENDING  -> "파트너 신청을 제출";
            case APPROVED -> "파트너로 승인";
            case REJECTED -> "파트너 신청이 거절";
            case DISABLED -> "파트너 자격이 비활성화";
        };
    }
}
