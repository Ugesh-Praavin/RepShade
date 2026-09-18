# REPSHADE — TECHNICAL ARCHITECTURE SPECIFICATION

**Document:** 04 — Technical Architecture Specification
**Version:** 1.0
**Status:** Technical Foundation
**Product:** Repshade
**Platform:** iOS & Android
**Development Approach:** AI-assisted / Vibe Coding
**Primary Backend:** Firebase

---

# 1. TECHNICAL OBJECTIVE

Repshade must be built as a simple, maintainable, offline-first mobile application.

The architecture must:

* Be easy for AI coding agents to understand.
* Minimize unnecessary complexity.
* Support both Android and iOS.
* Work without an internet connection during workouts.
* Synchronize data with Firebase when connectivity is available.
* Keep workout state reliable.
* Scale beyond the MVP without requiring a complete rewrite.
* Keep business logic separate from UI.
* Make the Rolling Split Engine independent from the calendar.

---

# 2. TECHNOLOGY STACK

## Mobile Framework

React Native

## Application Framework

Expo

## Language

TypeScript

## Navigation

Expo Router

## UI Styling

NativeWind

## State Management

Zustand

## Backend

Firebase

## Authentication

Firebase Authentication

## Cloud Database

Cloud Firestore

## Cloud Storage

Firebase Storage

## Local Storage

Expo SQLite

## Forms

React Hook Form

## Validation

Zod

## Date Handling

date-fns

## Icons

Lucide React Native

## Charts

react-native-gifted-charts

## Notifications

Expo Notifications

## Networking

Firebase SDK

## Version Control

Git + GitHub

## Development

VS Code + AI coding agent + Expo

## Build

Expo / EAS Build

---

# 3. ARCHITECTURAL PHILOSOPHY

Repshade will use:

LOCAL-FIRST → CLOUD-SYNC

The mobile device should be capable of running the complete core workout experience independently.

Firebase should provide:

* Authentication
* Cloud backup
* Cross-device synchronization
* Persistent cloud data
* Future scalability

Firebase should NOT be required for every interaction during a workout.

---

# 4. HIGH-LEVEL ARCHITECTURE

```text
                         REPSHADE APP
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
               UI LAYER           BUSINESS LOGIC
                    │                   │
                    │             ┌─────┴─────┐
                    │             │           │
                    │             ▼           ▼
                    │       Split Engine   Workout Engine
                    │
                    ▼
              ZUSTAND STATE
                    │
             ┌──────┴──────┐
             │             │
             ▼             ▼
        LOCAL DATABASE   SYNC ENGINE
             │             │
             │             ▼
             │          FIREBASE
             │             │
             │      ┌──────┼──────┐
             │      ▼      ▼      ▼
             │     Auth Firestore Storage
             │
             └─────────────────────┘
```

---

# 5. ARCHITECTURE LAYERS

Repshade will use five major layers.

## Layer 1 — Presentation

Responsible for:

* Screens
* Components
* UI
* User interactions
* Animations

Examples:

* HomeScreen
* WorkoutScreen
* ExerciseCard
* SetRow
* RestTimer

---

## Layer 2 — State

Responsible for:

* Current application state
* Active workout
* Current split
* User preferences
* UI state

Technology:

Zustand

---

## Layer 3 — Domain / Business Logic

Responsible for:

* Rolling split
* Workout completion
* PR detection
* Progressive overload
* Workout calculations
* Volume calculations

This layer must NOT depend on React components.

---

## Layer 4 — Data

Responsible for:

* Local database
* Firebase
* Data repositories
* Synchronization

---

## Layer 5 — Infrastructure

Responsible for:

* Firebase configuration
* Notifications
* Device information
* Connectivity
* Logging
* Analytics

---

# 6. PROJECT STRUCTURE

Recommended structure:

```text
repshade/
│
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   │
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   │
│   ├── (onboarding)/
│   │   ├── welcome.tsx
│   │   ├── split-selection.tsx
│   │   ├── split-builder.tsx
│   │   └── review.tsx
│   │
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   ├── plan.tsx
│   │   ├── progress.tsx
│   │   ├── history.tsx
│   │   └── profile.tsx
│   │
│   ├── workout/
│   │   ├── [id].tsx
│   │   ├── active.tsx
│   │   └── summary.tsx
│   │
│   ├── exercise/
│   │   ├── [id].tsx
│   │   └── edit.tsx
│   │
│   └── settings/
│       ├── index.tsx
│       ├── workout.tsx
│       ├── appearance.tsx
│       ├── notifications.tsx
│       └── data.tsx
│
├── src/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── workout/
│   │   ├── exercise/
│   │   ├── split/
│   │   ├── charts/
│   │   └── common/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── workout/
│   │   ├── split/
│   │   ├── exercise/
│   │   ├── progress/
│   │   └── history/
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── workoutStore.ts
│   │   ├── splitStore.ts
│   │   ├── settingsStore.ts
│   │   └── syncStore.ts
│   │
│   ├── services/
│   │   ├── firebase/
│   │   ├── local/
│   │   ├── sync/
│   │   ├── notifications/
│   │   └── analytics/
│   │
│   ├── domain/
│   │   ├── split/
│   │   ├── workout/
│   │   ├── progression/
│   │   └── records/
│   │
│   ├── database/
│   │   ├── schema/
│   │   ├── migrations/
│   │   └── repositories/
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── workout.ts
│   │   ├── split.ts
│   │   ├── exercise.ts
│   │   └── progress.ts
│   │
│   ├── utils/
│   │   ├── dates.ts
│   │   ├── calculations.ts
│   │   ├── formatting.ts
│   │   └── validation.ts
│   │
│   └── constants/
│       ├── exercises.ts
│       ├── defaults.ts
│       └── config.ts
│
├── assets/
│
├── firebase/
│   ├── firestore.rules
│   └── firestore.indexes.json
│
├── .env
├── .env.example
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

---

# 7. ROUTING ARCHITECTURE

Expo Router will handle navigation.

Primary routes:

```text
/
├── onboarding
├── auth
├── (tabs)
│   ├── home
│   ├── plan
│   ├── progress
│   ├── history
│   └── profile
│
├── workout
│   ├── active
│   └── summary
│
└── exercise
```

Authentication state should determine whether the user sees:

Authentication → Onboarding → Application

---

# 8. STATE MANAGEMENT

Zustand will manage application state.

Do not use Redux for the MVP.

---

# 9. AUTH STORE

Responsible for:

* Current user
* Authentication state
* Loading state
* Sign in
* Sign out

Example:

```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  signIn(): Promise<void>;
  signOut(): Promise<void>;
}
```

---

# 10. SPLIT STORE

Responsible for:

* Active split
* Workout sequence
* Current workout index
* Split editing

Example:

```typescript
interface SplitState {
  activeSplit: Split | null;
  currentWorkoutIndex: number;

  getNextWorkout(): WorkoutTemplate | null;
  advanceWorkout(): void;
  skipWorkout(): void;
}
```

The Split Store must use the Split Engine.

---

# 11. WORKOUT STORE

Responsible for the active workout.

Example:

```typescript
interface WorkoutState {
  activeWorkout: WorkoutSession | null;

  startWorkout(): Promise<void>;
  updateSet(): Promise<void>;
  completeSet(): Promise<void>;
  addSet(): Promise<void>;
  finishWorkout(): Promise<void>;
  pauseWorkout(): Promise<void>;
  resumeWorkout(): Promise<void>;
  discardWorkout(): Promise<void>;
}
```

---

# 12. SETTINGS STORE

Responsible for:

* Weight unit
* Distance unit
* Rest timer preferences
* Theme
* Notifications
* RPE/RIR visibility

---

# 13. SYNC STORE

Responsible for:

* Sync state
* Pending changes
* Last synchronization
* Sync errors

Example states:

```text
SYNCED
SYNCING
PENDING
ERROR
OFFLINE
```

---

# 14. DOMAIN ARCHITECTURE

Business logic must be separated from UI.

Example:

```text
src/domain/split/splitEngine.ts
src/domain/workout/workoutEngine.ts
src/domain/progression/progressionEngine.ts
src/domain/records/recordEngine.ts
```

---

# 15. ROLLING SPLIT ENGINE

The Rolling Split Engine is the most important business logic module.

Location:

```text
src/domain/split/splitEngine.ts
```

Responsibilities:

* Determine next workout
* Advance split
* Skip workout
* Reset split
* Validate split position

---

# 16. ROLLING SPLIT RULE

The split position must only change when:

1. A workout is successfully completed.
2. A workout is intentionally skipped.

The split position must NOT change because:

* A day passed
* A week passed
* The application was closed
* The user did not train
* The phone was offline

---

# 17. SPLIT ALGORITHM

Example:

```typescript
function getNextWorkoutIndex(
  currentIndex: number,
  splitLength: number
): number {
  return (currentIndex + 1) % splitLength;
}
```

For a three-workout split:

```text
0 → 1
1 → 2
2 → 0
```

---

# 18. WORKOUT COMPLETION TRANSACTION

Workout completion must be treated as an atomic operation from the application's perspective.

Sequence:

```text
Validate workout
        ↓
Save workout locally
        ↓
Mark workout completed
        ↓
Advance split
        ↓
Save new split position
        ↓
Queue cloud synchronization
```

The split must not advance before the workout is successfully stored locally.

---

# 19. DOUBLE-COMPLETION PROTECTION

The application must prevent:

```text
Finish Workout
Finish Workout
```

from advancing:

```text
Push → Pull → Legs
```

to:

```text
Push → Legs
```

Use a completion identifier or transaction-safe state transition.

---

# 20. WORKOUT STATE MACHINE

Workout states:

```text
PLANNED
   ↓
IN_PROGRESS
   ↓
PAUSED
   ↓
IN_PROGRESS
   ↓
COMPLETED
```

Alternative:

```text
IN_PROGRESS → ABANDONED
```

Manual skip:

```text
PLANNED → SKIPPED
```

---

# 21. LOCAL-FIRST WORKOUT FLOW

When a user starts a workout:

```text
User taps Start
       ↓
Create local workout session
       ↓
Load exercise templates
       ↓
Load previous performance
       ↓
Display workout
```

No Firebase request should be required to begin the workout if the necessary data is already cached locally.

---

# 22. SET LOGGING FLOW

When a user enters:

22.5 kg × 10

the application should:

```text
Update Zustand
      ↓
Persist local database
      ↓
Update UI
      ↓
Queue sync
```

The UI must not wait for Firebase.

---

# 23. SYNC ARCHITECTURE

Use a queue-based synchronization model.

```text
Local Change
     ↓
Sync Queue
     ↓
Connectivity Check
     ↓
Firebase
     ↓
Success
     ↓
Mark Synced
```

If Firebase fails:

```text
Sync Queue
     ↓
Retry Later
```

---

# 24. SYNC QUEUE

Each pending operation should contain:

```typescript
interface SyncOperation {
  id: string;
  type: "create" | "update" | "delete";
  entity: string;
  entityId: string;
  payload: unknown;
  createdAt: number;
  retryCount: number;
}
```

---

# 25. CONFLICT STRATEGY

For MVP:

Use a simple last-write-wins strategy for non-critical configuration data.

For active workout data:

Prefer local data if the device has an unsynchronized local change.

The application should avoid silently overwriting a user's newly recorded workout.

---

# 26. FIREBASE RESPONSIBILITIES

Firebase is responsible for:

* Authentication
* Cloud persistence
* Backup
* Cross-device synchronization
* User data
* Analytics
* Storage

Firebase is NOT responsible for:

* Determining today's workout from the date
* Running the rolling split in real time
* Controlling the active workout UI
* Acting as the temporary workout state

Those responsibilities belong to the application.

---

# 27. FIREBASE AUTHENTICATION

Use:

Firebase Authentication

Initial providers:

* Google
* Email/password

The application should maintain a local authenticated session.

---

# 28. FIRESTORE

Cloud Firestore will store:

* User profile
* Workout splits
* Workout templates
* Exercises
* Completed workouts
* Sets
* Personal records
* Body weight
* User preferences

Exact schema will be defined in Document 05.

---

# 29. FIREBASE STORAGE

Firebase Storage should be reserved for larger files.

Future examples:

* Progress photos
* User profile images
* Exercise media

It should not be used for normal workout records.

Workout data belongs in Firestore/local SQLite.

---

# 30. OFFLINE ARCHITECTURE

The application should use:

Expo SQLite

for structured local data.

Local SQLite should contain cached:

* User profile
* Active split
* Workout templates
* Exercises
* Workout history
* Sets
* Pending sync operations

---

# 31. WHY SQLITE

SQLite is preferred over using only AsyncStorage because Repshade will eventually contain:

* Hundreds of workouts
* Thousands of sets
* Exercise history
* Progress calculations
* Sync metadata

Relational queries become useful.

Example:

"Get the most recent completed performance for this exercise."

SQLite is better suited for this than storing everything as large JSON objects.

---

# 32. LOCAL DATABASE PRINCIPLE

The local database must be optimized for:

FAST READS → FAST WRITES → OFFLINE ACCESS

The active workout should never depend on network latency.

---

# 33. FIRESTORE READ OPTIMIZATION

Avoid unnecessary Firestore reads.

Cache:

* Current split
* Current workout
* Exercise library
* Recent workout history
* User settings

Only synchronize when necessary.

This reduces Firebase usage and improves performance.

---

# 34. EXERCISE LIBRARY

The initial exercise library can be bundled with the application.

Example:

```text
src/constants/exercises.ts
```

This provides instant availability.

User-created exercises should be stored locally and synced to Firebase.

---

# 35. PROGRESSION ENGINE

Location:

```text
src/domain/progression/progressionEngine.ts
```

Responsibilities:

* Compare previous workout
* Calculate progression
* Suggest weight/reps
* Calculate volume
* Calculate estimated 1RM

The engine must only provide suggestions.

It must not automatically modify the user's program.

---

# 36. PR ENGINE

Location:

```text
src/domain/records/recordEngine.ts
```

It should detect:

* Weight PR
* Rep PR
* Volume PR
* Estimated 1RM PR

Historical data must never be modified when a new PR is created.

---

# 37. WORKOUT VOLUME

For normal weight-based exercises:

Volume:

```text
weight × reps
```

Example:

```text
22.5 kg × 10
= 225 kg
```

Workout volume is the sum of applicable set volumes.

Bodyweight exercises may use a different calculation or simply track reps.

---

# 38. ESTIMATED 1RM

For applicable exercises, Repshade may calculate estimated 1RM.

The exact formula should be implemented centrally.

Example:

```text
E1RM = calculated estimate
```

The application must clearly label it:

Estimated 1RM

It is not an actual tested one-rep maximum.

---

# 39. REST TIMER ARCHITECTURE

The timer should be independent of the workout UI component.

Location:

```text
src/features/workout/restTimer.ts
```

Timer state:

```typescript
interface RestTimerState {
  duration: number;
  remaining: number;
  isRunning: boolean;
}
```

The timer should continue when the application is backgrounded where supported by the platform.

---

# 40. NOTIFICATION ARCHITECTURE

Expo Notifications will handle:

* Rest timer completion
* Optional workout reminders

Notifications must be opt-in.

Do not send guilt-based notifications.

---

# 41. ANALYTICS

Analytics should be added carefully.

Useful anonymous product events:

```text
app_opened
onboarding_completed
split_created
workout_started
set_completed
workout_completed
workout_skipped
pr_achieved
```

Do not collect unnecessary personal information.

---

# 42. ERROR HANDLING

Errors must be categorized.

## Network Error

Keep working locally.

## Firebase Error

Queue operation for retry.

## Database Error

Show a recoverable error.

## Validation Error

Show inline validation.

## Unknown Error

Show a simple fallback message and log technical details separately.

---

# 43. ERROR UX

Never expose technical errors to users.

Bad:

```text
FirebaseError:
PERMISSION_DENIED
```

Good:

```text
Something went wrong.

Your workout is safely saved on this device.
We'll try syncing again.
```

---

# 44. SECURITY

Firebase Security Rules must ensure:

Users can only access their own data.

Conceptually:

```text
request.auth.uid == resource.data.userId
```

Exact rules will be defined in the Firebase specification.

---

# 45. ENVIRONMENT VARIABLES

Sensitive configuration must not be hardcoded into application source files.

Use environment configuration.

Example:

```text
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
```

A `.env.example` file must be included.

---

# 46. DEVELOPMENT ENVIRONMENTS

Use:

```text
Development
    ↓
Testing
    ↓
Production
```

Development Firebase resources should be separated from production resources when practical.

---

# 47. GIT STRATEGY

Use GitHub.

Recommended branches:

```text
main
develop
feature/*
fix/*
```

AI agents should work on focused branches or commits.

Do not allow an AI agent to rewrite unrelated parts of the application.

---

# 48. VIBE CODING RULES

Because Repshade will be developed primarily through AI coding agents, the following rules are mandatory.

### Rule 1

Never generate the entire application in one prompt.

### Rule 2

Implement one feature at a time.

### Rule 3

Read existing code before modifying it.

### Rule 4

Do not rewrite working architecture unnecessarily.

### Rule 5

Keep business logic separate from UI.

### Rule 6

Use TypeScript strictly.

### Rule 7

Avoid unnecessary dependencies.

### Rule 8

Every major feature must have a clear type definition.

### Rule 9

Every important business rule must have tests.

### Rule 10

Never change the Rolling Split behavior without explicitly updating the product specification.

---

# 49. AI CODING AGENT RULES

The coding agent must:

1. Inspect the repository before making changes.
2. Follow existing architecture.
3. Reuse existing components.
4. Avoid duplicate components.
5. Avoid unnecessary packages.
6. Explain major architectural changes.
7. Run type checking after modifications.
8. Run linting where available.
9. Run tests for business logic.
10. Never remove functionality without explicit approval.

---

# 50. COMPONENT RULES

Components should be small and reusable.

Bad:

```text
HugeWorkoutScreen.tsx
```

Good:

```text
WorkoutHeader
ExerciseCard
PreviousPerformance
SetRow
RestTimer
WorkoutFooter
```

---

# 51. BUSINESS LOGIC RULE

Do not put business logic inside JSX.

Bad:

```text
UI component determines
whether split should advance.
```

Good:

```text
Workout completion
        ↓
Workout Engine
        ↓
Split Engine
        ↓
State update
        ↓
UI refresh
```

---

# 52. DATA FLOW

Normal read:

```text
UI
 ↓
Store
 ↓
Repository
 ↓
Local SQLite
```

Cloud sync:

```text
Local SQLite
 ↓
Sync Queue
 ↓
Firebase
```

Cloud-to-device:

```text
Firebase
 ↓
Sync Service
 ↓
SQLite
 ↓
Zustand
 ↓
UI
```

---

# 53. ACTIVE WORKOUT DATA FLOW

```text
User enters weight/reps
          ↓
Workout Store
          ↓
Workout Domain Logic
          ↓
SQLite
          ↓
UI updates immediately
          ↓
Sync Queue
          ↓
Firebase
```

The UI should never wait for Firebase.

---

# 54. APPLICATION STARTUP

On startup:

```text
Launch App
   ↓
Load authentication
   ↓
Load local database
   ↓
Load user state
   ↓
Load active split
   ↓
Check unfinished workout
   ↓
Check connectivity
   ↓
Start synchronization if required
   ↓
Render Home
```

---

# 55. ACTIVE WORKOUT RECOVERY

If an unfinished workout exists:

```text
App Launch
   ↓
Detect IN_PROGRESS workout
   ↓
Show Resume Workout
```

User options:

Continue Workout

or

Discard Workout

---

# 56. DATE HANDLING

All workout dates must be stored consistently.

Store timestamps in UTC where appropriate.

Display dates using the user's local timezone.

The date must never determine the split position.

---

# 57. TIME HANDLING

Workout duration should be based on timestamps rather than counting rendered UI frames.

Example:

```text
startedAt
completedAt
```

Duration:

```text
completedAt - startedAt
```

This prevents incorrect durations when the application is backgrounded.

---

# 58. WEIGHT UNITS

Internally, the application should have a consistent storage representation.

The UI may display:

* kg
* lb

Conversion should happen through a centralized utility.

Location:

```text
src/utils/units.ts
```

---

# 59. PERFORMANCE REQUIREMENTS

The active workout screen should:

* Render quickly
* Avoid unnecessary re-renders
* Update set values instantly
* Maintain smooth scrolling
* Keep timers responsive

Use memoization where useful, but do not prematurely optimize.

---

# 60. ACCESSIBILITY

The architecture must support:

* Dynamic text sizes
* Screen readers
* Large touch targets
* High contrast
* Semantic labels
* Reduced motion where appropriate

---

# 61. TESTING STRATEGY

Testing priority:

### Highest

Rolling Split Engine

### High

Workout completion

Set logging

Local persistence

Synchronization

### Medium

Progress calculations

PR detection

### Lower

Purely visual components

---

# 62. UNIT TESTS

At minimum, test:

```text
Split advances after completion
Split does not advance on missed day
Split advances after manual skip
Split wraps around
Double completion does not advance twice
Workout persists after app restart
Volume calculation
PR detection
```

---

# 63. INTEGRATION TESTS

Test:

```text
Start workout
 ↓
Log set
 ↓
Close app
 ↓
Reopen
 ↓
Continue
 ↓
Finish
 ↓
Split advances
```

Also:

```text
Offline
 ↓
Log workout
 ↓
Reconnect
 ↓
Sync
```

---

# 64. BUILD STRATEGY

Development should happen in stages.

### Phase 1

Project setup

### Phase 2

Navigation

### Phase 3

Authentication

### Phase 4

Local database

### Phase 5

Split engine

### Phase 6

Workout builder

### Phase 7

Active workout

### Phase 8

Workout history

### Phase 9

Firebase synchronization

### Phase 10

Progress analytics

### Phase 11

Polish

### Phase 12

Testing

### Phase 13

Release

---

# 65. DEPENDENCY PRINCIPLE

Do not add a package simply because an AI agent suggests it.

Before adding a dependency:

1. Determine whether Expo/React Native already supports the requirement.
2. Determine whether an existing installed package can handle it.
3. Evaluate whether the dependency is maintained.
4. Determine whether it increases complexity.
5. Add it only if necessary.

---

# 66. MVP ARCHITECTURAL PRIORITY

The architecture should prioritize:

1. Reliability
2. Offline functionality
3. Fast workout logging
4. Correct split progression
5. Data integrity
6. Simple UI integration
7. Maintainability
8. Future scalability

---

# 67. ARCHITECTURAL DECISIONS

The following decisions are considered locked for MVP:

### Mobile

React Native + Expo

### Language

TypeScript

### Navigation

Expo Router

### State

Zustand

### Local Database

Expo SQLite

### Cloud

Firebase

### Cloud Database

Firestore

### Authentication

Firebase Auth

### Styling

NativeWind

### Validation

Zod

### Forms

React Hook Form

### Notifications

Expo Notifications

### Charts

react-native-gifted-charts

---

# 68. IMPORTANT ARCHITECTURAL RULE

The following separation must always remain:

```text
CALENDAR
     ≠
WORKOUT SPLIT
```

Calendar:

Stores when workouts occurred.

Split Engine:

Determines what workout comes next.

Workout Engine:

Determines whether a workout is completed.

These three concepts must remain separate.

---

# 69. FINAL ARCHITECTURE

```text
                         REPSHADE
                            │
                            ▼
                   React Native + Expo
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
          Expo Router    Components      Native UI
                            │
                            ▼
                         Zustand
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
        Workout Engine   Split Engine   Progress Engine
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                       Repository Layer
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
             SQLite                 Sync Queue
                 │                     │
                 │                     ▼
                 │                  Firebase
                 │                     │
                 │              ┌──────┼──────┐
                 │              ▼      ▼      ▼
                 │             Auth Firestore Storage
                 │
                 └──────── Local-first ────────
```

---

# 70. FINAL TECHNICAL PRINCIPLE

Repshade must be built around this rule:

> THE WORKOUT EXPERIENCE MUST WORK WITHOUT THE CLOUD.

Firebase provides persistence, synchronization, and backup.

The local application provides the actual workout experience.

The Rolling Split Engine determines what comes next.

The calendar records when the user trained.

These responsibilities must remain separate.

