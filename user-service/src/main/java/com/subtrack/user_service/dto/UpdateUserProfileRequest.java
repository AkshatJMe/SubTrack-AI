package com.subtrack.user_service.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateUserProfileRequest(
        @Size(max = 255, message = "fullName must be <= 255 characters")
        String fullName,

        @Size(max = 64, message = "timezone must be <= 64 characters")
        String timezone,

        @Pattern(regexp = "^[A-Z]{3}$", message = "currency must be a 3-letter ISO code (e.g. USD)")
        String currency
) {}

