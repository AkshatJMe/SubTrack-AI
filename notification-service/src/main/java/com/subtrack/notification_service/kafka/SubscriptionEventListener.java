package com.subtrack.notification_service.kafka;

import com.subtrack.notification_service.service.RuleEngineService;
import com.subtrack.notification_service.service.SubscriptionCacheService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionEventListener {
    private static final Logger log = LoggerFactory.getLogger(SubscriptionEventListener.class);

    private final SubscriptionCacheService subscriptionCacheService;
    private final RuleEngineService ruleEngineService;

    public SubscriptionEventListener(SubscriptionCacheService subscriptionCacheService, RuleEngineService ruleEngineService) {
        this.subscriptionCacheService = subscriptionCacheService;
        this.ruleEngineService = ruleEngineService;
    }

    @KafkaListener(topics = "${kafka.topics.subscription-created:subscription.created}",
            containerFactory = "subscriptionEventKafkaListenerContainerFactory")
    public void onSubscriptionCreated(SubscriptionEvent event) {
        if (!isValid(event)) return;
        subscriptionCacheService.upsertFromEvent(event, "ACTIVE");
        log.info("Consumed subscription.created subscriptionId={}", event.subscriptionId());
    }

    @KafkaListener(topics = "${kafka.topics.subscription-updated:subscription.updated}",
            containerFactory = "subscriptionEventKafkaListenerContainerFactory")
    public void onSubscriptionUpdated(SubscriptionEvent event) {
        if (!isValid(event)) return;
        subscriptionCacheService.upsertFromEvent(event, null);
        log.info("Consumed subscription.updated subscriptionId={}", event.subscriptionId());
    }

    @KafkaListener(topics = "${kafka.topics.subscription-renewal-upcoming:subscription.renewal.upcoming}",
            containerFactory = "subscriptionEventKafkaListenerContainerFactory")
    public void onSubscriptionRenewalUpcoming(SubscriptionEvent event) {
        if (!isValid(event)) return;
        subscriptionCacheService.upsertFromEvent(event, null);
        ruleEngineService.processRenewalUpcomingEvent(event);
        log.info("Consumed subscription.renewal.upcoming subscriptionId={}", event.subscriptionId());
    }

    // Future topic (placeholder)
    @KafkaListener(topics = "${kafka.topics.alert-overspend:alert.overspend}",
            containerFactory = "subscriptionEventKafkaListenerContainerFactory")
    public void onOverspendAlert(SubscriptionEvent event) {
        // Schema may differ in future; keep safe.
        log.info("Consumed alert.overspend (future) payload={}", event);
    }

    private boolean isValid(SubscriptionEvent event) {
        if (event == null || event.userId() == null || event.subscriptionId() == null) {
            log.warn("Ignoring invalid subscription event payload={}", event);
            return false;
        }
        if (event.serviceName() == null || event.serviceName().isBlank()) {
            log.warn("Ignoring subscription event with blank serviceName subscriptionId={}", event.subscriptionId());
            return false;
        }
        if (event.renewalDate() == null || event.amount() == null) {
            log.warn("Ignoring subscription event with missing fields subscriptionId={}", event.subscriptionId());
            return false;
        }
        return true;
    }
}

