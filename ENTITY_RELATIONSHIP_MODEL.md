# Entity-Relationship Model for SubTrack AI

## Overview
This document describes the entity-relationship model for the SubTrack AI microservices-based subscription tracking platform. The system consists of multiple databases across different services.

## Databases
- **auth**: Authentication and authorization data
- **user_service**: User profile information
- **subscription_service**: Subscription and billing data
- **notification_service**: Notification and caching data

## Entities

### 1. UserAuth (auth database)
**Primary Key:** id (UUID)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Unique user identifier |
| email | VARCHAR(320) | UNIQUE, NOT NULL | User email address |
| passwordHash | VARCHAR(100) | NOT NULL | Hashed password |
| role | VARCHAR(50) | NOT NULL | User role (e.g., USER, ADMIN) |
| createdAt | TIMESTAMP | NOT NULL | Account creation timestamp |

### 2. RefreshToken (auth database)
**Primary Key:** id (UUID)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Token identifier |
| user | UserAuth | FK, NOT NULL | Reference to user |
| tokenHash | VARCHAR(64) | UNIQUE, NOT NULL | Hashed refresh token |
| expiresAt | TIMESTAMP | NOT NULL | Token expiration time |
| revoked | BOOLEAN | NOT NULL | Whether token is revoked |
| replacedByToken | UUID | NULL | ID of replacement token |
| createdAt | TIMESTAMP | NOT NULL | Token creation timestamp |

### 3. UserProfile (user_service database)
**Primary Key:** userId (UUID) - Foreign Key to UserAuth.id

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| userId | UUID | PK, FK, NOT NULL | References UserAuth.id |
| email | VARCHAR(320) | UNIQUE, NOT NULL | User email (duplicate for service isolation) |
| fullName | VARCHAR(255) | NULL | User's full name |
| timezone | VARCHAR(64) | NULL | User's timezone |
| currency | VARCHAR(3) | NULL | Preferred currency code |
| emailNotifications | BOOLEAN | NOT NULL, DEFAULT TRUE | Email notification preference |
| pushNotifications | BOOLEAN | NOT NULL, DEFAULT TRUE | Push notification preference |
| createdAt | TIMESTAMP | NOT NULL | Profile creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last profile update timestamp |

### 4. Subscription (subscription_service database)
**Primary Key:** id (UUID)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Subscription identifier |
| userId | UUID | FK, NOT NULL | References UserAuth.id |
| serviceName | VARCHAR(255) | NOT NULL | Name of the subscribed service |
| category | ENUM | NOT NULL | Category: OTT, UTILITIES, RENT, SOFTWARE, OTHER |
| amount | DECIMAL(12,2) | NOT NULL | Subscription amount |
| billingCycle | ENUM | NOT NULL | Billing cycle: MONTHLY, YEARLY, WEEKLY |
| renewalDate | DATE | NOT NULL | Next renewal date |
| status | ENUM | NOT NULL | Status: ACTIVE, PAUSED, CANCELLED |
| createdAt | TIMESTAMP | NOT NULL | Subscription creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last subscription update timestamp |

### 5. Bill (subscription_service database)
**Primary Key:** id (UUID)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Bill identifier |
| subscription | Subscription | FK, NOT NULL | Reference to subscription |
| billDate | DATE | NOT NULL | Date the bill was generated |
| amount | DECIMAL(12,2) | NOT NULL | Bill amount |
| paid | BOOLEAN | NOT NULL, DEFAULT FALSE | Payment status |

### 6. Notification (notification_service database)
**Primary Key:** id (UUID)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Notification identifier |
| userId | UUID | FK, NOT NULL | References UserAuth.id |
| subscriptionId | UUID | FK, NULL | References Subscription.id (nullable) |
| type | ENUM | NOT NULL | Type: RENEWAL, OVERSPEND, INACTIVE |
| channel | ENUM | NOT NULL | Channel: EMAIL |
| status | ENUM | NOT NULL | Status: SENT, FAILED |
| sentAt | TIMESTAMP | NULL | When notification was sent |
| createdAt | TIMESTAMP | NOT NULL | Notification creation timestamp |
| dedupeKey | VARCHAR(255) | UNIQUE, NOT NULL | Deduplication key |

### 7. NotificationRule (notification_service database)
**Primary Key:** id (UUID)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Rule identifier |
| ruleType | ENUM | NOT NULL | Rule type: RENEWAL, OVERSPEND |
| daysBefore | INT | NOT NULL | Days before event to trigger |
| enabled | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether rule is active |

### 8. SubscriptionCache (notification_service database)
**Primary Key:** subscriptionId (UUID) - Foreign Key to Subscription.id

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| subscriptionId | UUID | PK, FK, NOT NULL | References Subscription.id |
| userId | UUID | FK, NOT NULL | References UserAuth.id |
| serviceName | VARCHAR(255) | NOT NULL | Cached service name |
| amount | DECIMAL(12,2) | NOT NULL | Cached subscription amount |
| renewalDate | DATE | NOT NULL | Cached renewal date |
| status | VARCHAR(32) | NOT NULL | Cached subscription status |
| updatedAt | TIMESTAMP | NOT NULL | Cache last update timestamp |

## Relationships

### One-to-Many Relationships
- **UserAuth → RefreshToken**: One user can have multiple refresh tokens
- **UserAuth → Subscription**: One user can have multiple subscriptions
- **UserAuth → Notification**: One user can receive multiple notifications
- **Subscription → Bill**: One subscription can have multiple bills

### One-to-One Relationships
- **UserAuth → UserProfile**: One user has one profile (same userId)
- **Subscription → SubscriptionCache**: One subscription has one cache entry (same subscriptionId)

### Many-to-One Relationships
- **RefreshToken → UserAuth**: Many tokens belong to one user
- **UserProfile → UserAuth**: Profile belongs to one user
- **Subscription → UserAuth**: Subscription belongs to one user
- **Bill → Subscription**: Bill belongs to one subscription
- **Notification → UserAuth**: Notification belongs to one user
- **Notification → Subscription**: Notification relates to one subscription (nullable)
- **SubscriptionCache → UserAuth**: Cache entry belongs to one user
- **SubscriptionCache → Subscription**: Cache entry belongs to one subscription

## Database Schema Diagram (Text Representation)

```
┌─────────────────┐       ┌──────────────────┐
│   UserAuth      │       │  RefreshToken    │
│                 │1    N │                  │
│ - id (PK)       │◄──────┤ - id (PK)        │
│ - email         │       │ - user (FK)      │
│ - passwordHash  │       │ - tokenHash      │
│ - role          │       │ - expiresAt      │
│ - createdAt     │       │ - revoked        │
└─────────────────┘       │ - replacedByToken│
           │              │ - createdAt      │
           │1             └──────────────────┘
           │
           │1
           ▼
┌─────────────────┐       ┌──────────────────┐
│  UserProfile    │       │  Subscription    │
│                 │       │                  │
│ - userId (PK,FK)│       │ - id (PK)        │
│ - email         │       │ - userId (FK)    │
│ - fullName      │       │ - serviceName    │
│ - timezone      │       │ - category       │
│ - currency      │       │ - amount         │
│ - emailNotifs   │       │ - billingCycle   │
│ - pushNotifs    │       │ - renewalDate    │
│ - createdAt     │       │ - status         │
│ - updatedAt     │       │ - createdAt      │
└─────────────────┘       │ - updatedAt      │
                          └──────────────────┘
                                   │1
                                   │
                                   │N
                                   ▼
                         ┌──────────────────┐
                         │      Bill        │
                         │                  │
                         │ - id (PK)        │
                         │ - subscription(FK│
                         │ - billDate       │
                         │ - amount         │
                         │ - paid           │
                         └──────────────────┘

┌─────────────────┐       ┌──────────────────┐
│  Notification   │       │ NotificationRule │
│                 │       │                  │
│ - id (PK)       │       │ - id (PK)        │
│ - userId (FK)   │       │ - ruleType       │
│ - subscriptionId│       │ - daysBefore     │
│   (FK, nullable)│       │ - enabled        │
│ - type          │       └──────────────────┘
│ - channel       │
│ - status        │
│ - sentAt        │
│ - createdAt     │
│ - dedupeKey     │
└─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│SubscriptionCache│
│                 │
│ - subscriptionId│
│   (PK,FK)       │
│ - userId (FK)   │
│ - serviceName   │
│ - amount        │
│ - renewalDate   │
│ - status        │
│ - updatedAt     │
└─────────────────┘
```

## Key Design Notes

1. **Microservices Isolation**: Each service maintains its own database to ensure loose coupling
2. **Foreign Key References**: Cross-service references use UUIDs without database-level constraints
3. **Data Duplication**: Some data (like email in UserProfile) is duplicated for service autonomy
4. **Caching**: SubscriptionCache in notification service avoids cross-service calls during rule evaluation
5. **Deduplication**: Notifications use dedupeKey to prevent duplicate sends
6. **Enums**: Business logic enums ensure data consistency across services</content>
<parameter name="filePath">c:\Users\LENOVO\OneDrive\Desktop\coding\SubTrack AI\ENTITY_RELATIONSHIP_MODEL.md