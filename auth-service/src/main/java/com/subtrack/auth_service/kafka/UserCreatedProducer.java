package com.subtrack.auth_service.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserCreatedProducer {
    private static final Logger log = LoggerFactory.getLogger(UserCreatedProducer.class);

    private final KafkaTemplate<String, UserCreatedEvent> kafkaTemplate;
    private final String topic;

    public UserCreatedProducer(KafkaTemplate<String, UserCreatedEvent> kafkaTemplate,
                               @Value("${kafka.topics.user-created:user.created}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    public void publishUserCreated(UUID userId, String email) {
        UserCreatedEvent event = new UserCreatedEvent(userId, email);
        kafkaTemplate.send(topic, userId.toString(), event)
                .whenComplete((res, ex) -> {
                    if (ex != null) {
                        log.error("Failed publishing user.created userId={}", userId, ex);
                    } else {
                        log.info("Published user.created userId={} partition={} offset={}",
                                userId,
                                res.getRecordMetadata().partition(),
                                res.getRecordMetadata().offset());
                    }
                });
    }
}

