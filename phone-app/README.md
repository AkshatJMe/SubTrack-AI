# SubTrack AI – Smart Subscription Manager (Dummy, Offline)

A **fully functional** demo React Native app built with **Expo + TypeScript + React Navigation**, designed to look and behave like a production subscription manager.

## Important

- **No backend**
- **No network requests**
- **All data stored locally** using AsyncStorage + in-memory Context state
- Data survives reloads (persisted locally)

## Features

- Fake authentication (signup/login, validation, auto-login, logout)
- Subscriptions: add, list, filter, detail, pause/resume, delete
- Dashboard: monthly spending, upcoming renewals, active count
- Analytics: monthly total + category breakdown + computed “trend” labels
- Notifications: locally generated renewal + overspending alerts
- FAQ decision tree (5–6 depth) loaded from local JSON
- Preferences & profile: toggles, clear all app data

## Running the app

### 1) Install prerequisites

- Install **Node.js LTS** (so `node`, `npm`, and `npx` work)
- Install Expo Go on your phone (optional)

### 2) Install dependencies

```bash
npm install
```

### 3) Start

```bash
npx expo start
```

## Local Storage Keys

- `user`
- `subscriptions`
- `notifications`
- `preferences`

