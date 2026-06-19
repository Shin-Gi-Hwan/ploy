package com.prod.ploy.dto;

import java.util.Map;

public record DashboardStatsResponse(
        long totalMembers,
        long newMembersToday,
        long totalPartners,
        long pendingPartnerApplications,
        long totalProjects,
        long activeProjects,
        long newProjectsToday,
        long pendingApprovals,
        Map<String, Long> projectsByStatus
) {}
