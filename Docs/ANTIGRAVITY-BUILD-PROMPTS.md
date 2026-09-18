# Repshade Antigravity Build Prompts

## 1. Purpose

This document contains the **copy-paste-ready prompts** to give Antigravity / an AI coding agent to actually build Repshade.

These prompts are intentionally incremental.

Do not give the agent the entire application in one prompt.

Each phase should:

1. Read the existing project.
2. Implement only the requested scope.
3. Preserve existing functionality.
4. Run type checks/tests.
5. Report what changed.
6. Stop before moving to the next phase.

---

# 2. Global Instruction

Use this instruction as the persistent context for the coding agent.

```text id="6l2bq3"
You are building Repshade, a mobile workout tracking application.

Read the project files and existing implementation before making changes.

Follow the Repshade product and engineering specifications exactly.

PRODUCT MANTRA:

TRAIN. LOG. PROGRESS. REPEAT.

CORE PRODUCT RULE:

"The calendar tells you when you trained. Your split tells you what you train next."

Repshade uses a Rolling Split.

Example:

Push → Pull → Legs

If Push is completed Monday and the user does not train Tuesday or Wednesday, Thursday still shows Pull.

Missed calendar days NEVER advance the split.

Only these actions advance the split:

1. Completing a workout.
2. Manually skipping a workout.

Never calculate the next workout from the current calendar date.

ARCHITECTURE:

React Native + Expo
TypeScript
Expo Router
NativeWind
Zustand
React Hook Form
Zod
Expo SQLite
Firebase Authentication
Cloud Firestore
Firebase Storage
Expo Notifications
react-native-gifted-charts
Lucide React Native
date-fns

ARCHITECTURE FLOW:

UI
↓
Zustand
↓
Domain
↓
Repository
↓
SQLite
↓
Sync Queue
↓
Firebase

LOCAL-FIRST REQUIREMENT:

The active workout must work without internet.

The user must be able to:

- Start a workout
- Log sets
- Edit sets
- Pause
- Resume
- Finish

while offline.

Firebase must never be required for these actions.

IMPORTANT:

Do not place SQL or Firebase calls directly inside UI components.

Do not put business logic inside screen components.

Do not duplicate Rolling Split logic.

Do not introduce unnecessary dependencies.

Do not modify unrelated code.

Use TypeScript strict typing.

Run type checks and relevant tests after meaningful changes.

If a requirement is ambiguous, inspect the existing specifications and implementation before inventing behavior.
```

---

# 3. Prompt 01 — Inspect and Plan

Use this as the first Antigravity prompt.

```text id="w0q7mp"
You are starting implementation of Repshade.

Do not write application code yet.

First inspect the entire existing repository.

Identify:

1. Current project structure.
2. Existing dependencies.
3. Expo configuration.
4. TypeScript configuration.
5. Navigation setup.
6. Existing screens.
7. Existing components.
8. Existing state management.
9. Existing Firebase configuration.
10. Existing database implementation.
11. Existing tests.
12. Existing environment configuration.

Compare the repository against the Repshade architecture specification.

Create an implementation plan identifying:

- What already exists.
- What is missing.
- What should be reused.
- What should be replaced.
- What should not be touched.

Do not make destructive changes.

Do not install dependencies yet unless absolutely necessary.

At the end, provide a concise implementation plan and wait for the next instruction.
```

---

# 4. Prompt 02 — Initialize Project Architecture

```text id="2g5n8v"
Implement the foundational Repshade project architecture.

Requirements:

- React Native
- Expo
- TypeScript strict mode
- Expo Router
- NativeWind
- ESLint
- Formatting
- Clean folder structure

Create:

app/
src/
firebase/
tests/

Use this structure:

app/
├── _layout.tsx
├── index.tsx
├── auth/
├── onboarding/
├── (tabs)/
├── workout/
├── exercise/
├── progress/
└── settings/

src/
├── components/
├── features/
├── stores/
├── services/
├── repositories/
├── domain/
├── database/
├── types/
├── constants/
├── utils/
└── hooks/

firebase/

tests/

Do not implement business functionality yet.

Create only the architecture and minimal placeholder routes necessary to verify navigation.

Run:

- TypeScript check
- Lint
- Expo validation if available

Fix all errors before finishing.
```

---

# 5. Prompt 03 — Implement Design Tokens

```text id="v8m2r6"
Implement the Repshade design system.

Create centralized design tokens for:

Colors
Typography
Spacing
Radius
Borders
Elevation

Dark theme:

background.primary = #0B0D0F
background.secondary = #121519
background.tertiary = #191D21
background.elevated = #20252A

text.primary = #F5F7F8
text.secondary = #A8B0B7
text.tertiary = #707980

border.subtle = #242A2F
border.default = #30373D

accent.primary = #B8F34A
accent.primaryPressed = #A4DD3F

success = #6FD08C
warning = #F2C94C
error = #FF6B6B
info = #6EA8FE

Spacing:

4
8
12
16
24
32
40
48
64

Radius:

6
8
12
16
20
999

Implement light theme support as well.

Do not hard-code colors throughout components.

Create reusable theme access patterns.

Verify dark and light themes render correctly.
```

---

# 6. Prompt 04 — Build Core UI Components

```text id="q7y1m3"
Build the foundational reusable Repshade UI components.

Create:

AppButton
IconButton
TextButton
AppText
Screen
ScreenHeader
Card
SectionHeader
Divider
Chip
Input
NumericInput
BottomSheet
Modal
ConfirmDialog
EmptyState
ErrorState
OfflineBanner
SyncIndicator
StatCard
ProgressBar

Requirements:

- Follow Repshade design tokens.
- Support dark and light themes.
- Minimum 44x44 touch targets.
- Accessible labels.
- Clear pressed/focused/disabled states.
- No unnecessary animations.
- Consistent typography.
- Consistent spacing.
- No business logic.

Do not build workout-specific logic yet.

After implementation, create a small internal component showcase route for development verification if useful.
```

---

# 7. Prompt 05 — Implement Navigation

```text id="j5x8c2"
Implement Repshade navigation using Expo Router.

Primary tabs:

Home
Plan
Progress
History
Profile

Create routes for:

Authentication
Onboarding
Tabs
Workout
Exercise
Progress
Settings

The root route must determine:

Loading
→ Authentication
→ Onboarding
→ Main App

Create placeholder screens where functionality is not yet implemented.

Active Workout must have a dedicated full-screen route and should not be treated as a normal tab.

Do not implement workout logic yet.

Verify:

- Tab navigation
- Back navigation
- Deep route navigation
- Auth/onboarding routing structure
```

---

# 8. Prompt 06 — Implement SQLite

```text id="c4p9w7"
Implement the Repshade local SQLite database.

Use Expo SQLite.

Create migrations for:

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

Create:

database initialization
migration runner
transaction helpers
typed repository interfaces

Requirements:

- Safe migrations
- Foreign keys where appropriate
- Useful indexes
- Parameterized queries
- No raw SQL inside UI
- No database calls inside React components

Create repository modules:

userRepository
settingsRepository
splitRepository
workoutRepository
exerciseRepository
progressRepository
historyRepository
recordRepository
syncRepository

Do not implement Firebase synchronization yet.

Add tests for database initialization and basic CRUD.
```

---

# 9. Prompt 07 — Exercise Library

```text id="r6k2v9"
Implement the Repshade exercise library.

System exercises must be bundled locally and available offline.

Exercise fields:

id
name
primaryMuscle
secondaryMuscles
equipment
isCustom
createdAt
updatedAt

Create:

- Exercise list
- Search
- Muscle grouping
- Equipment information
- Custom exercise creation
- Exercise details

System exercises must have stable IDs.

Custom exercises must use client-generated UUIDs.

Create a useful initial exercise dataset covering:

Chest
Back
Shoulders
Biceps
Triceps
Quadriceps
Hamstrings
Glutes
Calves
Core

Include common exercises such as:

Bench Press
Incline Bench Press
Incline Dumbbell Press
Dumbbell Fly
Lat Pulldown
Barbell Row
Seated Cable Row
Face Pull
Barbell Squat
Leg Press
Romanian Deadlift
Leg Curl
Calf Raise
Shoulder Press
Lateral Raise
Bicep Curl
Hammer Curl
Tricep Pushdown

Keep the library easy to extend later.

Test offline search.
```

---

# 10. Prompt 08 — Authentication

```text id="m3f7q1"
Implement Firebase Authentication for Repshade.

Support:

- Sign Up
- Sign In
- Sign Out
- Password Reset
- Auth persistence

Create authStore.

State:

user
isAuthenticated
isLoading
error

Actions:

initializeAuth
signIn
signUp
signOut
resetPassword

Do not put Firebase Authentication calls directly in screens.

Create a clean authentication service.

Connect root routing to authentication state.

Show loading state while auth initializes.

Do not build social login unless explicitly required.
```

---

# 11. Prompt 09 — Onboarding

```text id="x8c5n2"
Implement Repshade onboarding.

Flow:

Welcome
↓
Authentication
↓
Setup Introduction
↓
Choose Split
↓
Create/Configure Workouts
↓
Add Exercises
↓
Complete
↓
Home

Predefined split options:

Push / Pull / Legs
Upper / Lower
Full Body
Custom

Users must be able to:

- Select a split.
- Rename workouts.
- Add workouts.
- Delete workouts.
- Reorder workouts.
- Add exercises.
- Configure target sets.
- Configure rep ranges.
- Configure rest.

Persist onboarding progress locally.

Do not depend on Firebase for onboarding persistence.

Do not allow onboarding to silently create duplicate splits if the user restarts.
```

---

# 12. Prompt 10 — Rolling Split Engine

```text id="k1p6v8"
Implement the Repshade Rolling Split domain engine.

This is the most important business logic in the application.

Create:

src/domain/split/splitEngine.ts

Functions:

getNextWorkout(split)
advanceWorkout(split)
skipWorkout(split)
resetSplit(split)

Core rule:

The next workout is determined by currentWorkoutIndex.

Example:

Push → Pull → Legs

currentWorkoutIndex = 0
Next = Push

After completing Push:

currentWorkoutIndex = 1
Next = Pull

If the user does not train for any number of calendar days:

currentWorkoutIndex remains unchanged.

If the user manually skips Pull:

currentWorkoutIndex = 2
Next = Legs

Never use calendar date to calculate the next split workout.

Implement pure deterministic functions where possible.

Add unit tests for:

- Initial position
- Completion
- Multiple completions
- Missed days
- Manual skip
- Wraparound
- Single-workout split
- Empty split validation
```

---

# 13. Prompt 11 — Split Store

```text id="n7c4m1"
Connect the Rolling Split engine to splitStore.

The store must:

- Load the current split.
- Expose the next workout.
- Advance the split.
- Skip the current workout.
- Reset the split.
- Persist changes locally.

The store must delegate business rules to splitEngine.

Do not duplicate split calculations inside the store.

Add tests verifying:

complete Push → Pull
skip Pull → Legs
missed days → unchanged position
```

---

# 14. Prompt 12 — Workout Templates

```text id="z3p8w5"
Implement workout template management.

Workout Template:

id
splitId
name
description
order
createdAt
updatedAt

Workout Exercise:

id
workoutTemplateId
exerciseId
order
targetSets
targetRepMin
targetRepMax
restSeconds
setType
notes

Implement:

- Create workout
- Edit workout
- Delete workout
- Reorder workouts
- Add exercise
- Remove exercise
- Reorder exercises
- Configure exercise
- Configure sets
- Configure rep ranges
- Configure rest

Editing a workout template must never modify historical completed workouts.

Use local SQLite first.
```

---

# 15. Prompt 13 — Workout Engine

```text id="h6r2m9"
Implement the Repshade workout domain engine.

Create:

src/domain/workout/workoutEngine.ts

Responsibilities:

- Start workout
- Add exercise
- Add set
- Update set
- Complete set
- Pause
- Resume
- Finish
- Abandon
- Recover

Workout session states:

active
paused
completed
abandoned

Implement state transition validation.

Invalid transitions must be rejected.

Do not put this logic in React components.

Create unit tests for all valid and invalid transitions.
```

---

# 16. Prompt 14 — Start Workout

```text id="b8m5x3"
Implement starting a normal split workout.

Flow:

Home/Plan
↓
Start Workout
↓
Read current split position
↓
Resolve workout template
↓
Create workout session locally
↓
Snapshot workout template
↓
Create workout exercises
↓
Create initial sets where appropriate
↓
Persist SQLite transaction
↓
Update workoutStore
↓
Navigate to Active Workout

The entire operation must work offline.

Do not wait for Firebase.

The workout session must contain snapshot data so future template changes do not affect historical records.
```

---

# 17. Prompt 15 — Active Workout UI

```text id="p4n7y2"
Build the Repshade Active Workout screen.

This is the highest-priority screen in the application.

Design for real gym usage.

Header:

Back
Workout name
Elapsed time
More

Main content:

Current exercise
Muscle group
Previous performance
Set rows
Add set
Rest control
Next exercise

Set row:

SET
KG
REPS
STATUS

Example:

1   80   8   ✓
2   80   8   ✓
3   75   10  ✓

Requirements:

- Large numeric values.
- Large touch targets.
- Fast editing.
- Minimal scrolling.
- Previous performance visible.
- Completed state.
- Error state.
- Active input state.
- Offline support.
- Dark/light themes.

Use existing reusable components.

Do not put workout business logic directly inside the screen.
```

---

# 18. Prompt 16 — Set Logging

```text id="r2c8m6"
Implement complete set logging.

Support:

- Weight
- Reps
- RPE
- RIR
- Set type
- Notes
- Completion
- Editing
- Deleting
- Adding sets

Validation:

Weight:
non-negative numeric value.

Reps:
non-negative integer.

RPE:
0–10 if provided.

RIR:
0–10 if provided.

When a set is completed:

1. Validate.
2. Save locally.
3. Update Zustand state.
4. Queue sync operation.
5. Trigger rest timer if enabled.
6. Provide subtle visual/haptic feedback.

The UI must update immediately.

No Firebase request should be required.
```

---

# 19. Prompt 17 — Previous Performance

```text id="v7m1q4"
Implement previous-performance lookup for active workouts.

For each exercise, retrieve the user's most recent relevant completed performance.

Display:

PREVIOUS

80 kg × 8
80 kg × 8
75 kg × 10

Place this information directly inside the active workout.

Add optional autofill behavior.

Autofill must copy values into the current set without modifying historical data.

Optimize the query using SQLite indexes.

Do not make Firebase calls during normal set logging.
```

---

# 20. Prompt 18 — Rest Timer

```text id="k9x4c2"
Implement the Repshade rest timer.

The timer must use timestamps as its source of truth.

State:

isRunning
startedAt
durationSeconds
remainingSeconds

Support:

Start
Pause
Resume
Add 30 seconds
Skip
Complete

The timer must remain accurate when the app is backgrounded.

After completing a working set, automatically start the timer if the user's settings enable automatic rest.

Do not make Firebase part of the timer.

Create tests for:

- Start
- Pause
- Resume
- Add time
- Skip
- Expiration
- Background/resume calculation
```

---

# 21. Prompt 19 — Pause and Recovery

```text id="u6p3r8"
Implement workout pause and recovery.

Pause must preserve:

- Current exercise
- Current set
- Logged sets
- Timer state
- Workout timestamps

On application startup:

1. Query local SQLite.
2. Find the latest active/paused workout.
3. If found, expose recovery state.
4. Show Workout Recovery UI.

Recovery UI:

WORKOUT IN PROGRESS

PULL

7 sets logged

[ RESUME ]
[ DISCARD ]

Resume must restore the exact local workout.

Do not depend on Firebase for recovery.
```

---

# 22. Prompt 20 — Workout Completion

```text id="c7m4p9"
Implement workout completion as an idempotent operation.

Completion flow:

1. Verify workout state.
2. Enter completing state.
3. Calculate duration.
4. Calculate volume.
5. Calculate PRs.
6. Mark workout completed.
7. Advance split exactly once.
8. Set splitAdvanced = true.
9. Create sync operations.
10. Commit transaction.
11. Show workout summary.

If splitAdvanced is already true:

Do not advance the split again.

Protect against:

- Double taps
- App restarts
- Network retries
- Sync retries
- Duplicate requests

The workout completion operation must be safe to retry.
```

---

# 23. Prompt 21 — Workout Summary

```text id="m8q2x6"
Build the Repshade Workout Summary screen.

Show:

WORKOUT COMPLETE

Workout name

Duration
Sets
Volume

PRs if any

NEXT WORKOUT

[ DONE ]

Example:

PULL

58 min
18 sets
7,420 kg

NEW PR
Barbell Row
80 kg × 8

NEXT
LEGS

Keep the design minimal.

Do not add:

- XP
- Coins
- Streaks
- Leaderboards
- Badges
- Confetti

The actual workout data is the reward.
```

---

# 24. Prompt 22 — Manual Skip

```text id="q4n7s1"
Implement Manual Skip.

Flow:

Home/Plan
↓
More
↓
Skip Workout
↓
Confirmation
↓
Advance Split
↓
Update local database
↓
Queue sync
↓
Show next workout

Confirmation:

SKIP PULL?

Your next workout will become LEGS.

This will not create a workout record.

[ SKIP ]
[ CANCEL ]

Important:

Manual skip advances the split.

It does NOT create a completed workout.

It should not appear as a completed workout in normal history.

Make the operation idempotent where practical.
```

---

# 25. Prompt 23 — Quick Workout

```text id="t6w1p8"
Implement Quick Workout.

Purpose:

Allow a user to perform a one-off workout without modifying the planned split.

Quick Workout should allow:

- Start empty workout
- Add exercises
- Log sets
- Rest
- Pause
- Resume
- Finish

Default behavior:

Quick Workout records a workout session.

Quick Workout does NOT advance the current split.

Make this behavior explicit in code and tests.

Do not modify the normal workout template.
```

---

# 26. Prompt 24 — History

```text id="y8c3m5"
Implement Repshade History.

Create:

History Overview
Calendar
Workout Details
Exercise History

History should display completed workouts.

Calendar shows when the user actually trained.

Calendar does not determine the next split workout.

Workout details must use historical snapshot data.

Example:

PULL

September 12
58 min

18 sets
7,420 kg

LAT PULLDOWN

70 × 10
70 × 9
65 × 10

Historical records must remain stable even if the workout template changes later.
```

---

# 27. Prompt 25 — Progress

```text id="n3x7v2"
Implement Repshade Progress.

Create:

Progress Overview
Exercise Progress
Personal Records

Metrics:

- Workout count
- Sets
- Volume
- Weight progression
- Rep progression
- Exercise trends
- Personal records
- Training frequency

Create progressionEngine and recordEngine.

Keep calculations deterministic.

Do not automatically prescribe weight increases.

The system should show progress without pretending to be a personal trainer.

Use minimal charts.

Prioritize readability over visual complexity.
```

---

# 28. Prompt 26 — PR Engine

```text id="c6m1r8"
Implement the Personal Record engine.

Support PR categories:

- Heaviest weight
- Best reps at a given weight
- Estimated 1RM
- Highest volume

Create deterministic functions.

Example:

Previous:
80 kg × 8

Current:
82.5 kg × 8

Evaluate whether the current performance qualifies as a PR.

Store PR records locally.

Avoid duplicate PR records for the same achievement.

Add comprehensive unit tests.
```

---

# 29. Prompt 27 — Firebase Firestore

```text id="p8v3k1"
Implement Firebase Firestore cloud persistence.

Create user-scoped collections for:

Splits
Workout Templates
Exercises
Workout Sessions
Workout Sets
Personal Records
Settings

Use repositories/services.

Do not expose Firestore calls directly to UI components.

Users must only access their own data.

Implement Firestore security rules so:

request.auth.uid == userId

is required for private user data.

Do not replace SQLite with Firestore.

SQLite remains the local operational source.
```

---

# 30. Prompt 28 — Sync Queue

```text id="r5n9c3"
Implement the Repshade synchronization queue.

Create:

syncService
syncRepository
syncStore

Sync operation:

operationId
entityType
entityId
operationType
payload
createdAt
attemptCount
status

Operations:

CREATE
UPDATE
DELETE

Flow:

User action
↓
SQLite transaction
↓
Sync operation
↓
UI updates
↓
Firebase synchronization

If offline:

Keep operation pending.

If sync fails:

Keep local data.
Keep operation queued.
Increment attempt count.
Retry later.

Never delete local data because Firebase failed.
```

---

# 31. Prompt 29 — Connectivity

```text id="x4m7p2"
Implement centralized connectivity handling.

Create a connectivity service.

Expose:

isOnline
network state
connection changes

The application should react to connectivity changes.

Offline:

Show subtle:

Offline • Saved locally

Online:

Process pending sync operations.

Do not display intrusive network errors during normal workout usage.

The user must be able to train normally while offline.
```

---

# 32. Prompt 30 — Sync Idempotency

```text id="j6q2v8"
Audit synchronization for idempotency.

Ensure duplicate sync attempts cannot create:

- Duplicate workouts
- Duplicate sets
- Duplicate split advancement
- Duplicate PR records

Use stable client-generated IDs.

Every entity must have a unique UUID.

Every sync operation must have a unique operationId.

Firebase writes should use deterministic document IDs where appropriate.

A retry must be safe.

Create tests simulating:

- Duplicate CREATE
- Duplicate UPDATE
- Network failure after remote write
- Retry after timeout
```

---

# 33. Prompt 31 — Settings

```text id="v9c4m2"
Implement Repshade Settings.

Screens:

Settings
Units
Appearance
Notifications
Account
Data

Settings:

Weight unit:
kg / lb

Theme:
dark / light / system

Default rest duration

Notifications enabled

Rest timer enabled

Store canonical weight values internally in kilograms.

Convert only for display/input.

Changing units must never modify the underlying stored weight incorrectly.
```

---

# 34. Prompt 32 — Notifications

```text id="k3x8m1"
Implement optional Repshade notifications.

Support:

- Workout reminder
- Rest timer notification

Notifications must respect user settings.

Use calm language.

Good:

"Your next workout is ready."

Avoid:

"You missed your workout!"

"Your streak is broken!"

"You're falling behind!"

Notifications should never manipulate the user through guilt.

Do not make notifications mandatory.
```

---

# 35. Prompt 33 — Offline UX

```text id="m7p2c5"
Perform a complete offline UX implementation.

Verify that these work without internet:

- Home
- Plan
- Exercise library
- Start workout
- Previous performance
- Set logging
- Rest timer
- Pause
- Resume
- Finish
- Workout summary
- History
- Progress

Add subtle offline status indicators.

If Firebase is unavailable:

The app should continue functioning normally.

Never show a blocking "No Internet" screen for ordinary workout actions.
```

---

# 36. Prompt 34 — Error Handling

```text id="q8n4x6"
Implement centralized error handling.

Create typed errors:

ValidationError
DatabaseError
NetworkError
AuthError
SyncError
NotFoundError
ConflictError

User-facing errors must be human-readable.

Examples:

"Something went wrong while saving your workout."

"Your workout is still stored on this device."

"Sync is pending. Your local data is safe."

Do not expose technical stack traces or Firebase error codes to normal users.

Development logs may contain technical debugging information, but never log passwords, tokens or secrets.
```

---

# 37. Prompt 35 — Data Integrity Audit

```text id="f5k9r2"
Perform a complete data-integrity audit of Repshade.

Verify:

1. Every entity has a stable ID.
2. Offline-created entities use UUIDs.
3. Historical workouts are immutable by default.
4. Workout templates cannot mutate historical snapshots.
5. Completed workouts cannot advance the split twice.
6. Manual skip advances exactly once.
7. Missed days do not advance the split.
8. Quick Workout does not advance the split.
9. Local writes happen before cloud synchronization.
10. Failed sync does not delete local data.
11. Duplicate sync operations are safe.
12. SQLite transactions are used for multi-step mutations.

Add or improve tests wherever necessary.

Do not change product behavior.
```

---

# 38. Prompt 36 — Performance Audit

```text id="p2m7x4"
Perform a performance audit of Repshade.

Focus on:

- App startup
- SQLite queries
- Active workout rendering
- Set logging
- Exercise search
- History loading
- Progress calculations
- Sync queue
- Firebase reads

Requirements:

- Active workout must feel immediate.
- Set completion should not reload the entire screen.
- Avoid unnecessary Zustand subscriptions.
- Avoid unnecessary Firebase requests.
- Use indexes for common SQLite queries.
- Avoid expensive calculations on every keystroke.

Optimize only where there is a measurable or obvious problem.

Do not introduce unnecessary complexity.
```

---

# 39. Prompt 37 — Accessibility Audit

```text id="c8v3n6"
Perform a complete accessibility audit.

Verify:

- Minimum 44x44 touch targets
- Screen reader labels
- Button names
- Input labels
- Focus states
- Color contrast
- Dynamic text support
- Keyboard behavior
- State communicated without color alone

Especially audit:

- Active workout
- Set rows
- Numeric inputs
- Rest timer
- Bottom navigation

Do not sacrifice the Repshade visual identity.

Fix accessibility issues without changing product behavior.
```

---

# 40. Prompt 38 — UI Consistency Audit

```text id="r7m2k5"
Audit the entire Repshade UI against the design system.

Check:

- Colors
- Typography
- Spacing
- Radius
- Buttons
- Cards
- Inputs
- Icons
- Navigation
- Bottom sheets
- Modals
- Empty states
- Error states
- Offline states

Remove:

- One-off colors
- One-off spacing
- Inconsistent buttons
- Inconsistent icon styles
- Excessive shadows
- Excessive gradients
- Excessive accent usage
- Unnecessary cards

The application should feel like one coherent product.
```

---

# 41. Prompt 39 — Dark/Light Theme Audit

```text id="n5x8c1"
Audit dark and light themes.

Verify every screen and component supports:

Dark
Light
System

Dark should remain the primary Repshade experience.

Check:

- Text contrast
- Buttons
- Cards
- Inputs
- Charts
- Navigation
- Modals
- Bottom sheets
- Empty states
- Error states
- Offline indicators

Do not create duplicated component implementations for each theme.

Use semantic design tokens.
```

---

# 42. Prompt 40 — Full Test Suite

```text id="w3m8q6"
Create and run the complete Repshade test suite.

Unit tests:

- Split engine
- Workout state machine
- Volume calculation
- PR calculation
- Progression calculation
- Validation
- Rest timer
- Unit conversion

Integration tests:

- SQLite
- Workout creation
- Set logging
- Completion
- Split advancement
- Manual skip
- Quick Workout
- Sync queue

Critical scenarios:

1. Complete Push → Pull
2. Miss 7 days → still Pull
3. Skip Pull → Legs
4. Complete Legs → Push
5. Finish twice → one advancement
6. Offline workout → sync later
7. App restart → recovery
8. Template edited → history unchanged
9. Quick Workout → split unchanged
10. Duplicate sync → no duplicate data

Fix all failures before proceeding.
```

---

# 43. Prompt 41 — End-to-End MVP Verification

```text id="j4p8c2"
Perform a complete end-to-end verification of Repshade.

Simulate a new user:

1. Launch app.
2. Create account.
3. Complete onboarding.
4. Choose Push/Pull/Legs.
5. Configure workouts.
6. Open Home.
7. Verify Push is next.
8. Start Push.
9. Log multiple sets.
10. Use rest timer.
11. Pause.
12. Resume.
13. Finish.
14. Verify Pull becomes next.
15. Close app.
16. Wait through simulated missed days.
17. Reopen.
18. Verify Pull remains next.
19. Start Pull.
20. Skip Pull.
21. Verify Legs becomes next.
22. Run Quick Workout.
23. Verify split remains unchanged.
24. Open History.
25. Open Progress.
26. Open Profile.
27. Disable internet.
28. Complete another workout.
29. Re-enable internet.
30. Verify synchronization.

Report any issue found.

Do not silently change expected behavior to make a test pass.
```

---

# 44. Prompt 42 — Production Readiness

```text id="v6n2m9"
Perform a production-readiness review of Repshade.

Check:

Architecture
Security
Authentication
Firestore rules
SQLite migrations
Sync
Offline functionality
Data integrity
Navigation
Accessibility
Performance
Error handling
Notifications
UI consistency
Testing
Environment configuration

Look for:

- Hard-coded secrets
- Unsafe Firebase rules
- Unhandled promises
- Race conditions
- Duplicate operations
- Missing validation
- Missing loading states
- Missing error states
- Broken offline behavior
- Navigation edge cases
- Data-loss scenarios

Fix only issues that are within the current MVP scope.

Do not add new product features.
```

---

# 45. Prompt 43 — Final Cleanup

```text id="n8c4p7"
Perform a final cleanup of the Repshade codebase.

Remove:

- Dead code
- Unused imports
- Unused dependencies
- Temporary debug code
- Duplicate components
- Duplicate business logic
- Placeholder content that is no longer required

Improve:

- Naming
- Type safety
- File organization
- Comments where useful
- Error handling

Do not perform a large architectural rewrite.

Preserve all tested functionality.

Run:

- TypeScript
- Lint
- Tests
- Expo validation
```

---

# 46. Prompt 44 — Final Build

```text id="c5m9r3"
Prepare Repshade for a development build.

Verify:

- Expo configuration
- App name
- Bundle/package identifiers
- Assets
- Icons
- Splash screen
- Environment configuration
- Firebase configuration
- Android configuration
- iOS configuration where applicable
- Notifications configuration
- SQLite functionality

Run the appropriate Expo/EAS validation.

Do not publish or deploy anything automatically.

Report:

1. Build status.
2. Configuration issues.
3. Remaining warnings.
4. Remaining blockers.
```

---

# 47. Antigravity Working Rules

After every prompt, the coding agent should:

```text id="8w4m2c"
1. Inspect current implementation.
2. Implement requested scope.
3. Run relevant tests.
4. Run TypeScript.
5. Fix errors.
6. Summarize changes.
7. List remaining issues.
8. Stop.
```

Do not allow the agent to automatically continue through every phase.

---

# 48. Recommended Build Sessions

Do not give Antigravity all 44 prompts in one conversation.

Use separate focused sessions where possible.

## Session 1

```text id="3c8v5m"
Prompts 01–05
```

Foundation.

## Session 2

```text id="7m2x9p"
Prompts 06–09
```

Database, exercises and authentication.

## Session 3

```text id="4k8n1r"
Prompts 10–14
```

Split engine and workout foundation.

## Session 4

```text id="6p3w7c"
Prompts 15–23
```

Core workout experience.

## Session 5

```text id="9v4m2x"
Prompts 24–30
```

History, progress, Firebase and synchronization.

## Session 6

```text id="5c7k8n"
Prompts 31–39
```

Settings, offline, errors, accessibility and UI polish.

## Session 7

```text id="2m6r4p"
Prompts 40–44
```

Testing, audit and build preparation.

---

# 49. If the AI Agent Gets Stuck

Use this recovery prompt:

```text id="f8m3q7"
Stop implementation.

Inspect the current error carefully.

Do not rewrite the architecture.

Identify:

1. Root cause.
2. File responsible.
3. Smallest safe fix.
4. Tests required.

Implement only the smallest safe fix.

Then run TypeScript and the relevant tests.

Do not hide the error by weakening types, removing validation, disabling tests or bypassing the repository/domain architecture.
```

---

# 50. If the AI Agent Changes Too Much

Use:

```text id="c2v7m5"
Revert any unrelated changes from the previous implementation step.

Only retain changes directly required by the requested feature.

Do not refactor unrelated files.

Preserve existing working functionality.

After cleanup, run the relevant tests and TypeScript check.
```

---

# 51. If the AI Agent Breaks the Rolling Split

Use:

```text id="x7n4k2"
The Rolling Split behavior has been broken.

Restore the following invariant:

The calendar tells you when the user trained.

The split tells you what the user trains next.

Only completed workouts and intentional manual skips advance currentWorkoutIndex.

Missed calendar days do not advance it.

Example:

Push → Pull → Legs

Complete Push → Pull

Miss 7 days → Pull

Skip Pull → Legs

Complete Legs → Push

Find the source of the regression and fix it at the domain/business-logic layer.

Do not patch individual screens to compensate.

Add or repair unit tests so this regression cannot return.
```

---

# 52. If the AI Agent Makes Firebase Required

Use:

```text id="m5r8c1"
The application must remain local-first.

Remove any requirement for Firebase during:

- Start workout
- Log set
- Complete set
- Pause
- Resume
- Finish workout
- Workout recovery

The correct architecture is:

UI
↓
Zustand
↓
Domain
↓
SQLite
↓
Sync Queue
↓
Firebase

Local persistence must succeed before cloud synchronization is attempted.

Fix the implementation without removing cloud sync.
```

---

# 53. If the UI Becomes Too Complicated

Use:

```text id="q3m7v9"
Simplify the UI.

Repshade should feel like a premium training instrument.

Remove:

- Unnecessary cards
- Excessive borders
- Excessive colors
- Excessive gradients
- Excessive animations
- Decorative elements
- Gamification
- Unnecessary labels

Prioritize:

1. Current action.
2. Important workout data.
3. Previous performance.
4. Next action.

Do not reduce functionality.

Reduce visual complexity.
```

---

# 54. If the Active Workout Becomes Slow

Use:

```text id="w6c2n8"
Optimize the Active Workout without changing its behavior.

Investigate:

- Zustand subscriptions
- Component re-renders
- SQLite queries
- Derived calculations
- Rest timer updates
- List rendering
- Unnecessary parent renders

Set logging must update only the necessary UI.

Do not reload the entire workout after every set.

Do not move persistence to Firebase.

Do not remove data validation.
```

---

# 55. Final Antigravity Instruction

Once implementation begins, always prioritize in this order:

```text id="j9m3x7"
1. Data integrity
2. Rolling Split correctness
3. Offline workout reliability
4. Workout logging speed
5. Navigation correctness
6. Firebase synchronization
7. Progress calculations
8. Visual polish
9. Optional enhancements
```

Never sacrifice the first four to improve the last five.

---

# 56. Final Definition of Success

Repshade is successfully implemented when a user can:

```text id="z4p8m2"
Open
↓
Know the next workout
↓
Start
↓
See previous performance
↓
Log sets quickly
↓
Rest
↓
Pause/resume
↓
Finish
↓
See progress
↓
Return later
↓
Continue the correct split position
```

even when:

```text id="v7c1n5"
The internet is unavailable.
```

The implementation is successful when the technology becomes invisible and the user can simply:

**TRAIN. LOG. PROGRESS. REPEAT.**
