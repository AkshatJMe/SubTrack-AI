package com.subtrack.user_service.dto;

public record UserPreferencesResponse(
        boolean emailNotifications,
        boolean pushNotifications
) {}

