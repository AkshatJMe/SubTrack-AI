package com.subtrack.user_service.service;

import com.subtrack.user_service.dto.UpdatePreferencesRequest;
import com.subtrack.user_service.dto.UpdateUserProfileRequest;
import com.subtrack.user_service.dto.UserPreferencesResponse;
import com.subtrack.user_service.dto.UserProfileResponse;
import com.subtrack.user_service.entity.UserProfile;
import com.subtrack.user_service.exception.UserNotFoundException;
import com.subtrack.user_service.repository.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Service
public class UserProfileService {
    private static final Logger log = LoggerFactory.getLogger(UserProfileService.class);

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * Idempotent creation of a profile from a user.created event.
     * - Creates a new record on first consumption
     * - If replayed, it will not create duplicates
     */
    @Transactional
    public void createProfileFromEvent(UUID userId, String email) {
        if (userProfileRepository.existsById(userId)) {
            log.debug("Profile already exists for userId={} (idempotent)", userId);
            return;
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        UserProfile profile = new UserProfile();
        profile.setUserId(userId);
        profile.setEmail(normalizedEmail);
        profile.setEmailNotifications(true);
        profile.setPushNotifications(true);

        try {
            userProfileRepository.save(profile);
            log.info("Created user profile from event userId={}", userId);
        } catch (DataIntegrityViolationException ex) {
            // Another consumer instance or replay could race; treat as idempotent if the record exists now.
            if (userProfileRepository.existsById(userId)) {
                log.info("Profile already created concurrently for userId={} (idempotent)", userId);
                return;
            }
            // Email uniqueness violation could happen if upstream published inconsistent events.
            if (userProfileRepository.findByEmail(normalizedEmail).isPresent()) {
                log.error("Email already exists for another user; skipping event userId={} email={}", userId, normalizedEmail);
                return;
            }
            log.error("Failed creating profile from event userId={} email={}", userId, normalizedEmail, ex);
            throw ex;
        }
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(UUID userId) {
        UserProfile profile = userProfileRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        return toProfileResponse(profile);
    }

    @Transactional
    public UserProfileResponse updateUserProfile(UUID userId, UpdateUserProfileRequest req) {
        UserProfile profile = userProfileRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));

        if (req.fullName() != null) profile.setFullName(req.fullName());
        if (req.timezone() != null) profile.setTimezone(req.timezone());
        if (req.currency() != null) profile.setCurrency(req.currency().toUpperCase(Locale.ROOT));

        UserProfile saved = userProfileRepository.save(profile);
        return toProfileResponse(saved);
    }

    @Transactional(readOnly = true)
    public UserPreferencesResponse getPreferences(UUID userId) {
        UserProfile profile = userProfileRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        return new UserPreferencesResponse(profile.isEmailNotifications(), profile.isPushNotifications());
    }

    @Transactional
    public UserPreferencesResponse updatePreferences(UUID userId, UpdatePreferencesRequest req) {
        UserProfile profile = userProfileRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        profile.setEmailNotifications(req.emailNotifications());
        profile.setPushNotifications(req.pushNotifications());
        UserProfile saved = userProfileRepository.save(profile);
        return new UserPreferencesResponse(saved.isEmailNotifications(), saved.isPushNotifications());
    }

    private UserProfileResponse toProfileResponse(UserProfile profile) {
        return new UserProfileResponse(
                profile.getUserId(),
                profile.getEmail(),
                profile.getFullName(),
                profile.getTimezone(),
                profile.getCurrency(),
                profile.isEmailNotifications(),
                profile.isPushNotifications(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}

