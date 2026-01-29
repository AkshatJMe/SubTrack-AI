package com.subtrack.user_service.exception;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends UserServiceException {
    public ForbiddenException(String message) {
        super(HttpStatus.FORBIDDEN, message);
    }
}

