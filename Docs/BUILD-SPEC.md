# Repshade Antigravity Master Build Specification

## 1. Purpose

This document is the master implementation brief for building Repshade using **Antigravity** and an AI coding agent.

It combines the previously defined:

* Product requirements
* UX flows
* UI design system
* Screen specifications
* Technical architecture
* Firebase architecture
* Engineering rules

The purpose is to give the coding agent a single source of truth for implementation.

The application must be built incrementally.

**Do not attempt to generate the entire application in one step.**

---

# 2. Product

## Name

**Repshade**

## Mantra

**TRAIN. LOG. PROGRESS. REPEAT.**

## One-Line Definition

Repshade is a simple, offline-friendly workout tracker that follows a user's training split based on completed workouts—not the calendar—and helps them progressively track every set, rep and weight.

---

# 3. Core Product Rule

The most important rule in the entire application is:

> **The calendar tells you when you trained. Your split tells you what you train next.**

Example:

```text
PUSH → PULL → LEGS
```

User completes Push on Monday.

Tuesday: no workout.

Wednesday: no workout.

Thursday:

```text
NEXT WORKOUT
PULL
```

The missed days do not affect the split.

Only:

```text
Workout completed
OR
Workout manually skipped
```

advances the split.

---

# 4. What Antigravity Must Build

Build a complete mobile application with:

```text
Authentication
Onboarding
Workout split management
Workout templates
Exercise library
Custom exercises
Active workouts
Set logging
Previous performance
Rest timer
Workout pause/resume
Workout recovery
Workout completion
Rolling Split
Manual skip
Quick Workout
Workout history
Calendar
Exercise history
Progress tracking
Personal records
Settings
Offline functionality
Firebase synchronization
```

---

# 5. Technology Requirements

Use:

```text
React Native
Expo
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
```

Do not introduce additional libraries unless there is a concrete technical requirement.

---

# 6. Architecture

Use:

```text
Presentation
↓
State
↓
Domain
↓
Repository
↓
Local Database
↓
Sync Queue
↓
Firebase
```

The application must be local-first.

Firebase is the cloud persistence and synchronization layer.

Firebase must not become the dependency for basic workout functionality.

---

# 7. Project Structure

Create:

```text
app/
├── _layout.tsx
├── index.tsx
│
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
├── config.ts
├── auth.ts
├── firestore.ts
└── storage.ts

tests/
├── unit/
├── integration/
└── fixtures/
```

Keep the structure clean and predictable.

---

# 8. Implementation Sequence

Antigravity must implement the project in this order.

## Phase 1

Project initialization.

## Phase 2

Design tokens and UI components.

## Phase 3

Navigation.

## Phase 4

SQLite.

## Phase 5

Exercise library.

## Phase 6

Authentication.

## Phase 7

Onboarding.

## Phase 8

Split engine.

## Phase 9

Workout templates.

## Phase 10

Active workout.

## Phase 11

Workout completion.

## Phase 12

History.

## Phase 13

Progress.

## Phase 14

Firebase.

## Phase 15

Sync engine.

## Phase 16

Settings.

## Phase 17

Notifications.

## Phase 18

Testing and polish.

---

# 9. Phase 1 — Project Initialization

Create a clean Expo TypeScript project.

Configure:

* TypeScript strict mode
* Expo Router
* NativeWind
* ESLint
* Formatting
* Git
* Environment configuration

Verify:

```text
npm install
npx expo start
```

works successfully.

Do not proceed until the project launches correctly.

---

# 10. Phase 2 — Design System

Implement the Repshade design tokens.

Primary dark theme:

```text
background.primary      #0B0D0F
background.secondary    #121519
background.tertiary     #191D21
background.elevated     #20252A

text.primary            #F5F7F8
text.secondary          #A8B0B7
text.tertiary           #707980

border.subtle           #242A2F
border.default          #30373D

accent.primary          #B8F34A
accent.primaryPressed   #A4DD3F

success                 #6FD08C
warning                 #F2C94C
error                   #FF6B6B
info                    #6EA8FE
```

Implement spacing:

```text
4
8
12
16
24
32
40
48
64
```

Implement radii:

```text
6
8
12
16
20
999
```

Implement typography tokens.

Do not scatter raw values across components.

---

# 11. Phase 3 — Navigation

Implement:

```text
Home
Plan
Progress
History
Profile
```

Use Expo Router.

Active workout should use a dedicated full-screen route.

Navigation must support:

```text
Auth
↓
Onboarding
↓
Main App
↓
Workout
↓
Summary
```

---

# 12. Phase 4 — SQLite

Initialize SQLite before implementing complex workout functionality.

Create migrations for:

```text
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

Add appropriate indexes.

Create a migration system so the schema can evolve safely.

---

# 13. Phase 5 — Exercise Library

Bundle system exercises locally.

Exercise model should support:

```text
id
name
primaryMuscle
secondaryMuscles
equipment
isCustom
createdAt
updatedAt
```

System exercises must work offline.

Create search functionality.

Search should be fast enough to feel instantaneous.

---

# 14. Phase 6 — Authentication

Implement:

```text
Sign Up
Sign In
Sign Out
Password Reset
Auth Persistence
```

Use Firebase Authentication.

Authentication state should be reflected in `authStore`.

Do not place Firebase calls directly inside screens.

---

# 15. Phase 7 — Onboarding

Build:

```text
Welcome
↓
Sign Up / Sign In
↓
Setup Introduction
↓
Choose Split
↓
Configure Workouts
↓
Add Exercises
↓
Complete
↓
Home
```

Provide predefined split options:

```text
Push / Pull / Legs
Upper / Lower
Full Body
Custom
```

Allow custom split creation.

---

# 16. Phase 8 — Split Engine

Implement the Rolling Split before building the complete workout flow.

Create:

```text
splitEngine.ts
```

Primary functions:

```text
getNextWorkout()
advanceWorkout()
skipWorkout()
resetSplit()
```

The split must use:

```text
currentWorkoutIndex
```

as the authoritative next-workout position.

---

# 17. Split Engine Example

Given:

```text
Push
Pull
Legs
```

Initial:

```text
currentWorkoutIndex = 0
```

Next:

```text
Push
```

Complete Push:

```text
currentWorkoutIndex = 1
```

Next:

```text
Pull
```

No workout for five days:

```text
currentWorkoutIndex = 1
```

Next:

```text
Pull
```

Skip Pull:

```text
currentWorkoutIndex = 2
```

Next:

```text
Legs
```

Complete Legs:

```text
currentWorkoutIndex = 0
```

Next:

```text
Push
```

---

# 18. Split Engine Tests

Before continuing:

```text
Test 1:
Initial → Push

Test 2:
Complete Push → Pull

Test 3:
No workout for 7 days → Pull

Test 4:
Skip Pull → Legs

Test 5:
Complete Legs → Push

Test 6:
Double completion → only one advancement
```

All tests must pass.

---

# 19. Phase 9 — Workout Templates

Create workout template functionality.

Each workout contains:

```text
id
splitId
name
description
order
exercises
createdAt
updatedAt
```

Workout exercises contain:

```text
exerciseId
order
targetSets
targetRepMin
targetRepMax
restSeconds
setType
notes
```

Allow:

* Add
* Edit
* Delete
* Reorder

---

# 20. Phase 10 — Active Workout

Build Active Workout before advanced analytics.

Required functionality:

```text
Start
Log set
Edit set
Complete set
Add set
Delete set
Rest timer
Pause
Resume
Add exercise
Finish
Abandon
Recover
```

The Active Workout screen must work completely offline.

---

# 21. Starting Workout

When starting:

```text
Get current split workout
↓
Create session
↓
Snapshot template
↓
Create local workout data
↓
Persist
↓
Navigate
```

Never wait for Firebase.

---

# 22. Workout Session

Workout session must contain:

```text
id
userId
splitId
workoutTemplateId
workoutNameSnapshot
status
startedAt
completedAt
durationSeconds
volume
splitAdvanced
notes
createdAt
updatedAt
```

Possible status:

```text
active
paused
completed
abandoned
```

---

# 23. Workout Snapshot

When the workout begins, snapshot:

* Workout name
* Exercise names
* Exercise order
* Set configuration
* Relevant metadata

This protects historical records from future template changes.

---

# 24. Set Model

Each set should support:

```text
id
workoutSessionId
workoutExerciseId
setNumber
setType
weightKg
reps
rpe
rir
completed
completedAt
notes
createdAt
updatedAt
```

---

# 25. Set Logging UX

Optimize for:

```text
Tap
↓
Enter weight
↓
Enter reps
↓
Complete
```

Use previous performance.

Example:

```text
PREVIOUS

80 kg × 8
80 kg × 8
75 kg × 10
```

Allow autofill.

---

# 26. Set Completion

On completion:

```text
Validate
↓
Save SQLite
↓
Update UI
↓
Start rest timer if enabled
↓
Queue sync
```

Never require network connectivity.

---

# 27. Rest Timer

Use timestamps as the source of truth.

Do not rely only on interval counting.

Support:

```text
Start
Pause
Resume
+30 seconds
Skip
Complete
```

Rest timer must continue correctly through app backgrounding.

---

# 28. Pause / Resume

Pause must preserve:

* Sets
* Current exercise
* Current set
* Timer state
* Workout duration information

Resume should restore the exact workout state.

---

# 29. Workout Recovery

On app startup:

```text
Query active sessions
↓
If active session exists
↓
Show recovery screen
```

Recovery:

```text
WORKOUT IN PROGRESS

PULL

7 sets logged

[ RESUME ]
[ DISCARD ]
```

---

# 30. Workout Completion

Completion must be idempotent.

Flow:

```text
Verify session
↓
Mark completing
↓
Calculate duration
↓
Calculate volume
↓
Calculate PRs
↓
Advance split
↓
Set splitAdvanced = true
↓
Queue sync
↓
Show summary
```

Never advance twice.

---

# 31. Completion Protection

Before split advancement:

```text
if splitAdvanced === true
    do not advance
```

This protects against:

* Double taps
* App restart
* Retry
* Duplicate sync
* Network failure

---

# 32. Manual Skip

Implement:

```text
Home
↓
More
↓
Skip workout
↓
Confirmation
↓
Advance split
```

Skipping must not create a completed workout record.

The user should clearly understand:

```text
Current:
Pull

After skip:
Legs
```

---

# 33. Quick Workout

Quick Workout is independent.

Default behavior:

```text
Quick Workout
↓
Record session
↓
Do NOT advance split
```

It should not modify the planned program unless a future feature explicitly changes this behavior.

---

# 34. Phase 11 — Workout Summary

Display:

```text
Workout name
Duration
Sets
Volume
PRs
Next workout
```

Example:

```text
WORKOUT COMPLETE

PULL

58 min
18 sets
7,420 kg

NEW PR
Barbell Row
80 kg × 8

NEXT
LEGS

[ DONE ]
```

Keep the screen concise.

---

# 35. Phase 12 — History

Implement:

```text
Workout history
Calendar
Workout details
Exercise history
```

Completed sessions appear in history.

Abandoned sessions may appear separately depending on final UX.

Skipped workouts should not appear as completed workouts.

---

# 36. Calendar

Calendar records:

```text
When the user trained.
```

It does not determine:

```text
What the user trains next.
```

A calendar day with no workout must not modify the split.

---

# 37. Workout Details

Historical workout details should display the snapshot captured when the workout occurred.

Example:

```text
PULL

September 12
58 min

18 sets
7,420 kg

LAT PULLDOWN

70 × 10
70 × 9
65 × 10
```

---

# 38. Phase 13 — Progress

Implement:

```text
Progress overview
Exercise progress
Personal records
```

Primary metrics:

```text
Workout count
Sets
Volume
Strength progression
PRs
Training frequency
```

Keep analytics understandable.

---

# 39. Progression Engine

Create:

```text
progressionEngine.ts
```

It should calculate:

* Weight changes
* Rep changes
* Volume changes
* Estimated strength
* Exercise trends

Do not automatically prescribe weight increases in MVP.

---

# 40. PR Engine

Create:

```text
recordEngine.ts
```

Support:

```text
Heaviest weight
Best reps at weight
Estimated 1RM
Highest volume
```

PR calculations must be deterministic and testable.

---

# 41. Phase 14 — Firebase

After local functionality is stable, integrate Firebase.

Firebase should store:

```text
Users
Splits
Workout templates
Exercises
Workout sessions
Sets
PRs
Settings
```

Use user-scoped Firestore paths.

---

# 42. Firebase Security

Users must only access their own data.

Conceptually:

```text
users/{userId}/...
```

Security rules must verify:

```text
request.auth.uid == userId
```

Do not rely on client-side checks.

---

# 43. Phase 15 — Synchronization

Create:

```text
syncService
syncRepository
syncStore
```

Mutation flow:

```text
User action
↓
SQLite transaction
↓
Sync operation
↓
UI update
↓
Firebase synchronization
```

---

# 44. Sync Operations

Support:

```text
CREATE
UPDATE
DELETE
```

Each operation needs:

```text
operationId
entityType
entityId
operationType
payload
createdAt
attemptCount
status
```

---

# 45. Offline Synchronization

Scenario:

```text
Internet OFF

Start workout
↓
Log sets
↓
Finish
↓
Data remains local

Internet ON
↓
Sync queue processed
↓
Firebase updated
```

Expected:

```text
No data loss
No duplicate workout
No duplicate split advancement
```

---

# 46. Sync Retry

Failed synchronization must remain queued.

Use controlled retries.

Do not repeatedly hammer Firebase.

If sync fails:

```text
Local data remains valid.
Operation remains pending.
Retry later.
```

---

# 47. Phase 16 — Settings

Implement:

```text
Units
Appearance
Notifications
Account
Data
```

Theme:

```text
Dark
Light
System
```

Weight:

```text
kg
lb
```

Store kilograms internally.

Convert only for presentation/input.

---

# 48. Phase 17 — Notifications

Implement optional:

```text
Workout reminders
Rest timer notifications
```

Avoid:

```text
"You missed your workout!"
"Your streak is broken!"
"Get back to the gym!"
```

Notifications must remain supportive and neutral.

---

# 49. Phase 18 — Testing

Before considering the MVP complete, test:

```text
Authentication
Onboarding
Split creation
Split ordering
Workout creation
Workout start
Set logging
Set editing
Rest timer
Pause
Resume
Recovery
Completion
Manual skip
Quick workout
History
Progress
Offline operation
Sync
Sync retry
Duplicate completion
```

---

# 50. Critical Automated Tests

## Rolling Split

```text
PPL:
Push → Pull → Legs
```

Verify:

```text
Complete Push → Pull
Miss 5 days → Pull
Skip Pull → Legs
Complete Legs → Push
```

---

# 51. Duplicate Completion Test

Run:

```text
finishWorkout()
finishWorkout()
```

Expected:

```text
1 workout
1 split advancement
```

---

# 52. Offline Test

Run:

```text
Start workout
Disable internet
Log 10 sets
Finish
Enable internet
Sync
```

Expected:

```text
1 workout
10 sets
Correct volume
Correct split position
Successful synchronization
```

---

# 53. Recovery Test

Run:

```text
Start workout
Log sets
Force close
Reopen
Resume
```

Expected:

```text
All previously logged data remains.
```

---

# 54. Template Snapshot Test

Run:

```text
Create Push
↓
Complete Push
↓
Edit Push template
↓
View historical Push
```

Expected:

```text
Historical Push remains unchanged.
```

---

# 55. Calendar Test

Run:

```text
Complete Push Monday
No workout Tue
No workout Wed
Open app Thursday
```

Expected:

```text
Next = Pull
```

Never:

```text
Next = Legs
```

---

# 56. Manual Skip Test

Run:

```text
Push complete
↓
Pull next
↓
Skip Pull
```

Expected:

```text
Next = Legs
```

And:

```text
No completed Pull workout in history
```

---

# 57. Quick Workout Test

Run:

```text
Current split = Pull
↓
Start Quick Workout
↓
Complete
```

Expected:

```text
Split remains Pull
```

---

# 58. UI Quality Requirements

Every major screen must:

* Match the Repshade design system.
* Support dark theme.
* Support light theme.
* Have appropriate loading states.
* Have error states.
* Have empty states where necessary.
* Respect safe areas.
* Support accessible touch targets.
* Avoid unnecessary animation.

---

# 59. Active Workout Quality Requirements

The Active Workout screen must:

* Work offline.
* Load quickly.
* Show previous performance.
* Allow rapid numeric entry.
* Support editing completed sets.
* Support rest timer.
* Support pause/resume.
* Recover after app restart.
* Prevent accidental data loss.
* Avoid unnecessary navigation.

---

# 60. Performance Requirements

Optimize for:

```text
Fast startup
Fast local reads
Fast set logging
Fast screen transitions
Minimal unnecessary renders
Minimal network requests
```

Do not fetch data from Firebase that already exists locally unless synchronization requires it.

---

# 61. Data Integrity Requirements

Never:

* Delete historical workouts because a template changes.
* Advance the split because a date changed.
* Lose sets because internet disappeared.
* Create duplicate workouts from retries.
* Advance the split twice.
* Depend on Firebase for active workout state.

---

# 62. AI Agent Coding Rules

The coding agent must:

1. Read existing code before editing.
2. Preserve working functionality.
3. Make small changes.
4. Run tests after meaningful changes.
5. Run TypeScript checks.
6. Avoid unrelated refactoring.
7. Avoid unnecessary dependencies.
8. Keep business logic outside screens.
9. Use repositories for persistence.
10. Use domain engines for business rules.
11. Keep SQLite local-first.
12. Never modify product rules without explicit instruction.

---

# 63. AI Agent Forbidden Shortcuts

Do NOT:

```text
Put everything in App.tsx.

Put Firebase calls inside UI components.

Store active workout only in React state.

Calculate next workout from today's date.

Use AsyncStorage as the main relational workout database.

Remove validation to fix errors.

Disable TypeScript checks.

Hard-code user data.

Create duplicate business logic.

Replace the local database with Firebase because it is easier.
```

---

# 64. Coding Style

Prefer:

```text
Small functions
Typed interfaces
Pure domain functions
Reusable components
Explicit state transitions
Repository abstraction
Testable business logic
```

Avoid:

```text
Huge files
Deeply nested conditionals
Magic numbers
Global mutable state
Duplicated logic
Hidden side effects
```

---

# 65. Component Rule

A component should primarily handle:

```text
Rendering
User interaction
Visual state
Navigation triggers
```

It should not handle:

```text
SQL
Firebase
Split calculations
PR calculations
Complex business rules
```

---

# 66. Domain Rule

Domain functions should be deterministic wherever possible.

For example:

```text
advanceWorkoutIndex(currentIndex, workoutCount)
```

should return the same output for the same input.

This makes the most important product behavior easy to test.

---

# 67. Error Recovery Philosophy

If something fails:

```text
Preserve local data.
Explain the problem.
Give the user a recovery action.
Retry when appropriate.
```

Never prioritize cloud synchronization over local data integrity.

---

# 68. Final MVP User Journey

The complete MVP should support:

```text
Open Repshade
↓
Create account
↓
Choose PPL
↓
Configure Push
↓
Configure Pull
↓
Configure Legs
↓
Home
↓
See NEXT WORKOUT: Push
↓
Start
↓
Log sets
↓
Rest
↓
Continue
↓
Finish
↓
Workout Summary
↓
Split advances
↓
Home
↓
NEXT WORKOUT: Pull
```

Then:

```text
No workout for several days
↓
Open app
↓
NEXT WORKOUT: Pull
```

This is the defining Repshade experience.

---

# 69. Definition of Done

Repshade MVP is considered complete when:

### Core

* [ ] Authentication works.
* [ ] Onboarding works.
* [ ] Split creation works.
* [ ] Workout templates work.
* [ ] Exercise library works.
* [ ] Custom exercises work.

### Workout

* [ ] Start workout works.
* [ ] Set logging works.
* [ ] Previous performance works.
* [ ] Rest timer works.
* [ ] Pause/resume works.
* [ ] Recovery works.
* [ ] Completion works.
* [ ] Manual skip works.
* [ ] Quick Workout works.

### Rolling Split

* [ ] Completion advances split.
* [ ] Manual skip advances split.
* [ ] Missed days do not advance split.
* [ ] Double completion cannot advance twice.

### Data

* [ ] SQLite works.
* [ ] Offline workout works.
* [ ] Sync queue works.
* [ ] Firebase sync works.
* [ ] Historical data remains stable.

### Progress

* [ ] History works.
* [ ] Calendar works.
* [ ] Exercise history works.
* [ ] Progress works.
* [ ] PRs work.

### UI

* [ ] Dark theme works.
* [ ] Light theme works.
* [ ] Components are consistent.
* [ ] Accessibility basics are implemented.
* [ ] Empty states exist.
* [ ] Error states exist.
* [ ] Offline states exist.

---

# 70. Final Antigravity Master Instruction

When implementing Repshade, follow this hierarchy:

```text
PRODUCT RULES
      ↓
UX RULES
      ↓
ARCHITECTURE
      ↓
DOMAIN LOGIC
      ↓
DATA
      ↓
UI
```

Do not allow implementation convenience to override product behavior.

If there is ever a conflict between:

```text
Calendar logic
```

and:

```text
Rolling Split logic
```

the Rolling Split logic wins.

If there is ever a conflict between:

```text
Firebase availability
```

and:

```text
Workout functionality
```

local-first workout functionality wins.

If there is ever a conflict between:

```text
Visual complexity
```

and:

```text
Workout usability
```

workout usability wins.

---

# 71. Final Build Philosophy

Build Repshade as a small, reliable system.

Do not over-engineer the MVP.

Do not build features that are not required.

Do not add social features.

Do not add nutrition tracking.

Do not add calorie tracking.

Do not add leaderboards.

Do not add unnecessary gamification.

Do not add an AI fitness coach to the core MVP.

Build the core loop exceptionally well:

```text
KNOW
↓
TRAIN
↓
LOG
↓
REST
↓
FINISH
↓
PROGRESS
↓
REPEAT
```

---

# 72. Final Product Principle

The application should always make the next action obvious.

When the user opens Repshade:

> **Start your next workout.**

During training:

> **Log your next set.**

After training:

> **See what you accomplished.**

Later:

> **See how you progressed.**

And when the user returns:

> **Continue from where your split left off.**

That is Repshade.
