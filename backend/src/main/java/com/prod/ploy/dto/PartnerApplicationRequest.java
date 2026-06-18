package com.prod.ploy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PartnerApplicationRequest(
    @NotBlank @Size(min = 50, max = 2000) String introduction,
    String portfolioUrl,
    String displayName,
    String specialties,
    Integer yearsOfExperience
) {}
