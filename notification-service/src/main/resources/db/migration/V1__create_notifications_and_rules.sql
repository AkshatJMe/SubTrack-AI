CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    subscription_id CHAR(36) NULL,
    type VARCHAR(32) NOT NULL,
    channel VARCHAR(16) NOT NULL,
    status VARCHAR(16) NOT NULL,
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dedupe_key VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_notifications_dedupe (dedupe_key),
    KEY idx_notifications_user_created (user_id, created_at)
);

CREATE TABLE IF NOT EXISTS notification_rules (
    id CHAR(36) NOT NULL,
    rule_type VARCHAR(32) NOT NULL,
    days_before INT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    UNIQUE KEY uk_rules_type_days (rule_type, days_before)
);

-- Local projection to support cron rule evaluation without calling Subscription Service
CREATE TABLE IF NOT EXISTS subscription_cache (
    subscription_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    renewal_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (subscription_id),
    KEY idx_cache_user_renewal (user_id, renewal_date),
    KEY idx_cache_status_renewal (status, renewal_date)
);

