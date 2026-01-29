CREATE TABLE IF NOT EXISTS subscriptions (
    id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    category VARCHAR(32) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    billing_cycle VARCHAR(32) NOT NULL,
    renewal_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_subscriptions_user_id (user_id),
    KEY idx_subscriptions_user_renewal (user_id, renewal_date),
    KEY idx_subscriptions_status_renewal (status, renewal_date)
);

CREATE TABLE IF NOT EXISTS bills (
    id CHAR(36) NOT NULL,
    subscription_id CHAR(36) NOT NULL,
    bill_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    paid BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    KEY idx_bills_subscription_id (subscription_id),
    CONSTRAINT fk_bills_subscription
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
        ON DELETE CASCADE
);

