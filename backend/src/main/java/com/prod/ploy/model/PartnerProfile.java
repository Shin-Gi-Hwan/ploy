package com.prod.ploy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "partner_profiles")
@Getter @Setter @NoArgsConstructor
public class PartnerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, unique = true)
    private Member member;

    @Column(nullable = false)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String profileImageUrl;

    @Column(length = 500)
    private String specialties;

    private Integer yearsOfExperience;

    @Column(length = 500)
    private String skills;

    @Column(nullable = false)
    private Double averageRating = 0.0;

    @Column(nullable = false)
    private Integer completedCount = 0;

    @Column(nullable = false)
    private Boolean visible = false;

    @OneToMany(mappedBy = "partnerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PortfolioItem> portfolioItems = new ArrayList<>();
}
