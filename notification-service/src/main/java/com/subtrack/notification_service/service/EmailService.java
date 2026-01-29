package com.subtrack.notification_service.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String from;
    private final int attempts;
    private final long backoffMs;

    public EmailService(JavaMailSender mailSender,
                        @Value("${notifications.email.from:no-reply@subtrack.local}") String from,
                        @Value("${notifications.email.retry.attempts:3}") int attempts,
                        @Value("${notifications.email.retry.backoff-ms:500}") long backoffMs) {
        this.mailSender = mailSender;
        this.from = from;
        this.attempts = Math.max(1, attempts);
        this.backoffMs = Math.max(0, backoffMs);
    }

    public void sendEmail(String to, String subject, String body) {
        RuntimeException last = null;
        for (int i = 1; i <= attempts; i++) {
            try {
                MimeMessage msg = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(msg, false, StandardCharsets.UTF_8.name());
                helper.setFrom(from);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(body, false);
                mailSender.send(msg);
                return;
            } catch (RuntimeException | jakarta.mail.MessagingException ex) {
                last = ex instanceof RuntimeException re ? re : new RuntimeException(ex);
                log.warn("Email send attempt {}/{} failed to={} subject={}", i, attempts, to, subject, ex);
                if (i < attempts && backoffMs > 0) {
                    try {
                        Thread.sleep(backoffMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }
        throw last != null ? last : new RuntimeException("Email send failed");
    }
}

