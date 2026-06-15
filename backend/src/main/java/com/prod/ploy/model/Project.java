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
 *   BRIEF_SUBMITTED → IN_PROGRESS → REVIEW → DELIVERED
 *
 * Status is admin-driven. Client sees current status on the tracking page.
 * magicToken is a UUID generated at creation; used as the client's tracking link
 * key. Does not expire in v1 (explicit design decision — revisit in v2).
 */
@Entity
@Table(name = "projects")
@Getter @Setter @NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.BRIEF_SUBMITTED;

    @Column(nullable = false, unique = true, updatable = false)
    private String magicToken;

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

    public enum ProjectType {
        BUSINESS_CARD, PRESENTATION, WEBSITE
    }

    public enum ProjectStatus {
        BRIEF_SUBMITTED, IN_PROGRESS, REVIEW, DELIVERED
    }
}
