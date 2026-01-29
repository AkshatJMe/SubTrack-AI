package com.subtrack.notification_service.service;

import com.subtrack.notification_service.entity.NotificationType;
import com.subtrack.notification_service.entity.RuleType;
import com.subtrack.notification_service.entity.SubscriptionCache;
import com.subtrack.notification_service.kafka.SubscriptionEvent;
import com.subtrack.notification_service.repository.NotificationRuleRepository;
import com.subtrack.notification_service.repository.SubscriptionCacheRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class RuleEngineService {
    private static final Logger log = LoggerFactory.getLogger(RuleEngineService.class);

    private final NotificationRuleRepository ruleRepository;
    private final SubscriptionCacheRepository subscriptionCacheRepository;
    private final NotificationService notificationService;

    public RuleEngineService(NotificationRuleRepository ruleRepository,
                             SubscriptionCacheRepository subscriptionCacheRepository,
                             NotificationService notificationService) {
        this.ruleRepository = ruleRepository;
        this.subscriptionCacheRepository = subscriptionCacheRepository;
        this.notificationService = notificationService;
    }

    /**
     * Process an incoming renewal-upcoming event immediately (fast path).
     * Assumes the event is already rule-selected by Subscription Service, but still enforces idempotency.
     */
    @Transactional
    public void processRenewalUpcomingEvent(SubscriptionEvent event) {
        // In a real system we'd look up the user's email from User Service or an event-carried field.
        // For now, we send to a placeholder address derived from userId.
        String to = deriveEmail(event.userId().toString());

        String subject = "Upcoming renewal: " + event.serviceName();
        String body = """
                Your subscription is renewing soon.

                Service: %s
                Amount: %s
                Renewal date: %s

                Action: Review or cancel if you no longer need it.
                """.formatted(event.serviceName(), event.amount(), event.renewalDate());

        String dedupeKey = "RENEWAL_EVENT:%s:%s".formatted(event.subscriptionId(), event.renewalDate());
        notificationService.sendEmailNotification(event.userId(), event.subscriptionId(), to, subject, body, NotificationType.RENEWAL, dedupeKey);
    }

    /**
     * Cron path: evaluate renewal rules from DB (days_before) against the local subscription projection.
     */
    @Transactional
    public void evaluateRenewalRules() {
        var rules = ruleRepository.findByRuleTypeAndEnabledTrue(RuleType.RENEWAL);
        if (rules.isEmpty()) {
            log.info("No enabled RENEWAL rules");
            return;
        }

        LocalDate todayUtc = LocalDate.now(ZoneOffset.UTC);
        for (var rule : rules) {
            LocalDate target = todayUtc.plusDays(rule.getDaysBefore());
            List<SubscriptionCache> due = subscriptionCacheRepository.findByRenewalDateAndStatus(target, "ACTIVE");
            for (SubscriptionCache sc : due) {
                String to = deriveEmail(sc.getUserId().toString());
                String subject = "Upcoming renewal: " + sc.getServiceName();
                String body = """
                        Your subscription is renewing soon.

                        Service: %s
                        Amount: %s
                        Renewal date: %s

                        Action: Review or cancel if you no longer need it.
                        """.formatted(sc.getServiceName(), sc.getAmount(), sc.getRenewalDate());

                String dedupeKey = "RENEWAL_RULE:%s:%s:%dd".formatted(sc.getSubscriptionId(), target, rule.getDaysBefore());
                notificationService.sendEmailNotification(sc.getUserId(), sc.getSubscriptionId(), to, subject, body, NotificationType.RENEWAL, dedupeKey);
            }
            log.info("Evaluated renewal rule daysBefore={} targetDate={} candidates={}", rule.getDaysBefore(), target, due.size());
        }
    }

    @Transactional
    public void evaluateOverspendRules() {
        // Future: depends on analytics aggregation and thresholds.
        log.info("Overspend rules evaluation not implemented yet");
    }

    private String deriveEmail(String userId) {
        // Placeholder. In production: query User Service / cache email via user events.
        return "user+" + userId + "@example.com";
    }
}

