package com.subtrack.notification_service.repository;

import com.subtrack.notification_service.entity.NotificationRule;
import com.subtrack.notification_service.entity.RuleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRuleRepository extends JpaRepository<NotificationRule, UUID> {
    List<NotificationRule> findByRuleTypeAndEnabledTrue(RuleType ruleType);
}

