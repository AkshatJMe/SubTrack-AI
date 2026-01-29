package com.subtrack.subscription_service.service;

import com.subtrack.subscription_service.exception.ForbiddenException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CurrentUserService {

    public UUID requireUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new ForbiddenException("Missing user identity");
        }
        try {
            return UUID.fromString(auth.getPrincipal().toString());
        } catch (Exception ex) {
            throw new ForbiddenException("Invalid user identity");
        }
    }
}

