package com.prod.ploy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/*
 * Project state machine:
 *
 *  Legacy (intake form, no auth):
 *    BRIEF_SUBMITTED → IN_PROGRESS → REVIEW → DELIVERED
 *
 *  New (service request, member auth):
 *    REQUESTED → REVIEWING → APPROVED → ASSIGNED → IN_PROGRESS → REVIEW → COMPLETED
 *                                                             └→ REJECTED (at any point before COMPLETED)
 *
 * member is null for projects created via the legacy intake form.
 * client is null for projects created via the member service-request flow.
 */
@Entity
@Table(name = "projects")
@Getter @Setter @NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Legacy: guest intake form ────────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    // ── New: registered member ───────────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // Assigned freelancer (set after ASSIGNED status)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id")
    private Member freelancer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectType type;

    @Column
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.BRIEF_SUBMITTED;

    @Column(nullable = false, unique = true, updatable = false)
    private String magicToken;

    @Column(columnDefinition = "TEXT")
    private String adminNote;

    @Column(length = 1000)
    private String rejectionReason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Brief brief;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("version DESC")
    private List<Deliverable> deliverables = new ArrayList<>();

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (magicToken == null) {
            magicToken = UUID.randomUUID().toString();
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Deliverable latestDeliverable() {
        return deliverables.isEmpty() ? null : deliverables.get(0);
    }

    /** Convenience: name of the person who owns this project */
    public String getOwnerName() {
        if (member != null) return member.getName();
        if (client != null) return client.getName();
        return "Unknown";
    }

    public enum ProjectType {
        // Original types
        BUSINESS_CARD, PRESENTATION, WEBSITE,
        // New types (Phase 1)
        LOGO, DETAIL_PAGE, MOBILE_APP
    }

    public enum ProjectStatus {
        // Legacy statuses (intake form flow)
        BRIEF_SUBMITTED, IN_PROGRESS, REVIEW, DELIVERED,
        // New statuses (member service-request flow)
        REQUESTED, REVIEWING, APPROVED, ASSIGNED, COMPLETED, REJECTED
    }
}
