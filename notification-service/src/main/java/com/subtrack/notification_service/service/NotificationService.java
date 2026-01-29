package com.subtrack.notification_service.service;

import com.subtrack.notification_service.entity.Notification;
import com.subtrack.notification_service.entity.NotificationChannel;
import com.subtrack.notification_service.entity.NotificationStatus;
import com.subtrack.notification_service.entity.NotificationType;
import com.subtrack.notification_service.exception.NotificationServiceException;
import com.subtrack.notification_service.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public NotificationService(NotificationRepository notificationRepository, EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    /**
     * Idempotent send: will NOT send if the dedupe key already exists.
     * Writes notification history for SENT/FAILED.
     */
    @Transactional
    public Notification sendEmailNotification(UUID userId,
                                              UUID subscriptionId,
                                              String toEmail,
                                              String subject,
                                              String body,
                                              NotificationType type,
                                              String dedupeKey) {

        if (notificationRepository.existsByDedupeKey(dedupeKey)) {
            log.info("Skipping duplicate notification dedupeKey={}", dedupeKey);
            return null;
        }

        Notification n = new Notification();
        n.setId(UUID.randomUUID());
        n.setUserId(userId);
        n.setSubscriptionId(subscriptionId);
        n.setType(type);
        n.setChannel(NotificationChannel.EMAIL);
        n.setDedupeKey(dedupeKey);
        n.setStatus(NotificationStatus.FAILED); // default until send succeeds

        try {
            // Pre-insert to enforce global idempotency under concurrency
            notificationRepository.save(n);
        } catch (DataIntegrityViolationException ex) {
            // Dedupe key unique constraint triggered (another instance already handled it)
            log.info("Skipping duplicate notification (race) dedupeKey={}", dedupeKey);
            return null;
        }

        try {
            emailService.sendEmail(toEmail, subject, body);
            n.setStatus(NotificationStatus.SENT);
            n.setSentAt(Instant.now());
            return notificationRepository.save(n);
        } catch (RuntimeException ex) {
            log.error("Email delivery failed dedupeKey={} userId={} subscriptionId={}", dedupeKey, userId, subscriptionId, ex);
            // Keep FAILED history; bubble up for observability if desired
            notificationRepository.save(n);
            throw new NotificationServiceException(HttpStatus.BAD_GATEWAY, "Email delivery failed");
        }
    }
}

