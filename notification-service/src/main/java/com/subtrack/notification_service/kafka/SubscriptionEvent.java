package com.subtrack.notification_service.kafka;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record SubscriptionEvent(
        UUID subscriptionId,
        UUID userId,
        String serviceName,
        LocalDate renewalDate,
        BigDecimal amount
) {}

