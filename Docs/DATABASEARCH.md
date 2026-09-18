# REPSHADE — FIREBASE & DATA ARCHITECTURE SPECIFICATION

**Document:** 05 — Firebase & Data Architecture Specification
**Version:** 1.0
**Status:** Technical Definition
**Product:** Repshade
**Platform:** iOS & Android
**Cloud Backend:** Firebase
**Local Database:** Expo SQLite

---

# 1. PURPOSE

This document defines the complete data architecture for Repshade.

It establishes:

* Firestore collections
* SQLite tables
* Data relationships
* TypeScript models
* IDs
* Timestamps
* Workout state
* Rolling split state
* Synchronization metadata
* Offline behavior
* Firestore security
* Required indexes
* Data migration strategy

The goal is to ensure that workout data is reliable, scalable, and safe from accidental loss.

---

# 2. DATA ARCHITECTURE PRINCIPLE

Repshade uses:

LOCAL DATABASE → SOURCE FOR ACTIVE EXPERIENCE

FIREBASE → CLOUD PERSISTENCE + SYNCHRONIZATION

During an active workout:

```text
USER
 ↓
ZUSTAND
 ↓
SQLITE
 ↓
SYNC QUEUE
 ↓
FIREBASE
```

The user should never have to wait for Firebase to record a set.

---

# 3. CORE ENTITIES

Repshade contains the following core entities:

```text
User
Split
Workout Template
Exercise
Workout Session
Workout Exercise
Workout Set
Personal Record
Body Weight Entry
User Settings
Sync Operation
```

---

# 4. ENTITY RELATIONSHIP

```text
USER
 │
 ├── Splits
 │     │
 │     └── Workout Templates
 │             │
 │             └── Exercises
 │
 ├── Workout Sessions
 │       │
 │       ├── Workout Exercises
 │       │       │
 │       │       └── Workout Sets
 │       │
 │       └── Notes
 │
 ├── Personal Records
 │
 ├── Body Weight Entries
 │
 └── Settings
```

---

# 5. USER MODEL

Each authenticated user has a user profile.

```typescript
interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;

  activeSplitId?: string;

  createdAt: number;
  updatedAt: number;
}
```

The Firebase Authentication UID must be used as the primary user ID.

---

# 6. FIRESTORE USER DOCUMENT

Path:

```text
users/{userId}
```

Example:

```json
{
  "email": "user@example.com",
  "displayName": "User",
  "activeSplitId": "split_001",
  "createdAt": 1726300000000,
  "updatedAt": 1726300000000
}
```

The authentication UID is the document ID.

---

# 7. SPLIT MODEL

A split represents the user's training program.

```typescript
interface Split {
  id: string;
  userId: string;

  name: string;
  description?: string;

  currentWorkoutIndex: number;

  isActive: boolean;

  createdAt: number;
  updatedAt: number;
}
```

---

# 8. SPLIT POSITION

The most important field:

```text
currentWorkoutIndex
```

Example:

```text
Push = 0
Pull = 1
Legs = 2
```

If:

```text
currentWorkoutIndex = 1
```

then:

```text
Pull
```

is the next workout.

---

# 9. SPLIT POSITION RULE

The value must NOT be calculated from the date.

Incorrect:

```text
weekday → workout
```

Correct:

```text
last completed workout → next workout
```

---

# 10. FIRESTORE SPLIT DOCUMENT

Path:

```text
users/{userId}/splits/{splitId}
```

Example:

```json
{
  "name": "Push Pull Legs",
  "description": "My PPL program",
  "currentWorkoutIndex": 1,
  "isActive": true,
  "createdAt": 1726300000000,
  "updatedAt": 1726300000000
}
```

---

# 11. WORKOUT TEMPLATE

A Workout Template represents a workout inside a split.

Example:

```text
Push A
Pull A
Legs A
```

Model:

```typescript
interface WorkoutTemplate {
  id: string;
  splitId: string;
  userId: string;

  name: string;
  description?: string;

  order: number;

  estimatedDurationMinutes?: number;

  createdAt: number;
  updatedAt: number;
}
```

---

# 12. WORKOUT TEMPLATE ORDER

The order determines the rolling sequence.

Example:

```text
order 0 → Push
order 1 → Pull
order 2 → Legs
```

The order must be independent of calendar dates.

---

# 13. FIRESTORE WORKOUT TEMPLATE

Path:

```text
users/{userId}/splits/{splitId}/workouts/{workoutId}
```

Example:

```json
{
  "name": "Push A",
  "description": "Chest, shoulders and triceps",
  "order": 0,
  "estimatedDurationMinutes": 55,
  "createdAt": 1726300000000,
  "updatedAt": 1726300000000
}
```

---

# 14. EXERCISE MODEL

Exercises represent reusable exercise definitions.

```typescript
interface Exercise {
  id: string;
  userId?: string;

  name: string;

  primaryMuscle: string;
  secondaryMuscles?: string[];

  equipment?: string;

  trackingType:
    | "weight_reps"
    | "reps"
    | "duration"
    | "distance"
    | "weight_duration";

  isCustom: boolean;

  createdAt: number;
  updatedAt: number;
}
```

---

# 15. SYSTEM EXERCISES

The application should include a predefined exercise library.

Examples:

```text
Bench Press
Incline Dumbbell Press
Squat
Deadlift
Lat Pulldown
Seated Row
Shoulder Press
Lateral Raise
Bicep Curl
Triceps Pushdown
```

System exercises do not belong exclusively to one user.

---

# 16. CUSTOM EXERCISES

Users can create custom exercises.

Example:

```json
{
  "name": "Custom Cable Press",
  "primaryMuscle": "Chest",
  "equipment": "Cable",
  "trackingType": "weight_reps",
  "isCustom": true
}
```

Custom exercises belong to the user.

---

# 17. WORKOUT EXERCISE MODEL

Workout templates need to know which exercises they contain.

```typescript
interface WorkoutExercise {
  id: string;

  workoutTemplateId: string;
  exerciseId: string;

  order: number;

  targetSets: number;

  targetRepMin?: number;
  targetRepMax?: number;

  restSeconds?: number;

  setType: SetType;

  notes?: string;

  isSuperset?: boolean;
  supersetGroup?: string;

  createdAt: number;
  updatedAt: number;
}
```

---

# 18. SET TYPE

Supported values:

```typescript
type SetType =
  | "normal"
  | "warmup"
  | "dropset"
  | "failure"
  | "amrap";
```

---

# 19. WORKOUT SESSION

A Workout Session represents an actual workout performed by the user.

```typescript
interface WorkoutSession {
  id: string;

  userId: string;

  splitId: string;
  workoutTemplateId: string;

  startedAt: number;
  completedAt?: number;

  status:
    | "planned"
    | "in_progress"
    | "paused"
    | "completed"
    | "skipped"
    | "abandoned";

  durationSeconds?: number;

  totalVolume?: number;
  totalSets?: number;
  totalReps?: number;

  notes?: string;

  splitAdvanced: boolean;

  createdAt: number;
  updatedAt: number;
}
```

---

# 20. SPLIT ADVANCED FLAG

Critical field:

```text
splitAdvanced
```

Purpose:

Prevent double advancement.

Example:

```text
false
```

Workout finishes.

Application:

```text
Save workout
 ↓
Advance split
 ↓
Set splitAdvanced = true
```

If the completion function runs again, it sees:

```text
splitAdvanced = true
```

and does not advance again.

---

# 21. WORKOUT SET MODEL

```typescript
interface WorkoutSet {
  id: string;

  workoutSessionId: string;
  workoutExerciseId: string;
  exerciseId: string;

  setNumber: number;

  weight?: number;
  reps?: number;

  durationSeconds?: number;
  distance?: number;

  rpe?: number;
  rir?: number;

  setType: SetType;

  completed: boolean;

  notes?: string;

  createdAt: number;
  updatedAt: number;
}
```

---

# 22. SET ID

Every set should have a unique ID.

Recommended:

```text
UUID
```

Example:

```text
7f3c1c3e-4f3d-4e7a-91ad-1a3c4b4e7e91
```

Do not use set numbers as IDs.

Set numbers can change.

---

# 23. PERSONAL RECORD MODEL

```typescript
interface PersonalRecord {
  id: string;

  userId: string;
  exerciseId: string;

  recordType:
    | "weight"
    | "reps"
    | "volume"
    | "estimated_1rm";

  value: number;

  weight?: number;
  reps?: number;

  workoutSessionId: string;
  achievedAt: number;

  createdAt: number;
  updatedAt: number;
}
```

---

# 24. BODY WEIGHT MODEL

```typescript
interface BodyWeightEntry {
  id: string;

  userId: string;

  weight: number;
  unit: "kg" | "lb";

  recordedAt: number;

  createdAt: number;
  updatedAt: number;
}
```

---

# 25. USER SETTINGS

```typescript
interface UserSettings {
  userId: string;

  weightUnit: "kg" | "lb";
  distanceUnit: "km" | "mi";

  autoStartRestTimer: boolean;

  defaultRestSeconds: number;

  showRPE: boolean;
  showRIR: boolean;

  theme: "system" | "light" | "dark";

  workoutRemindersEnabled: boolean;

  createdAt: number;
  updatedAt: number;
}
```

---

# 26. SYNC OPERATION

The sync queue stores unsynchronized changes.

```typescript
interface SyncOperation {
  id: string;

  userId: string;

  operation:
    | "create"
    | "update"
    | "delete";

  entityType:
    | "user"
    | "split"
    | "workout_template"
    | "exercise"
    | "workout_session"
    | "workout_set"
    | "personal_record"
    | "body_weight"
    | "settings";

  entityId: string;

  payload: string;

  createdAt: number;

  retryCount: number;

  lastAttemptAt?: number;

  status:
    | "pending"
    | "syncing"
    | "failed"
    | "completed";
}
```

---

# 27. FIRESTORE STRUCTURE

Recommended structure:

```text
users/
    {userId}/

        profile

        settings

        splits/
            {splitId}/
                workouts/
                    {workoutId}/

        exercises/
            {exerciseId}/

        workoutSessions/
            {sessionId}/
                sets/
                    {setId}/

        personalRecords/
            {recordId}/

        bodyWeight/
            {entryId}/
```

---

# 28. WHY WORKOUT SESSIONS ARE SEPARATE FROM TEMPLATES

Templates represent:

"What I planned to do."

Sessions represent:

"What I actually did."

This separation is critical.

Example:

Template:

Bench Press
4 × 8–12

Actual session:

80 × 8
80 × 7
77.5 × 9
75 × 10

Changing the template later must not change the historical session.

---

# 29. HISTORICAL DATA IMMUTABILITY

Historical workout data should be treated as immutable records.

If the user changes:

Bench Press

to:

Barbell Bench Press

the historical workout should still contain the original exercise reference and recorded values.

---

# 30. WORKOUT TEMPLATE SNAPSHOT

When a workout begins, the application should preserve the relevant template configuration in the session or session exercise records.

This prevents future template edits from altering an already-started workout.

---

# 31. SQLITE ARCHITECTURE

SQLite should mirror the important Firestore entities.

Tables:

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

---

# 32. SQLITE USERS TABLE

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    display_name TEXT,
    photo_url TEXT,
    active_split_id TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
```

---

# 33. SQLITE SPLITS TABLE

```sql
CREATE TABLE splits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    current_workout_index INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
```

---

# 34. SQLITE WORKOUT TEMPLATES TABLE

```sql
CREATE TABLE workout_templates (
    id TEXT PRIMARY KEY,
    split_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    workout_order INTEGER NOT NULL,
    estimated_duration_minutes INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
```

---

# 35. SQLITE EXERCISES TABLE

```sql
CREATE TABLE exercises (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    primary_muscle TEXT NOT NULL,
    secondary_muscles TEXT,
    equipment TEXT,
    tracking_type TEXT NOT NULL,
    is_custom INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
```

---

# 36. SQLITE WORKOUT EXERCISES TABLE

```sql
CREATE TABLE workout_exercises (
    id TEXT PRIMARY KEY,
    workout_template_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    exercise_order INTEGER NOT NULL,
    target_sets INTEGER NOT NULL,
    target_rep_min INTEGER,
    target_rep_max INTEGER,
    rest_seconds INTEGER,
    set_type TEXT NOT NULL,
    notes TEXT,
    is_superset INTEGER NOT NULL DEFAULT 0,
    superset_group TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
```

---

# 37. SQLITE WORKOUT SESSIONS TABLE

```sql
CREATE TABLE workout_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    split_id TEXT NOT NULL,
    workout_template_id TEXT NOT NULL,
    started_at INTEGER NOT NULL,
    completed_at INTEGER,
    status TEXT NOT NULL,
    duration_seconds INTEGER,
    total_volume REAL,
    total_sets INTEGER,
    total_reps INTEGER,
    notes TEXT,
    split_advanced INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
```

---

# 38. SQLITE WORKOUT SETS TABLE

```sql
CREATE TABLE workout_sets (
    id TEXT PRIMARY KEY,
    workout_session_id TEXT NOT NULL,
    workout_exercise_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    weight REAL,
    reps INTEGER,
    duration_seconds INTEGER,
    distance REAL,
    rpe REAL,
    rir REAL,
    set_type TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
```

---

# 39. SQLITE SYNC QUEUE

```sql
CREATE TABLE sync_operations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    operation TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    last_attempt_at INTEGER,
    status TEXT NOT NULL DEFAULT 'pending'
);
```

---

# 40. INDEXES

Important SQLite indexes:

```sql
CREATE INDEX idx_workout_sessions_user
ON workout_sessions(user_id);

CREATE INDEX idx_workout_sessions_date
ON workout_sessions(started_at);

CREATE INDEX idx_workout_sets_session
ON workout_sets(workout_session_id);

CREATE INDEX idx_workout_sets_exercise
ON workout_sets(exercise_id);

CREATE INDEX idx_workout_templates_split
ON workout_templates(split_id);

CREATE INDEX idx_workout_exercises_template
ON workout_exercises(workout_template_id);

CREATE INDEX idx_sync_operations_status
ON sync_operations(status);
```

---

# 41. PREVIOUS PERFORMANCE QUERY

One of the most common application queries will be:

"Get the previous completed performance for this exercise."

Conceptually:

```sql
SELECT *
FROM workout_sets
WHERE exercise_id = ?
AND completed = 1
ORDER BY created_at DESC
LIMIT ?;
```

The repository layer should expose this as:

```typescript
getPreviousPerformance(exerciseId)
```

The UI should not directly query SQLite.

---

# 42. REPOSITORY ARCHITECTURE

Use repositories.

Example:

```text
src/database/repositories/

userRepository.ts
splitRepository.ts
exerciseRepository.ts
workoutRepository.ts
setRepository.ts
progressRepository.ts
syncRepository.ts
```

UI and Zustand stores should interact with repositories rather than raw SQL.

---

# 43. DATA FLOW — READING

```text
Screen
 ↓
Zustand
 ↓
Repository
 ↓
SQLite
 ↓
Zustand
 ↓
Screen
```

---

# 44. DATA FLOW — WRITING

```text
User
 ↓
UI
 ↓
Zustand
 ↓
Domain Logic
 ↓
Repository
 ↓
SQLite
 ↓
Sync Queue
```

---

# 45. DATA FLOW — CLOUD SYNC

```text
Sync Manager
 ↓
Sync Queue
 ↓
Firebase Repository
 ↓
Firestore
 ↓
Success
 ↓
Remove / mark queue item complete
```

---

# 46. SYNC TRIGGERS

Synchronization should occur:

1. When the app launches.
2. When the app returns to foreground.
3. When connectivity returns.
4. After important completed actions.
5. Periodically while the app is active where appropriate.

The active workout should not block on synchronization.

---

# 47. CONNECTIVITY STATES

The app should maintain:

```text
ONLINE
OFFLINE
SYNCING
SYNC_ERROR
```

The state should be visible only when useful.

Avoid intrusive notifications.

---

# 48. OFFLINE DATA RULE

When offline:

```text
CREATE
UPDATE
DELETE
```

operations should be applied locally.

The corresponding operation should be placed into the sync queue.

---

# 49. SYNC RETRY

If synchronization fails:

```text
retryCount += 1
```

Retry using increasing delays.

Example:

```text
30 seconds
1 minute
5 minutes
15 minutes
```

The exact implementation can be refined later.

---

# 50. FIRESTORE SECURITY MODEL

All user-owned documents must be protected.

Conceptually:

```text
request.auth.uid == userId
```

Users must not be able to read or modify another user's:

* Workouts
* Sets
* Splits
* Exercises
* PRs
* Body weight
* Settings

---

# 51. SYSTEM EXERCISE SECURITY

System exercises may be readable by authenticated users.

Users should not be able to modify global system exercises.

Custom exercises are user-owned.

---

# 52. FIRESTORE RULE PRINCIPLE

Never rely on the mobile application to enforce security.

The Firebase Security Rules must independently enforce:

* Authentication
* Ownership
* Read permissions
* Write permissions
* Delete permissions

---

# 53. TIMESTAMP STRATEGY

Use integer timestamps internally or Firestore timestamps consistently.

The architecture should use one convention.

Recommended:

```text
Unix milliseconds
```

for SQLite and application domain models.

Firebase conversion can occur in the repository layer.

---

# 54. ID STRATEGY

Use UUIDs for client-created entities.

This is important because entities may be created offline.

Example:

```text
splitId
workoutId
exerciseId
sessionId
setId
```

must not require Firebase to generate an ID.

---

# 55. OFFLINE ID GENERATION

The device generates:

```text
UUID
```

locally.

Example:

```text
session_abc123
```

The exact UUID implementation should use a reliable library or platform-supported UUID mechanism.

---

# 56. DATA OWNERSHIP

Every user-owned entity should contain:

```text
userId
```

even if it is nested under a user document in Firestore.

This simplifies:

* Local queries
* Synchronization
* Validation
* Security checks
* Debugging

---

# 57. WORKOUT COMPLETION TRANSACTION

When the user finishes a workout:

```text
1. Validate session
2. Save all pending sets
3. Calculate totals
4. Mark session completed
5. Check PRs
6. Create PR records
7. Advance split
8. Mark split advancement complete
9. Add sync operations
```

This should happen through a single domain-level operation:

```typescript
completeWorkout(sessionId)
```

---

# 58. COMPLETE WORKOUT SAFETY

The operation must be idempotent.

If:

```text
completeWorkout(sessionId)
```

is accidentally called twice:

The second call must not:

* Create duplicate workout
* Create duplicate PRs
* Advance split twice

---

# 59. SKIP WORKOUT

When a user intentionally skips:

```text
1. Create skip record
2. Mark workout skipped
3. Advance split
4. Persist locally
5. Queue sync
```

The skip action should be represented in history.

---

# 60. MISSED WORKOUT

A missed calendar day creates no database record.

Example:

Push completed Monday.

Tuesday:

No action.

Wednesday:

Pull remains next.

Do not create fake "missed workout" records.

---

# 61. QUICK WORKOUT

Quick workouts should create a normal Workout Session.

However:

```text
countsTowardSplit = false
```

by default.

If the user chooses to count it toward their planned workout, the split can advance.

---

# 62. HISTORICAL WORKOUT QUERY

History should be queried by:

```text
userId
date range
```

Example:

```text
Get all completed workouts
between September 1 and September 30.
```

This should be handled by the repository layer.

---

# 63. PROGRESS CALCULATION

Progress calculations should use completed workout sessions only.

Do not include:

* Planned workouts
* Abandoned workouts
* Incomplete sessions
* Skipped workouts

unless a specific statistic explicitly requires them.

---

# 64. VOLUME CALCULATION

For weight × reps exercises:

```text
volume = weight × reps
```

For a workout:

```text
totalVolume =
sum(all applicable completed set volumes)
```

Warm-up sets can optionally be included or excluded based on settings.

The default should be:

Include completed sets.

---

# 65. PR CALCULATION

PR detection should occur after workout completion.

The engine should compare the new performance against historical completed data.

PR types:

* Maximum weight
* Maximum reps
* Maximum volume
* Estimated 1RM

---

# 66. DATA MIGRATION

Database migrations must be versioned.

Example:

```text
Migration 1
Initial schema

Migration 2
Add RIR

Migration 3
Add body weight

Migration 4
Add superset support
```

Never modify production schema destructively without a migration.

---

# 67. BACKUP STRATEGY

Firebase acts as the cloud backup.

Local SQLite is not considered permanent backup.

If a device is lost:

User signs in on another device.

Application downloads cloud data.

---

# 68. DELETE ACCOUNT

When a user deletes their account:

All user-owned cloud data should eventually be deleted.

This includes:

* Profile
* Splits
* Workout templates
* Custom exercises
* Workout sessions
* Sets
* PRs
* Body weight
* Settings

The exact deletion architecture should be implemented securely, potentially using a server-side Firebase mechanism when required.

---

# 69. EXPORT DATA

Future feature.

Users should eventually be able to export:

* Workout history
* Sets
* Exercises
* Progress
* Body weight

Recommended format:

CSV and JSON.

---

# 70. FIRESTORE INDEX REQUIREMENTS

Indexes should be added only for queries that require them.

Likely indexes:

```text
workoutSessions:
userId + startedAt

workoutSets:
exerciseId + createdAt

workoutSessions:
userId + status + startedAt
```

The exact Firestore index file should be generated from actual queries rather than creating unnecessary indexes.

---

# 71. DATA VALIDATION

All incoming data must be validated.

Use Zod schemas.

Example:

```typescript
const workoutSetSchema = z.object({
  weight: z.number().min(0).optional(),
  reps: z.number().int().min(0).optional(),
  completed: z.boolean()
});
```

Validation should happen before persistence.

---

# 72. DATA NORMALIZATION

Keep reusable entities normalized.

Do not store the complete exercise definition inside every workout set.

Instead:

```text
workoutSet
 ↓
exerciseId
 ↓
exercise
```

However, historical session data should preserve enough information to remain understandable even if the current exercise definition changes.

---

# 73. CACHING

Cache locally:

* Active split
* Current workout
* Exercise library
* Recent workout history
* Previous performance
* User settings

The Home screen should be able to render using local data.

---

# 74. DATA RETENTION

Completed workouts should remain indefinitely unless the user deletes them or deletes their account.

The app should not automatically delete old workout history.

---

# 75. CORE DATA INTEGRITY RULES

Repshade must never:

1. Advance the split because a date changed.
2. Advance the split twice for one workout.
3. Delete historical data because a template changed.
4. Lose an active workout when the app closes.
5. Require internet to save a set.
6. Overwrite unsynchronized local workout data silently.
7. Create duplicate workouts during sync.
8. Create duplicate PRs during retry.
9. Allow one user to access another user's data.

---

# 76. RECOMMENDED DATA ARCHITECTURE

```text
                    REPSHADE
                       │
              ┌────────┴────────┐
              │                 │
           LOCAL              CLOUD
              │                 │
            SQLite           Firestore
              │                 │
              └───────┬─────────┘
                      │
                 SYNC ENGINE
                      │
                 SYNC QUEUE
                      │
                 CONFLICT RULES
```

---

# 77. SOURCE OF TRUTH

### During active workout

SQLite + Zustand

### Immediately after workout

SQLite

### After synchronization

SQLite + Firebase represent the same state

### For authentication

Firebase Authentication

### For historical cloud backup

Firestore

---

# 78. FINAL DATA PRINCIPLE

The data architecture must preserve the difference between:

PROGRAM

"What I planned to do."

SESSION

"What I actually did."

CALENDAR

"When I did it."

SPLIT POSITION

"What I should do next."

These are separate concepts and must remain separate in the data model.

---

# 79. FINAL DATA FLOW

```text
                    USER
                     │
                     ▼
                   UI
                     │
                     ▼
                 ZUSTAND
                     │
                     ▼
               DOMAIN LOGIC
                     │
                     ▼
                REPOSITORY
                     │
                     ▼
                  SQLITE
                     │
              ┌──────┴──────┐
              │             │
              ▼             ▼
          IMMEDIATE       SYNC QUEUE
          UI UPDATE          │
                             ▼
                          FIREBASE
                             │
                             ▼
                         FIRESTORE
```

