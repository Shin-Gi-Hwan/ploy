package com.prod.ploy.dto;

import com.prod.ploy.model.Deliverable;
import com.prod.ploy.model.Project;

import java.time.LocalDateTime;
import java.util.List;

public record ConsoleProjectDetail(
        Long id,
        String title,
        String type,
        String status,
        String adminNote,
        String rejectionReason,
        // Owner info
        Long ownerId,
        String ownerName,
        String ownerEmail,
        boolean isGuest,
        // Freelancer info
        Long freelancerId,
        String freelancerName,
        String freelancerEmail,
        // Deliverables
        List<DeliverableItem> deliverables,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public record DeliverableItem(Long id, String fileUrl, Integer version, String note, LocalDateTime uploadedAt) {
        public static DeliverableItem from(Deliverable d) {
            return new DeliverableItem(d.getId(), d.getFileUrl(), d.getVersion(), d.getNote(), d.getUploadedAt());
        }
    }

    public static ConsoleProjectDetail from(Project p) {
        Long ownerId  = p.getMember() != null ? p.getMember().getId()   : p.getClient() != null ? p.getClient().getId()   : null;
        String ownerEmail = p.getMember() != null ? p.getMember().getEmail() : p.getClient() != null ? p.getClient().getEmail() : null;

        return new ConsoleProjectDetail(
                p.getId(),
                p.getTitle() != null ? p.getTitle() : p.getType().name(),
                p.getType().name(),
                p.getStatus().name(),
                p.getAdminNote(),
                p.getRejectionReason(),
                ownerId, p.getOwnerName(), ownerEmail,
                p.getMember() == null,
                p.getFreelancer() != null ? p.getFreelancer().getId()    : null,
                p.getFreelancer() != null ? p.getFreelancer().getName()  : null,
                p.getFreelancer() != null ? p.getFreelancer().getEmail() : null,
                p.getDeliverables().stream().map(DeliverableItem::from).toList(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
