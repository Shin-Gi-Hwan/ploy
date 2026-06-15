package com.prod.ploy.dto;

import com.prod.ploy.model.Project.ProjectType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record IntakeRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        String phone,
        @NotNull ProjectType type,
        @NotBlank String visionText,
        String colorPreferences,
        String styleRefs,
        String additionalNotes
) {}
