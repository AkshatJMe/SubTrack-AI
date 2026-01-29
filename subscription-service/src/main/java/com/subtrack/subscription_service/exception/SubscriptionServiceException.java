package com.subtrack.subscription_service.exception;

import org.springframework.http.HttpStatus;

public class SubscriptionServiceException extends RuntimeException {
    private final HttpStatus status;

    public SubscriptionServiceException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}

