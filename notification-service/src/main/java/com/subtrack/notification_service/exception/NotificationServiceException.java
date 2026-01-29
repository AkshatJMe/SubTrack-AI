package com.subtrack.notification_service.exception;

import org.springframework.http.HttpStatus;

public class NotificationServiceException extends RuntimeException {
    private final HttpStatus status;

    public NotificationServiceException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}

