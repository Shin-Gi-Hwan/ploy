package com.prod.ploy.dto;

import com.prod.ploy.model.Project.ProjectStatus;
import com.prod.ploy.model.Project.ProjectType;

public record TrackingResponse(
        Long projectId,
        ProjectType type,
        ProjectStatus status,
        String clientName,
        DeliverableView latestDeliverable
) {
    public record DeliverableView(
            Long id,
            Integer version,
            String note,
            String downloadUrl  // /api/files/{token}/{deliverableId} — never the raw fileUrl
    ) {}
}
