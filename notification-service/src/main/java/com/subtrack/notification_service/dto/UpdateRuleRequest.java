package com.subtrack.notification_service.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateRuleRequest(
        @NotNull(message = "enabled is required")
        Boolean enabled
) {}

