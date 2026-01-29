package com.subtrack.user_service.kafka;

import java.util.UUID;

public record UserCreatedEvent(
        UUID userId,
        String email
) {}

