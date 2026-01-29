package com.subtrack.user_service.kafka;

import com.subtrack.user_service.service.UserProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class UserCreatedListener {
    private static final Logger log = LoggerFactory.getLogger(UserCreatedListener.class);

    private final UserProfileService userProfileService;

    public UserCreatedListener(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @KafkaListener(
            topics = "${kafka.topics.user-created:user.created}",
            containerFactory = "userCreatedKafkaListenerContainerFactory"
    )
    public void onUserCreated(UserCreatedEvent event) {
        if (event == null || event.userId() == null || event.email() == null || event.email().isBlank()) {
            log.warn("Ignoring invalid user.created event payload={}", event);
            return;
        }
        userProfileService.createProfileFromEvent(event.userId(), event.email());
    }
}

