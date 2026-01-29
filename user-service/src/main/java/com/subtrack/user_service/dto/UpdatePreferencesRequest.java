package com.subtrack.user_service.dto;

import jakarta.validation.constraints.NotNull;

public record UpdatePreferencesRequest(
        @NotNull(message = "emailNotifications is required")
        Boolean emailNotifications,

        @NotNull(message = "pushNotifications is required")
        Boolean pushNotifications
) {}

