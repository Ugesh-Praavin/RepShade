# Repshade Engineering Implementation Specification

## 1. Purpose

This document converts the Repshade product, UX, UI and architecture decisions into an implementation-ready engineering specification.

It is intended to be used by:

* The developer
* Antigravity
* AI coding agents
* React Native / Expo implementation
* Firebase implementation
* Testing and debugging

The goal is to prevent the implementation phase from becoming a collection of disconnected screens.

The application must be built as one coherent system.

---

# 2. Technology Stack

## Mobile

```text
React Native
Expo
TypeScript
Expo Router
```

## Styling

```text
NativeWind
```

## State

```text
Zustand
```

## Forms / Validation

```text
React Hook Form
Zod
```

## Local Database

```text
Expo SQLite
```

## Backend

```text
Firebase Authentication
Cloud Firestore
Firebase Storage
```

## Notifications

```text
Expo Notifications
```

## Charts

```text
react-native-gifted-charts
```

## Icons

```text
Lucide React Native
```

## Utilities

```text
date-fns
```

## Development

```text
VS Code
Git
GitHub
AI coding agent
Expo
```

---

# 3. Engineering Principles

The implementation must follow these principles:

1. Local-first.
2. Offline workout logging must work.
3. Firebase must never be required to start or finish a workout.
4. Business logic must not live inside UI components.
5. The Rolling Split must have one authoritative domain implementation.
6. Historical workouts must not change because the workout template changes.
7. IDs must be generated client-side.
8. All important user actions must be idempotent.
9. TypeScript strictness should be enabled.
10. Validation should happen at boundaries.
11. UI components should remain reusable.
12. Firebase access should happen through repositories/services.
13. Never duplicate business rules across screens.
14. Never use the calendar to determine the next split workout.
15. Every workout action must preserve data integrity.

---

# 4. Project Initialization

Create the project using Expo with TypeScript.

Recommended project structure:

```text id="7y0d3k"
repshade/
│
├── app/
│   ├── _layout.tsx
│   │
│   ├── index.tsx
│   │
│   ├── auth/
│   │   ├── welcome.tsx
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── forgot-password.tsx
│   │
│   ├── onboarding/
│   │   ├── index.tsx
│   │   ├── split.tsx
│   │   ├── custom-split.tsx
│   │   ├── reorder.tsx
│   │   ├── workout.tsx
│   │   ├── exercises.tsx
│   │   └── complete.tsx
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
│   │   ├── active.tsx
│   │   ├── pause.tsx
│   │   ├── summary.tsx
│   │   └── recovery.tsx
│   │
│   ├── exercise/
│   │   ├── library.tsx
│   │   ├── search.tsx
│   │   ├── create.tsx
│   │   ├── details.tsx
│   │   └── history.tsx
│   │
│   ├── progress/
│   │   ├── exercise.tsx
│   │   └── prs.tsx
│   │
│   ├── history/
│   │   ├── calendar.tsx
│   │   └── workout.tsx
│   │
│   └── settings/
│       ├── index.tsx
│       ├── units.tsx
│       ├── appearance.tsx
│       ├── notifications.tsx
│       ├── account.tsx
│       └── data.tsx
│
├── src/
│   ├── components/
│   ├── features/
│   ├── stores/
│   ├── services/
│   ├── repositories/
│   ├── domain/
│   ├── database/
│   ├── types/
│   ├── constants/
│   ├── utils/
│   └── hooks/
│
├── firebase/
│   ├── config.ts
│   ├── auth.ts
│   ├── firestore.ts
│   └── storage.ts
│
├── assets/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

---

# 5. Route Architecture

Expo Router should control navigation.

Do not manually implement a large custom navigation system.

## Root Route

The root route determines:

```text id="d07d9h"
Loading
↓
Authenticated?
├── No → Auth
└── Yes
     ↓
Onboarding complete?
├── No → Onboarding
└── Yes → Main App
```

---

# 6. Authentication State

Create:

```text id="3gb8i9"
authStore
```

Responsibilities:

* Current Firebase user
* Authentication status
* Loading state
* Sign in
* Sign out
* Sign up
* Password reset

The UI should not directly call Firebase Authentication.

---

# 7. Zustand Stores

Initial stores:

```text id="1p4jhf"
authStore
workoutStore
splitStore
settingsStore
syncStore
```

Optional later:

```text id="x3z2v7"
progressStore
historyStore
exerciseStore
```

Do not create a Zustand store for every component.

---

# 8. Auth Store

Conceptual state:

```text id="0g1q0f"
user
isAuthenticated
isLoading
error
```

Actions:

```text id="e7wz4h"
signIn()
signUp()
signOut()
resetPassword()
initializeAuth()
```

---

# 9. Workout Store

The workout store manages the currently active workout.

State:

```text id="y4i3bc"
activeWorkout
isWorkoutActive
elapsedSeconds
currentExerciseIndex
isPaused
isSaving
error
```

Actions:

```text id="ryz09p"
startWorkout()
addSet()
updateSet()
completeSet()
deleteSet()
addExercise()
removeExercise()
pauseWorkout()
resumeWorkout()
finishWorkout()
abandonWorkout()
restoreWorkout()
```

The store should delegate business decisions to domain services.

---

# 10. Split Store

State:

```text id="dgr3x4"
activeSplit
currentWorkoutIndex
```

Actions:

```text id="5hyf6t"
createSplit()
updateSplit()
reorderWorkouts()
advanceSplit()
skipCurrentWorkout()
resetSplit()
```

The split store must not independently calculate split behavior.

It should use:

```text
splitEngine
```

---

# 11. Settings Store

State:

```text id="8ykr9s"
weightUnit
theme
defaultRestSeconds
notificationsEnabled
restTimerEnabled
```

Actions:

```text id="qf4e8h"
updateSettings()
setWeightUnit()
setTheme()
setRestPreference()
```

---

# 12. Sync Store

State:

```text id="h3h9e2"
isOnline
isSyncing
pendingOperations
lastSyncedAt
syncError
```

Actions:

```text id="2x1m8u"
sync()
retrySync()
processQueue()
```

The sync store must not contain workout business logic.

---

# 13. Domain Layer

Create domain modules:

```text id="kwm31u"
src/domain/
├── split/
│   ├── splitEngine.ts
│   └── splitRules.ts
│
├── workout/
│   ├── workoutEngine.ts
│   ├── workoutRules.ts
│   └── workoutStateMachine.ts
│
├── progression/
│   ├── progressionEngine.ts
│   └── overloadRules.ts
│
└── records/
    ├── recordEngine.ts
    └── prRules.ts
```

These modules contain the important application rules.

---

# 14. Rolling Split Engine

Create one authoritative function:

```text id="cm13jv"
getNextWorkout(split)
```

It should return the workout represented by:

```text
split.currentWorkoutIndex
```

After completion:

```text id="g8m0qz"
advanceWorkoutIndex(split)
```

Pseudo-rule:

```text id="2w8q9u"
nextIndex =
(currentIndex + 1) % workoutCount
```

---

# 15. Rolling Split Rules

## Completion

If workout completes:

```text id="v5c0cy"
currentIndex → currentIndex + 1
```

## Manual Skip

If user explicitly skips:

```text id="g4q5q0"
currentIndex → currentIndex + 1
```

## Missed Day

If user does nothing:

```text id="f4s8i6"
currentIndex → unchanged
```

## App Closed

```text id="m4a4x6"
currentIndex → unchanged
```

## Internet Lost

```text id="9b1t9a"
currentIndex → unchanged
```

---

# 16. Critical Split Example

Given:

```text id="u9h2f8"
Push → Pull → Legs
```

Initial:

```text id="9kz5x3"
currentWorkoutIndex = 0
```

Monday:

```text id="0u8j3f"
Complete Push
```

Index becomes:

```text id="b2j4e6"
1
```

Tuesday:

```text id="9h7z2w"
No workout
```

Index remains:

```text id="b2j4e6"
1
```

Wednesday:

```text id="f4k3v8"
No workout
```

Index remains:

```text id="b2j4e6"
1
```

Thursday Home:

```text id="v5t0k4"
NEXT WORKOUT
Pull
```

This behavior is non-negotiable.

---

# 17. Workout State Machine

Active workout states:

```text id="4b8z0w"
IDLE
↓
ACTIVE
↓
PAUSED
↓
ACTIVE
↓
COMPLETING
↓
COMPLETED
```

Abandonment:

```text id="2d4f8y"
ACTIVE
↓
ABANDONED
```

Recovery:

```text id="6s0f3k"
APP CLOSED
↓
ACTIVE SESSION FOUND
↓
RECOVER
```

---

# 18. Valid State Transitions

```text id="s8g0r1"
IDLE → ACTIVE

ACTIVE → PAUSED
ACTIVE → COMPLETING
ACTIVE → ABANDONED

PAUSED → ACTIVE
PAUSED → ABANDONED

COMPLETING → COMPLETED
```

Invalid transitions must be rejected.

Example:

```text id="8f5h4k"
COMPLETED → ACTIVE
```

must not happen automatically.

---

# 19. Starting a Workout

When user taps Start Workout:

1. Determine current split workout.
2. Create workout session ID.
3. Snapshot workout template.
4. Create local session.
5. Set status to ACTIVE.
6. Persist immediately.
7. Navigate to Active Workout.
8. Queue sync operation.

Do not wait for Firebase.

---

# 20. Workout Template Snapshot

When a workout starts, copy the relevant template information into the workout session.

This protects historical data.

Example:

User has:

```text id="p3o6p7"
Push
Bench Press
Incline Press
Lateral Raise
```

They complete a workout.

Later they remove Incline Press from the template.

The historical workout must still contain:

```text id="1s9b8d"
Bench Press
Incline Press
Lateral Raise
```

Historical records must not be retroactively changed.

---

# 21. Adding a Set

When the user adds a set:

```text id="4d1z3e"
UI
↓
workoutStore.addSet()
↓
workoutEngine
↓
validate set
↓
SQLite transaction
↓
update local state
↓
queue sync
```

The UI should immediately reflect the change.

---

# 22. Set Validation

Validate:

### Weight

* Numeric
* Non-negative
* Reasonable precision

### Reps

* Integer
* Greater than or equal to 0

### RPE

If used:

```text id="8k2x6g"
0–10
```

### RIR

If used:

```text id="g4j1r6"
0–10
```

Invalid data must not enter the database.

---

# 23. Completing a Set

When user completes a set:

1. Validate values.
2. Mark set complete.
3. Save locally.
4. Update workout state.
5. Calculate any required local metrics.
6. Trigger rest timer if enabled.
7. Queue sync.
8. Provide visual/haptic feedback.

The operation must feel instantaneous.

---

# 24. Editing a Completed Set

Completed sets should remain editable.

Example:

```text id="r4c0b8"
80 kg × 8
```

User realizes it was:

```text id="j2p8y6"
82.5 kg × 8
```

The set can be edited.

The update must overwrite the local record and create a sync operation.

---

# 25. Adding Exercises During Workout

If supported:

```text id="6u2k4e"
Active Workout
↓
Add Exercise
↓
Select Exercise
↓
Create Workout Exercise
↓
Continue Workout
```

The added exercise becomes part of that workout session.

It should not automatically modify the saved workout template.

---

# 26. Workout Completion Transaction

Workout completion is one of the most important operations.

Perform as an atomic logical operation:

```text id="v7j5n3"
1. Verify session is ACTIVE/eligible.
2. Mark session COMPLETED.
3. Calculate duration.
4. Save completed sets.
5. Calculate volume.
6. Calculate PRs.
7. Advance split exactly once.
8. Create sync operations.
9. Commit.
```

If the application crashes, it must be possible to safely retry without advancing the split twice.

---

# 27. Double Completion Protection

Every workout session must have a unique ID.

Before advancing the split:

```text id="r0x5w1"
if session.splitAdvanced === true
    do not advance again
```

After successful advancement:

```text id="1h7w3k"
session.splitAdvanced = true
```

This protects against:

* Double taps
* App restart
* Network retry
* Duplicate Firebase requests
* Sync retry

---

# 28. Manual Skip Implementation

Manual skip must:

1. Confirm user intent.
2. Advance split.
3. Record that a skip occurred if desired.
4. Not create a completed workout session.
5. Not appear as a workout in normal workout history.

Example:

```text id="4m5g9c"
PULL
↓
Skip
↓
currentWorkoutIndex = 2
↓
Next = LEGS
```

---

# 29. Missed Calendar Day

No database event is necessary simply because the user did not train.

Do NOT create:

```text id="7k3x1z"
missedWorkout
```

just because a day passed.

A missing calendar day is simply absence of a workout session.

---

# 30. Quick Workout

Quick Workout creates an independent session.

Default MVP behavior:

```text id="5z1j8q"
Quick Workout
↓
Workout recorded
↓
Split unchanged
```

It must not silently alter the user's planned split.

---

# 31. Rest Timer Architecture

Rest timer should be independent of Firebase.

State:

```text id="v9j2s5"
isRunning
remainingSeconds
startedAt
durationSeconds
```

Do not rely on repeated `setInterval` ticks as the source of truth.

Use timestamps.

Calculate:

```text id="q2d5x9"
remaining =
duration - (currentTime - startedAt)
```

This prevents timer drift when the app is backgrounded.

---

# 32. Workout Recovery

On application startup:

1. Query local database.
2. Find sessions with ACTIVE or PAUSED state.
3. If found, restore the latest valid session.
4. Display recovery UI.
5. Allow Resume or Discard.

Do not rely on Firebase to recover an active workout.

---

# 33. Local Database

SQLite should be the primary operational store on the device.

Tables:

```text id="6m8r0a"
users
settings
splits
workout_templates
workout_exercises
exercises
workout_sessions
workout_sets
personal_records
body_weight_entries
sync_operations
```

---

# 34. Repository Layer

Create repositories such as:

```text id="z5p4f7"
userRepository
settingsRepository
splitRepository
workoutRepository
exerciseRepository
progressRepository
historyRepository
recordRepository
syncRepository
```

Repositories abstract database implementation from business logic.

---

# 35. Repository Rule

Domain code should not contain raw SQL.

Bad:

```text id="7u6n2m"
component
→ SQL
```

Bad:

```text id="9h4v8k"
domain
→ Firebase SDK
```

Good:

```text id="6g2r1x"
UI
↓
Store
↓
Domain
↓
Repository
↓
SQLite / Firebase
```

---

# 36. Firebase Responsibilities

Firebase provides:

### Authentication

* Account creation
* Sign in
* Password reset
* Session management

### Firestore

* Cloud persistence
* Backup
* Cross-device synchronization

### Storage

Potential future use:

* Profile image
* User-generated attachments
* Export files

Firebase is not the primary source for active workout UI.

---

# 37. Sync Queue

Every cloud-relevant mutation should be represented by a sync operation.

Example:

```text id="w1g3p8"
operationId
entityType
entityId
operationType
payload
createdAt
attemptCount
status
```

Possible operation types:

```text id="m0q8d4"
CREATE
UPDATE
DELETE
```

---

# 38. Sync Flow

```text id="c7w3f1"
User Action
↓
SQLite transaction
↓
Sync Operation created
↓
UI updates immediately
↓
Network available?
├── No → remain pending
└── Yes
      ↓
   Firebase
      ↓
   Success
      ↓
   Mark synced
```

---

# 39. Sync Failure

If Firebase fails:

```text id="1s4m8x"
Keep local data.
Keep operation in queue.
Increment attempt count.
Retry later.
```

Do not delete local data because synchronization failed.

---

# 40. Retry Strategy

Use controlled retry.

Example:

```text id="5k0x4s"
Attempt 1 → immediate
Attempt 2 → short delay
Attempt 3 → longer delay
Later → background retry
```

Avoid infinite rapid retry loops.

---

# 41. Conflict Strategy

MVP conflict strategy:

### Program data

Latest intentional user edit wins.

### Workout sessions

Completed historical sessions are treated as immutable except for explicit correction.

### Active workout

Local active workout has priority over cloud recovery on the same device.

### Settings

Latest update wins.

The exact conflict system can evolve later.

---

# 42. Exercise Library

System exercises should be bundled locally.

Benefits:

* Fast search
* Offline availability
* No Firebase request required
* Predictable data

User-created exercises are stored locally and synced to Firebase.

---

# 43. Exercise IDs

System exercises:

```text id="v4b7n9"
Stable predefined IDs
```

Custom exercises:

```text id="r8m2c1"
Client-generated UUID
```

Never use exercise names as database IDs.

---

# 44. Historical Data Integrity

Historical workout records must be immutable by default.

A workout template changing should never modify:

* Past exercise names
* Past set counts
* Past weights
* Past reps
* Past duration
* Past volume

Historical correction should be explicit.

---

# 45. Progression Engine

Create:

```text id="c8p0h3"
progressionEngine
```

Its responsibility is to calculate useful progress information.

Potential metrics:

* Weight progression
* Rep progression
* Volume progression
* Estimated 1RM
* Exercise trend

Do not force automatic weight increases in MVP.

---

# 46. Progressive Overload

Repshade should initially provide **progressive overload visibility**, not aggressive automatic prescription.

Example:

```text id="q5m1w7"
Previous:
80 kg × 8

Current:
82.5 kg × 8

Progress:
+2.5 kg
```

The user remains in control.

---

# 47. Volume Calculation

For standard sets:

```text id="2j9f4c"
volume = weight × reps
```

Workout volume:

```text id="8x3m5a"
sum(all completed working-set volume)
```

The exact inclusion/exclusion of warm-up or special sets should be defined by the progression rules.

---

# 48. Personal Record Engine

Create:

```text id="9p4r6y"
recordEngine
```

Potential PR types:

```text id="x6w2k8"
Heaviest weight
Best reps at weight
Estimated 1RM
Highest volume
```

PR calculation should be deterministic.

---

# 49. PR Example

Previous:

```text id="8h3m2q"
80 kg × 8
```

Current:

```text id="4f7n1x"
82.5 kg × 8
```

Record engine evaluates the new performance.

If it qualifies:

```text id="j5c8v2"
NEW PR
```

---

# 50. Date and Time

Store timestamps in a consistent format.

Use absolute timestamps for:

* Workout start
* Workout end
* Set creation
* Sync operations
* PR creation

Use the user's local timezone for presentation.

Use `date-fns` for formatting and calculations.

---

# 51. Workout Duration

Duration should be calculated from timestamps rather than incrementing a counter as the only source of truth.

Example:

```text id="2k6w9n"
duration =
completedAt - startedAt
```

Paused time may be excluded depending on the finalized workout-duration definition.

---

# 52. Weight Storage

Choose one canonical internal representation.

Recommended:

```text id="4m0s8c"
Store kilograms internally.
```

Display:

```text id="7r3p1v"
kg
or
lb
```

according to user preference.

This prevents unit conversion inconsistencies.

---

# 53. Decimal Precision

Weights should support common gym increments.

Recommended storage precision:

```text id="6y8f3q"
0.01 kg
```

Display should avoid unnecessary decimals.

Examples:

```text id="0v4b8h"
80 kg
82.5 kg
82.25 kg
```

---

# 54. Form Validation

Zod schemas should exist for important entities.

Examples:

```text id="f2j8m4"
userSchema
splitSchema
workoutTemplateSchema
workoutSessionSchema
workoutSetSchema
exerciseSchema
settingsSchema
```

Validation should occur before persistence.

---

# 55. Error Handling

Use a consistent application error model.

Categories:

```text id="1f5m9s"
ValidationError
DatabaseError
NetworkError
AuthError
SyncError
NotFoundError
ConflictError
```

User-facing messages should be human-readable.

Technical details should go to development logs.

---

# 56. Logging

During development, logs should help diagnose:

* Workout state transitions
* Sync operations
* Database failures
* Authentication failures
* Split advancement
* Recovery

Do not log:

* Passwords
* Authentication tokens
* Sensitive personal data

---

# 57. Firebase Security

Firestore rules must ensure users can only access their own data.

Conceptually:

```text id="0v4x7k"
users/{userId}/...
```

Access allowed only when:

```text id="7j2s8q"
request.auth.uid == userId
```

Never rely solely on client-side security.

---

# 58. Environment Configuration

Never hard-code secrets in source code.

Use environment configuration for:

```text id="p7g3m2"
Firebase project configuration
API configuration
Environment flags
```

Public Firebase client configuration is not treated as a secret, but Firestore/Storage security rules remain mandatory.

---

# 59. UI Architecture

UI components should consume state through hooks/stores.

Example:

```text id="z8y2v4"
ActiveWorkoutScreen
      ↓
useWorkoutStore()
      ↓
Workout Domain
```

The screen should not contain:

* SQL
* Firestore calls
* Complex split calculations
* PR algorithms

---

# 60. Component Organization

Recommended:

```text id="3r5c8w"
src/components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── ...
│
├── workout/
│   ├── WorkoutCard.tsx
│   ├── ExerciseCard.tsx
│   ├── SetRow.tsx
│   ├── RestTimer.tsx
│   └── ...
│
├── progress/
│   ├── StatCard.tsx
│   ├── ProgressChart.tsx
│   └── PRBadge.tsx
│
└── navigation/
    └── TabBar.tsx
```

---

# 61. Styling

Use the Repshade design tokens.

Do not repeatedly write raw colors.

Preferred:

```text id="z8v6k0"
bg-background-primary
text-text-primary
border-border-subtle
```

rather than:

```text id="4g2k9v"
bg-[#0B0D0F]
```

throughout the codebase.

---

# 62. Theme Architecture

Theme tokens should support:

```text id="j5h7p0"
dark
light
system
```

Components must consume semantic tokens.

Do not create separate duplicated components for dark and light mode.

---

# 63. Loading Architecture

Prefer:

```text id="2b8x6m"
Local database
↓
Immediate UI
↓
Background sync
```

rather than:

```text id="7y1p4r"
Firebase
↓
Wait
↓
Render
```

---

# 64. App Startup

Startup sequence:

```text id="w8s3m1"
Launch
↓
Load theme
↓
Initialize SQLite
↓
Load auth
↓
Load local user data
↓
Check active workout
↓
Render app
↓
Start background sync
```

The user should see useful content as quickly as possible.

---

# 65. First Launch

First launch:

```text id="0r5f7c"
Launch
↓
Welcome
↓
Authentication
↓
Onboarding
↓
Create split
↓
Create workout templates
↓
Home
```

Onboarding data should be persisted as it is created.

---

# 66. Offline First Launch

If the user is offline:

* Core system UI should still work.
* Bundled exercise library remains available.
* Workout setup can continue.
* Local user configuration can be saved.
* Cloud synchronization waits until connectivity returns.

---

# 67. Connectivity Detection

Create a centralized connectivity service.

Responsibilities:

```text id="7h3x2q"
isOnline
networkType
connectionChanged
```

The rest of the application should consume connectivity state rather than independently checking the network.

---

# 68. Notifications

MVP notifications should be limited.

Potential:

```text id="6p4v8j"
Workout reminder
Rest timer completion
```

Avoid:

```text id="8n5y3r"
Missed workout reminders
Streak warnings
Guilt notifications
```

Notification scheduling should respect user settings.

---

# 69. Analytics

Analytics should focus on product quality.

Potential events:

```text id="w4c9m7"
app_opened
onboarding_completed
workout_started
set_completed
workout_completed
workout_abandoned
workout_skipped
pr_achieved
sync_failed
sync_completed
```

Do not collect unnecessary personal information.

---

# 70. Testing Strategy

Testing should happen at three levels.

## Unit

Test:

* Split engine
* Workout engine
* Progression engine
* PR engine
* Validation
* Volume calculation

## Integration

Test:

* Workout creation
* Set logging
* Completion
* Split advancement
* SQLite repository
* Sync queue

## UI

Test:

* Navigation
* Start workout
* Log set
* Finish workout
* Recovery
* Manual skip

---

# 71. Most Important Unit Tests

### Rolling Split

```text id="c8y1k4"
Push → Pull → Legs
```

Complete Push:

```text id="z4r8p6"
Next = Pull
```

Miss a day:

```text id="w6j3n2"
Next remains Pull
```

Skip Pull:

```text id="x7f0m5c"
Next = Legs
```

Complete Legs:

```text id="q2v8s1"
Next = Push
```

---

# 72. Completion Idempotency Test

Attempt:

```text id="m5x7j3"
finishWorkout()
finishWorkout()
```

Expected:

```text id="8q2v1b"
One completed session
One split advancement
```

Never:

```text id="4k7n9c"
Two split advancements
```

---

# 73. Offline Workout Test

Scenario:

```text id="8m4p6q"
Internet ON
↓
Start workout
↓
Internet OFF
↓
Log 10 sets
↓
Finish
↓
Internet ON
↓
Sync
```

Expected:

* No data loss
* One workout
* Correct sets
* Correct split advancement
* Successful cloud synchronization

---

# 74. App Crash Recovery Test

Scenario:

```text id="0c5r8y"
Start workout
↓
Log sets
↓
Force close app
↓
Reopen
```

Expected:

```text id="3j7p2w"
Workout Recovery screen
↓
Resume
↓
All sets still present
```

---

# 75. Template Mutation Test

Scenario:

```text id="6q1v8m"
Create Push template
↓
Complete workout
↓
Remove an exercise from template
↓
Open historical workout
```

Expected:

Historical workout remains unchanged.

---

# 76. Unit Conversion Test

Scenario:

```text id="9x4b2k"
Stored: 80 kg
Display: kg
```

Switch to pounds.

Expected display approximately:

```text id="5n8c1v"
176.4 lb
```

Switch back.

Expected:

```text id="0w7m3q"
80 kg
```

The canonical stored value remains stable.

---

# 77. Accessibility Testing

Verify:

* Screen reader labels
* Button names
* Touch target sizes
* Color contrast
* Keyboard behavior
* Dynamic font scaling
* Focus order

The active workout receives the highest priority.

---

# 78. Performance Testing

Test:

* App launch
* Large workout history
* Long exercise history
* Many completed workouts
* Large sync queue
* Rapid set logging

Avoid unnecessary network requests.

---

# 79. Security Testing

Verify:

* Users cannot access another user's Firestore data.
* Authentication is required for private data.
* Logout clears user-specific local state appropriately.
* No secrets are committed to Git.
* Sensitive information is not logged.

---

# 80. Git Strategy

Use:

```text id="7f2x5m"
main
```

for stable releases.

Feature branches:

```text id="1k9c4v"
feature/auth
feature/onboarding
feature/workout
feature/split-engine
feature/progress
feature/history
feature/sync
```

Commit frequently.

Recommended commit style:

```text id="9w3m7p"
feat: add rolling split engine
feat: add active workout logging
fix: prevent duplicate split advancement
feat: add offline sync queue
```

---

# 81. AI Coding Agent Rules

When using an AI coding agent:

### Rule 1

Read the existing architecture before changing code.

### Rule 2

Do not rewrite unrelated files.

### Rule 3

Do not introduce a new library without justification.

### Rule 4

Do not move business logic into screens.

### Rule 5

Do not bypass repositories.

### Rule 6

Do not modify the Rolling Split rules without explicit instruction.

### Rule 7

Do not replace SQLite with remote Firebase calls for convenience.

### Rule 8

Do not remove validation to make an error disappear.

### Rule 9

Do not duplicate components unnecessarily.

### Rule 10

Run tests/type checks after meaningful changes.

---

# 82. Antigravity Development Workflow

Antigravity should work incrementally.

Recommended sequence:

```text id="2g5r8m"
Phase 1
Project initialization

↓

Phase 2
Design system implementation

↓

Phase 3
Navigation

↓

Phase 4
Authentication

↓

Phase 5
Local database

↓

Phase 6
Exercise library

↓

Phase 7
Split engine

↓

Phase 8
Workout engine

↓

Phase 9
Active Workout UI

↓

Phase 10
Workout completion

↓

Phase 11
History

↓

Phase 12
Progress

↓

Phase 13
Firebase

↓

Phase 14
Sync

↓

Phase 15
Settings

↓

Phase 16
Testing

↓

Phase 17
Polish

↓

Phase 18
Build
```

Do not attempt all phases in one AI coding prompt.

---

# 83. Recommended Implementation Order

The highest-value implementation order is:

## Step 1

Project setup.

## Step 2

Design tokens and reusable components.

## Step 3

Navigation.

## Step 4

SQLite database.

## Step 5

Exercise library.

## Step 6

Split creation.

## Step 7

Rolling Split engine.

## Step 8

Workout templates.

## Step 9

Active Workout.

## Step 10

Set logging.

## Step 11

Workout completion.

## Step 12

History.

## Step 13

Progress.

## Step 14

Authentication.

## Step 15

Firebase sync.

## Step 16

Notifications.

## Step 17

Final polish.

---

# 84. MVP Development Definition

MVP is complete when a user can:

```text id="8f1x5c"
Create account
↓
Choose PPL
↓
Create/configure workouts
↓
See next workout
↓
Start workout
↓
See previous performance
↓
Log sets
↓
Use rest timer
↓
Finish workout
↓
Split advances
↓
Close app
↓
Return later
↓
View history
↓
View progress
```

And the entire workout flow works without internet.

---

# 85. Firebase Phase Definition

Firebase integration is complete when:

* Authentication works.
* User data syncs.
* Splits sync.
* Workout templates sync.
* Completed workouts sync.
* Sets sync.
* PRs sync.
* Settings sync.
* Offline mutations eventually synchronize.
* Duplicate operations are safely handled.
* Firestore security rules prevent cross-user access.

---

# 86. Production Readiness Checklist

Before release:

## Product

* [ ] Rolling Split verified
* [ ] Manual Skip verified
* [ ] Missed days verified
* [ ] Quick Workout behavior verified

## Workout

* [ ] Set logging verified
* [ ] Previous performance verified
* [ ] Rest timer verified
* [ ] Pause verified
* [ ] Recovery verified
* [ ] Completion verified
* [ ] Abandonment verified

## Data

* [ ] SQLite verified
* [ ] Sync queue verified
* [ ] Firebase verified
* [ ] Conflict handling verified
* [ ] Historical immutability verified

## UI

* [ ] Dark theme
* [ ] Light theme
* [ ] Accessibility
* [ ] Empty states
* [ ] Error states
* [ ] Offline states
* [ ] Loading states

## Security

* [ ] Firestore rules
* [ ] Authentication
* [ ] No secrets in repository
* [ ] No sensitive logging

## Performance

* [ ] Fast startup
* [ ] Fast set logging
* [ ] Large history tested
* [ ] Sync tested

---

# 87. Final Engineering Architecture

The final implementation should follow:

```text id="z0y7v4"
                    REPSHADE
                       │
                       ▼
                React Native UI
                       │
                       ▼
                 Zustand Stores
                       │
                       ▼
                Domain Engines
              ┌────────┼────────┐
              │        │        │
           Split    Workout   Progress
           Engine    Engine    Engine
              │        │        │
              └────────┼────────┘
                       │
                       ▼
                  Repositories
                       │
                ┌──────┴──────┐
                │             │
             SQLite       Sync Queue
                │             │
                │             ▼
                │          Firebase
                │
                ▼
          Local-first UI
```

---

# 88. Non-Negotiable Architecture Rule

The most important implementation rule is:

> **Firebase is the cloud layer, not the workout engine.**

The workout engine must work without Firebase.

The user must be able to:

* Start
* Log
* Pause
* Resume
* Finish

without waiting for a network request.

---

# 89. Non-Negotiable Product Rule

The most important product rule is:

> **Only completed or intentionally skipped workouts advance the split.**

Never implement:

```text id="4f7y2m"
currentWorkout = workoutForToday
```

Instead implement:

```text id="7x2k9p"
currentWorkout = split.currentWorkoutIndex
```

This distinction is the core of Repshade.

---

# 90. Final Implementation Philosophy

Build Repshade in layers.

Do not start with Firebase.

Do not start with analytics.

Do not start with notifications.

Do not start with complicated progress algorithms.

Start with the core loop:

```text id="p9v5c2"
NEXT WORKOUT
↓
START
↓
LOG SET
↓
REST
↓
LOG SET
↓
FINISH
↓
SPLIT ADVANCES
↓
NEXT WORKOUT
```

Make this experience excellent first.

Then build everything around it.

---

# 91. Engineering North Star

When deciding between two implementation approaches, choose the approach that:

* Is simpler
* Is easier to test
* Works offline
* Preserves data
* Keeps business logic centralized
* Minimizes dependencies
* Produces predictable behavior
* Is easy for another developer or AI agent to understand

The goal is not to build the most sophisticated architecture.

The goal is to build a **small, reliable, understandable training application** that can grow without becoming fragile.

---

# 92. Final Statement

Repshade's engineering architecture exists to support one simple experience:

> **Open the app, know what comes next, train, log everything, finish, and come back stronger.**
