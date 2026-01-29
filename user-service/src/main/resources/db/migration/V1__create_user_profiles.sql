CREATE TABLE IF NOT EXISTS user_profiles (
    user_id CHAR(36) NOT NULL,
    email VARCHAR(320) NOT NULL,
    full_name VARCHAR(255) NULL,
    timezone VARCHAR(64) NULL,
    currency VARCHAR(3) NULL,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uk_user_profiles_email (email)
);

