package com.prod.ploy.dto;

import com.prod.ploy.model.Project.ProjectStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(@NotNull ProjectStatus status) {}
