package com.prod.ploy.dto;

import java.util.Map;

/**
 * Dashboard summary stats returned by GET /api/console/dashboard/stats.
 *
 * Primary KPIs follow the Phase 2 spec shape exactly so the frontend can
 * render "today's value + day-over-day change badge" for every card.
 *
 * Change semantics: positive = increase vs yesterday, negative = decrease.
 * revenueChange is a percentage; all others are absolute counts.
 *
 * Supplementary totals (totalMembers, totalProjects, …) are kept for the
 * secondary stat-card row and any future use.
 */
public record DashboardStatsResponse(

        // ── Primary KPIs ──────────────────────────────────────────────────────
        long todayOrders,           // projects created today (proxy — no order table)
        long todayInquiries,        // REQUESTED + BRIEF_SUBMITTED projects created today
        long activeProjects,        // in-flight (IN_PROGRESS, REVIEWING, APPROVED, ASSIGNED, REVIEW)
        long pendingApprovals,      // REQUESTED projects awaiting admin action
        long newMembers,            // members registered today
        long todayRevenue,          // always 0 — no payment table yet

        // ── Day-over-day changes ──────────────────────────────────────────────
        long orderChange,           // todayOrders − yesterdayOrders
        long inquiryChange,         // todayInquiries − yesterdayInquiries
        long projectChange,         // new projects today − yesterday (same as orderChange)
        long approvalChange,        // new REQUESTED projects today − yesterday
        long memberChange,          // newMembers − yesterday's newMembers
        double revenueChange,       // always 0.0 — no payment table yet

        // ── Supplementary totals ─────────────────────────────────────────────
        long totalMembers,
        long totalProjects,
        long totalPartners,
        long pendingPartnerApplications,
        Map<String, Long> projectsByStatus

) {}
