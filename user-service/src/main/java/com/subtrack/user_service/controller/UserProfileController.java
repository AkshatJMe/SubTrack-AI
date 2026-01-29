package com.subtrack.user_service.controller;

import com.subtrack.user_service.dto.UpdatePreferencesRequest;
import com.subtrack.user_service.dto.UpdateUserProfileRequest;
import com.subtrack.user_service.dto.UserPreferencesResponse;
import com.subtrack.user_service.dto.UserProfileResponse;
import com.subtrack.user_service.service.CurrentUserService;
import com.subtrack.user_service.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserProfileController {

    private final CurrentUserService currentUserService;
    private final UserProfileService userProfileService;

    public UserProfileController(CurrentUserService currentUserService, UserProfileService userProfileService) {
        this.currentUserService = currentUserService;
        this.userProfileService = userProfileService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMe() {
        UUID userId = currentUserService.requireUserId();
        return ResponseEntity.ok(userProfileService.getUserProfile(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMe(@Valid @RequestBody UpdateUserProfileRequest req) {
        UUID userId = currentUserService.requireUserId();
        return ResponseEntity.ok(userProfileService.updateUserProfile(userId, req));
    }

    @GetMapping("/preferences")
    public ResponseEntity<UserPreferencesResponse> getPreferences() {
        UUID userId = currentUserService.requireUserId();
        return ResponseEntity.ok(userProfileService.getPreferences(userId));
    }

    @PutMapping("/preferences")
    public ResponseEntity<UserPreferencesResponse> updatePreferences(@Valid @RequestBody UpdatePreferencesRequest req) {
        UUID userId = currentUserService.requireUserId();
        return ResponseEntity.ok(userProfileService.updatePreferences(userId, req));
    }
}

