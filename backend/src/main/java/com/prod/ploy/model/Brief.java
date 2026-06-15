package com.prod.ploy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "briefs")
@Getter @Setter @NoArgsConstructor
public class Brief {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false, unique = true)
    private Project project;

    @Column(columnDefinition = "TEXT")
    private String visionText;

    @Column(columnDefinition = "TEXT")
    private String colorPreferences;

    // Free-text: clients paste URLs or describe reference brands
    @Column(columnDefinition = "TEXT")
    private String styleRefs;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    void prePersist() {
        submittedAt = LocalDateTime.now();
    }
}
