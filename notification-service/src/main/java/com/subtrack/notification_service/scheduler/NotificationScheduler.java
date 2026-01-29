package com.subtrack.notification_service.scheduler;

import com.subtrack.notification_service.service.RuleEngineService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationScheduler {
    private static final Logger log = LoggerFactory.getLogger(NotificationScheduler.class);

    private final RuleEngineService ruleEngineService;

    public NotificationScheduler(RuleEngineService ruleEngineService) {
        this.ruleEngineService = ruleEngineService;
    }

    @Scheduled(cron = "${notifications.scheduler.cron:0 0 9 * * ?}")
    public void runDailyRuleEvaluation() {
        log.info("Starting daily notification rule evaluation");
        ruleEngineService.evaluateRenewalRules();
        ruleEngineService.evaluateOverspendRules();
        log.info("Finished daily notification rule evaluation");
    }
}

