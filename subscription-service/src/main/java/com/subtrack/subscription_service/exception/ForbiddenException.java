package com.subtrack.subscription_service.exception;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends SubscriptionServiceException {
    public ForbiddenException(String message) {
        super(HttpStatus.FORBIDDEN, message);
    }
}

