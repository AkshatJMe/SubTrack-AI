package com.subtrack.subscription_service.exception;

import org.springframework.http.HttpStatus;

import java.util.UUID;

public class SubscriptionNotFoundException extends SubscriptionServiceException {
    public SubscriptionNotFoundException(UUID id) {
        super(HttpStatus.NOT_FOUND, "Subscription not found for id=" + id);
    }
}

