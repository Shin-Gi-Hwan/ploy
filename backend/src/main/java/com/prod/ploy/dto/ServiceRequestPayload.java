package com.prod.ploy.dto;

import com.prod.ploy.model.Project.ProjectType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ServiceRequestPayload(
        @NotNull ProjectType serviceType,
        @NotBlank String title,
        @NotBlank String description,
        String colorPreferences,
        String styleRefs,
        String additionalNotes,
        String deadline
) {}
