CREATE DATABASE IF NOT EXISTS auth;
CREATE DATABASE IF NOT EXISTS user_service;
CREATE DATABASE IF NOT EXISTS subscription_service;
CREATE DATABASE IF NOT EXISTS notification_service;

CREATE USER IF NOT EXISTS 'akshat'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON auth.* TO 'akshat'@'%';
GRANT ALL PRIVILEGES ON user_service.* TO 'akshat'@'%';
GRANT ALL PRIVILEGES ON subscription_service.* TO 'akshat'@'%';
GRANT ALL PRIVILEGES ON notification_service.* TO 'akshat'@'%';
FLUSH PRIVILEGES;

