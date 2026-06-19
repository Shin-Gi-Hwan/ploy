package com.prod.ploy.dto;

import java.time.LocalDateTime;

/**
 * A single item in the recent-activity feed.
 *
 * type values (string enum):
 *   INQUIRY_SUBMITTED  — new project/brief submitted
 *   INQUIRY_REVIEWING  — project moved to REVIEWING
 *   INQUIRY_APPROVED   — project approved
 *   INQUIRY_REJECTED   — project rejected
 *   PROJECT_ASSIGNED   — freelancer assigned
 *   PROJECT_STARTED    — project moved to IN_PROGRESS
 *   DRAFT_UPLOADED     — deliverable submitted for review
 *   ORDER_COMPLETED    — project delivered / completed
 *   MEMBER_REGISTERED  — new member registration
 *   PARTNER_APPLIED    — partner application submitted
 *   PARTNER_APPROVED   — partner application approved
 *   PARTNER_REJECTED   — partner application rejected
 */
public record ActivityItem(
        Long id,
        String type,
        String message,
        Long targetId,
        LocalDateTime createdAt
) {}
