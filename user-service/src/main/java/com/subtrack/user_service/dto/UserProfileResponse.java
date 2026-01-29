package com.subtrack.user_service.dto;

import java.time.Instant;
import java.util.UUID;

public record UserProfileResponse(
        UUID userId,
        String email,
        String fullName,
        String timezone,
        String currency,
        boolean emailNotifications,
        boolean pushNotifications,
        Instant createdAt,
        Instant updatedAt
) {}

