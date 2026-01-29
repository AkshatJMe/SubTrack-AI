package com.subtrack.user_service.exception;

import org.springframework.http.HttpStatus;

import java.util.UUID;

public class UserNotFoundException extends UserServiceException {
    public UserNotFoundException(UUID userId) {
        super(HttpStatus.NOT_FOUND, "User profile not found for userId=" + userId);
    }
}

