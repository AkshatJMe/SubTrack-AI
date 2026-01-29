package com.subtrack.notification_service.service;

import com.subtrack.notification_service.entity.SubscriptionCache;
import com.subtrack.notification_service.kafka.SubscriptionEvent;
import com.subtrack.notification_service.repository.SubscriptionCacheRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SubscriptionCacheService {
    private static final Logger log = LoggerFactory.getLogger(SubscriptionCacheService.class);

    private final SubscriptionCacheRepository subscriptionCacheRepository;

    public SubscriptionCacheService(SubscriptionCacheRepository subscriptionCacheRepository) {
        this.subscriptionCacheRepository = subscriptionCacheRepository;
    }

    /**
     * Upserts local subscription projection used for cron-based rule evaluation.
     *
     * @param statusOverride if non-null, sets status to this value; otherwise keeps existing or defaults to ACTIVE.
     */
    @Transactional
    public void upsertFromEvent(SubscriptionEvent event, String statusOverride) {
        SubscriptionCache cache = subscriptionCacheRepository.findById(event.subscriptionId())
                .orElseGet(() -> {
                    SubscriptionCache sc = new SubscriptionCache();
                    sc.setSubscriptionId(event.subscriptionId());
                    sc.setUserId(event.userId());
                    sc.setStatus("ACTIVE");
                    return sc;
                });

        // Guard against cross-user corruption in case of bad events.
        UUID existingUser = cache.getUserId();
        if (existingUser != null && !existingUser.equals(event.userId())) {
            log.warn("Ignoring event that changes userId for subscriptionId={} oldUser={} newUser={}",
                    event.subscriptionId(), existingUser, event.userId());
            return;
        }

        cache.setUserId(event.userId());
        cache.setServiceName(event.serviceName().trim());
        cache.setAmount(event.amount());
        cache.setRenewalDate(event.renewalDate());
        if (statusOverride != null) {
            cache.setStatus(statusOverride);
        } else if (cache.getStatus() == null) {
            cache.setStatus("ACTIVE");
        }

        subscriptionCacheRepository.save(cache);
    }
}

