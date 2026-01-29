package com.subtrack.user_service.exception;

import org.springframework.http.HttpStatus;

import java.util.UUID;

public class DuplicateProfileException extends UserServiceException {
    public DuplicateProfileException(UUID userId) {
        super(HttpStatus.CONFLICT, "User profile already exists for userId=" + userId);
    }
}

