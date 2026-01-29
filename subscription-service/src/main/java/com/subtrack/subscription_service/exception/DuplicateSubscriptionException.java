package com.subtrack.subscription_service.exception;

import org.springframework.http.HttpStatus;

public class DuplicateSubscriptionException extends SubscriptionServiceException {
    public DuplicateSubscriptionException(String message) {
        super(HttpStatus.CONFLICT, message);
    }
}

