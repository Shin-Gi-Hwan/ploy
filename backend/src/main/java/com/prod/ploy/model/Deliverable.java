package com.prod.ploy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*
 * Deliverable versioning:
 *   Admin uploads a new revision by posting a new Deliverable with version = max + 1.
 *   Client always sees the latest (highest version number) via Project.latestDeliverable().
 *   fileUrl is an internal path only — never returned in API responses.
 *   Downloads are served through GET /api/files/{token}/{deliverableId}, which
 *   validates the magic token before streaming from StorageService.
 */
@Entity
@Table(name = "deliverables")
@Getter @Setter @NoArgsConstructor
public class Deliverable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    // Internal path or storage key — never exposed in API responses directly.
    // Downloads go through FileController which validates the magic token.
    @Column(nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    @Column(nullable = false)
    private Integer version;

    // Admin-authored note shown next to the download button on the tracking page.
    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    void prePersist() {
        uploadedAt = LocalDateTime.now();
    }
}
