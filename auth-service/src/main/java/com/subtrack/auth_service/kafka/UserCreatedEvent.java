package com.subtrack.auth_service.kafka;

import java.util.UUID;

public record UserCreatedEvent(
        UUID userId,
        String email
) {}

