# REP SHADE — TESTING & QA SPECIFICATION

**Document:** Doc 12
**Product:** Repshade
**Mantra:** TRAIN. LOG. PROGRESS. REPEAT.
**Document Type:** Testing & Quality Assurance Specification
**Status:** Final QA Specification
**Purpose:** Define the complete testing, validation, regression, and release process for the Repshade MVP.

---

# 1. DOCUMENT PURPOSE

This document defines the quality assurance strategy for Repshade from development through final MVP release.

The purpose of QA is not only to verify that screens work visually, but to verify that:

* Workout data is correct.
* The rolling split behaves correctly.
* Offline workouts remain fully functional.
* Historical workout records remain stable.
* Sync does not create duplicates or corrupt data.
* Progress and PR calculations are deterministic.
* User data remains isolated and secure.
* The application performs reliably on supported devices.
* The UI remains consistent with the Repshade design system.
* Critical user journeys work from beginning to end.

The QA process must protect the core product principles of Repshade.

---

# 2. CORE QUALITY INVARIANTS

The following rules are release-critical.

## 2.1 Rolling Split Invariant

Repshade follows the user's training sequence, not the calendar.

> The calendar tells you when you trained. Your split tells you what you train next.

Therefore:

1. Completing a planned workout advances the split.
2. Intentionally skipping a planned workout advances the split.
3. Missing a calendar day does not advance the split.
4. Opening a workout does not advance the split.
5. Starting and abandoning a workout does not advance the split.
6. Quick Workout does not advance the planned split by default.
7. A workout can advance the split only once.
8. Duplicate completion attempts must never advance the split twice.

These rules are P0 business rules.

---

# 3. LOCAL-FIRST INVARIANT

The active workout must not depend on Firebase availability.

The user must be able to:

* Open the app offline.
* View the current plan offline.
* Start a workout offline.
* View previous performance offline.
* Log sets offline.
* Pause/resume offline.
* Complete a workout offline.
* View saved history offline.

Local SQLite is the source used by the workout engine during active use.

Firebase is the cloud persistence and synchronization layer, not the workout engine.

---

# 4. HISTORICAL DATA INVARIANT

Historical workout records must remain stable.

Testing must verify that:

* Completed sessions are not altered by future template edits.
* Workout session snapshots preserve historical information.
* Previous performance reflects the actual historical session.
* Exercise/template modifications do not rewrite old sessions.
* Deleted or modified templates do not destroy completed workout history.

---

# 5. QA OBJECTIVES

QA must verify five major areas.

## 5.1 Functional correctness

Every feature performs its intended behavior.

## 5.2 Business-rule correctness

Core Repshade logic behaves exactly as specified.

## 5.3 Data integrity

No duplicate, missing, corrupted, or contradictory records are introduced.

## 5.4 Reliability

The application continues functioning during:

* Offline conditions
* App termination
* Network interruption
* Sync failures
* Background/foreground transitions
* Unexpected interruptions

## 5.5 User experience quality

The product remains:

* Simple
* Fast
* Calm
* Premium
* Focused
* Accessible
* Consistent

---

# 6. TESTING STRATEGY

Repshade should use four primary testing levels.

```text
Unit Tests
    ↓
Integration Tests
    ↓
End-to-End Tests
    ↓
Manual QA / UAT
```

Additional specialized testing:

```text
Data Integrity
Offline / Recovery
Synchronization
Security
Accessibility
Performance
Visual / UI Regression
Device Compatibility
Release Validation
```

---

# 7. UNIT TESTING

Unit tests verify isolated business logic and utility functions.

Primary targets:

* splitEngine
* workoutEngine
* progressionEngine
* recordEngine
* validation schemas
* calculations
* date/time utilities
* unit conversion
* sync operation generation
* idempotency logic

---

# 8. SPLIT ENGINE UNIT TESTS

The split engine is one of the highest-priority testing areas.

## TEST-SPLIT-001 — Initial Split Position

**Given:** A newly configured Push → Pull → Legs split.

**When:** The user completes onboarding.

**Expected:**

```text
Current = Push
Next = Push
```

---

## TEST-SPLIT-002 — Completion Advances Split

**Given:**

```text
Push → Pull → Legs
Current = Push
```

**When:** Push is completed.

**Expected:**

```text
Current = Pull
Next planned workout = Pull
```

---

## TEST-SPLIT-003 — Missed Calendar Day

**Given:**

```text
Monday: Push completed
Tuesday: no workout
Wednesday: no workout
```

**Expected:**

```text
Next = Pull
```

The split must not advance because time passed.

---

## TEST-SPLIT-004 — Manual Skip

**Given:**

```text
Current = Push
```

**When:** User intentionally skips Push.

**Expected:**

```text
Current = Pull
```

---

## TEST-SPLIT-005 — Opening Workout

**Given:**

```text
Current = Push
```

**When:** User opens Push.

**Expected:**

```text
Current = Push
```

Opening must not advance the split.

---

## TEST-SPLIT-006 — Abandoned Workout

**Given:**

```text
Current = Push
```

**When:**

1. User starts Push.
2. Logs some sets.
3. Leaves/cancels the workout.

**Expected:**

```text
Current = Push
```

---

## TEST-SPLIT-007 — Quick Workout

**Given:**

```text
Planned = Push
```

**When:** User completes a Quick Workout.

**Expected:**

```text
Planned split remains Push.
Quick Workout is recorded separately.
```

---

## TEST-SPLIT-008 — Completion Idempotency

**Given:**

```text
Current = Push
```

**When:** The same completion operation is submitted twice.

**Expected:**

```text
Push → Pull
```

not:

```text
Push → Legs
```

The split must advance exactly once.

---

## TEST-SPLIT-009 — Multiple Consecutive Completions

Verify:

```text
Push completed → Pull
Pull completed → Legs
Legs completed → Push
```

---

## TEST-SPLIT-010 — Split Reordering

Verify that changing the split order affects future progression correctly without corrupting historical workout records.

---

# 9. WORKOUT ENGINE TESTING

Test:

* Workout creation
* Workout start
* Exercise loading
* Set creation
* Set completion
* Pause
* Resume
* Cancellation
* Completion
* Summary generation
* Recovery
* Session restoration

---

# 10. START WORKOUT TESTS

Verify:

* Correct template loads.
* Correct exercises appear.
* Exercise order is preserved.
* Prescribed sets/reps are correct.
* Previous performance is loaded.
* Session receives a unique UUID.
* Start timestamp is recorded.
* Template snapshot is created.

Starting a workout must not advance the split.

---

# 11. SET LOGGING TESTS

For every set verify:

* Weight can be entered.
* Reps can be entered.
* Optional notes can be stored if supported.
* Set status changes correctly.
* Completed sets remain completed.
* Weight is stored internally in kilograms.
* User-selected units are used only for display.
* Invalid values are rejected.
* Values survive app backgrounding.
* Values survive temporary connectivity loss.

---

# 12. VOLUME CALCULATION TESTS

For included sets:

```text
Volume = Weight × Reps
```

Example:

```text
80 kg × 8 reps = 640 kg
```

Verify:

* Single-set volume.
* Exercise volume.
* Workout volume.
* Multiple-set accumulation.
* Decimal weights.
* Unit conversion.
* Excluded/inapplicable sets if such functionality exists.

Calculations must be deterministic.

---

# 13. PREVIOUS PERFORMANCE TESTING

Verify that previous performance:

* Comes from local SQLite.
* Uses the correct exercise.
* Uses the correct historical session.
* Displays correct weights.
* Displays correct reps.
* Does not depend on Firebase.
* Does not change after template editing.
* Handles exercises with no previous history.

---

# 14. PAUSE / RESUME TESTING

Verify:

1. Start workout.
2. Pause.
3. Leave screen.
4. Reopen.
5. Resume.

Expected:

* Session remains intact.
* Logged sets remain intact.
* Workout state is preserved.
* Timer state behaves correctly.
* No duplicate session is created.

---

# 15. WORKOUT ABANDONMENT TESTING

Test:

* User starts workout and exits.
* User starts workout and cancels.
* User starts workout and kills app.
* User starts workout and loses connectivity.

Expected:

* No accidental split advancement.
* Logged local data is preserved where appropriate.
* Session recovery behavior is deterministic.
* User is not incorrectly told that the workout was completed.

---

# 16. COMPLETION TESTING

Completion is a P0 operation.

Verify:

1. Session completion is recorded.
2. Completion timestamp is recorded.
3. Workout summary is generated.
4. Volume is correct.
5. Exercise count is correct.
6. Set count is correct.
7. PR detection runs.
8. Historical snapshot is preserved.
9. Split advancement occurs exactly once.
10. Sync operation is created.
11. Duplicate completion is prevented.

---

# 17. QUICK WORKOUT TESTING

Quick Workout must remain separate from the planned split.

Test:

```text
Quick Workout
    ↓
Complete
    ↓
Save session
    ↓
Do NOT advance planned split
```

Verify:

* Workout is recorded.
* History displays it correctly.
* Progress can include it where appropriate.
* Planned split remains unchanged.
* Repeated Quick Workouts do not affect planned progression.

---

# 18. PERSONAL RECORD TESTING

PR calculations must be deterministic.

Test:

* First recorded performance.
* Heavier weight.
* Same weight with more reps.
* Lower weight.
* Different rep counts.
* Multiple sets.
* Historical records.
* Duplicate submissions.

A PR must never appear or disappear randomly based on sync timing.

---

# 19. INTEGRATION TESTING

Integration tests verify interactions between multiple application layers.

Priority integrations:

```text
UI
 ↓
Zustand
 ↓
Domain Engine
 ↓
Repository
 ↓
SQLite
```

And:

```text
SQLite
 ↓
Sync Queue
 ↓
Firebase
```

Test:

* Store ↔ domain engine.
* Domain engine ↔ repository.
* Repository ↔ SQLite.
* SQLite ↔ sync queue.
* Sync queue ↔ Firebase.
* Authentication ↔ user data.
* History ↔ workout records.
* Progress ↔ workout history.

---

# 20. DATABASE TESTING

Verify all major entities.

Expected local entities include:

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

Test:

* Create.
* Read.
* Update.
* Delete.
* Foreign-key relationships where applicable.
* Unique identifiers.
* Required fields.
* Null handling.
* Transaction behavior.
* Migration behavior.

---

# 21. DATA INTEGRITY TESTING

The following must never occur:

* Duplicate workout session.
* Duplicate workout set.
* Duplicate split advancement.
* Workout linked to wrong template.
* Workout linked to wrong user.
* Incorrect exercise association.
* Incorrect volume.
* Incorrect PR.
* Incorrect previous performance.
* Historical record mutation.
* Lost offline workout.

---

# 22. TRANSACTION TESTING

Critical multi-step operations must be transactional where required.

Example:

```text
Complete Workout
      ↓
Save completion
      ↓
Advance split
      ↓
Create sync operation
```

Test failure scenarios between each stage.

The application must not enter an inconsistent state such as:

```text
Workout completed
but split not advanced
```

or:

```text
Split advanced
but workout not completed
```

unless the architecture intentionally supports a recoverable intermediate state.

---

# 23. OFFLINE TESTING

Offline support is a core product requirement.

The following scenarios are mandatory.

## OFFLINE-001 — Launch Offline

Expected:

* App opens.
* Local user/session state loads.
* Home loads.
* Plan loads.
* No blocking Firebase error.

---

## OFFLINE-002 — Start Workout Offline

Expected:

* Workout starts normally.
* Template is loaded locally.
* Previous performance is available locally.

---

## OFFLINE-003 — Log Sets Offline

Expected:

* Sets save immediately.
* UI updates immediately.
* No network dependency.

---

## OFFLINE-004 — Complete Workout Offline

Expected:

* Workout completes.
* Summary is generated.
* Split advances.
* Local history updates.
* Sync operation is queued.

---

## OFFLINE-005 — Kill App During Workout

Procedure:

1. Start workout.
2. Log multiple sets.
3. Force-close app.
4. Reopen.

Expected:

* Active session is recoverable according to the defined recovery behavior.
* No logged data is silently lost.
* No duplicate session is created.

---

## OFFLINE-006 — Reconnect

Procedure:

1. Complete workout offline.
2. Restore internet.
3. Trigger synchronization.

Expected:

```text
SQLite
 ↓
Sync Queue
 ↓
Firebase
```

Data becomes synchronized without duplicates.

---

# 24. OFFLINE STATE UX TESTING

Verify messaging for:

### Offline

```text
You're offline.
Your workout is saved on this device.
```

### Syncing

```text
Syncing...
```

### Synced

```text
Synced
```

### Sync Error

```text
Couldn't sync.
Your workout is still safely saved on this device.
```

The user must never believe their workout disappeared because Firebase is unavailable.

---

# 25. SYNC TESTING

Every sync operation must be tested for:

```text
CREATE
UPDATE
DELETE
```

Test:

* Successful sync.
* Failed sync.
* Retry.
* Network interruption.
* App termination during sync.
* Duplicate operation.
* Repeated retry.
* Partial failure.
* Conflict.
* Authentication expiration.
* Reauthentication.

---

# 26. SYNC IDEMPOTENCY TESTING

Idempotency is mandatory.

Example:

```text
Local completion ID = ABC123
```

If the same operation is submitted:

```text
1st attempt → accepted
2nd attempt → ignored/deduplicated
3rd attempt → ignored/deduplicated
```

Expected cloud state:

```text
ONE workout
ONE completion
ONE split advancement
```

Never:

```text
THREE workouts
THREE split advancements
```

---

# 27. SYNC RETRY TESTING

Test:

```text
Offline
 ↓
Operation queued
 ↓
Reconnect
 ↓
Sync attempt fails
 ↓
Retry
 ↓
Success
```

Verify:

* Operation remains queued after failure.
* Retry does not create duplicates.
* Successful operation is marked complete/removed according to implementation.
* User data remains locally safe.

---

# 28. SYNC CONFLICT TESTING

Potential conflict scenarios:

* Same record changed locally and remotely.
* Template changed on another device.
* Settings changed on two devices.
* Workout record submitted more than once.
* Delete arrives after update.
* Update arrives after delete.

Conflict resolution must be deterministic and documented.

Historical completed workout records should receive special protection against unintended mutation.

---

# 29. AUTHENTICATION TESTING

Test:

* Sign up.
* Sign in.
* Sign out.
* Invalid credentials.
* Password reset.
* Expired authentication state.
* Reauthentication.
* Offline launch after previous authentication.
* Account switching.
* User data isolation.

---

# 30. USER DATA ISOLATION

User A must never access:

* User B's workouts.
* User B's templates.
* User B's history.
* User B's settings.
* User B's progress.
* User B's sync operations.

Test both application behavior and Firestore security rules.

---

# 31. FIRESTORE SECURITY RULE TESTING

Verify:

* Authenticated users can access only their own data.
* Unauthenticated users cannot access private user data.
* User A cannot read User B's records.
* User A cannot write to User B's records.
* User A cannot delete User B's records.
* Invalid document paths are rejected.
* Unauthorized updates are rejected.

Security rules must be tested independently and through integration tests.

---

# 32. UI TESTING

Every major screen must be tested for:

* Correct rendering.
* Correct navigation.
* Correct content.
* Correct interaction.
* Correct loading state.
* Correct empty state.
* Correct error state.
* Correct offline state.
* Correct success state.
* Correct dark theme.
* Correct light theme.
* Device-size adaptability.

---

# 33. NAVIGATION TESTING

Verify all primary routes:

```text
Home
Plan
Progress
History
Profile
```

Test:

* Tab switching.
* Deep navigation.
* Back navigation.
* Modal dismissal.
* Workout navigation.
* Returning from workout.
* App restart on nested route.
* Authentication redirects.
* Onboarding completion redirects.

No route should lead to a dead end.

---

# 34. FORM TESTING

Forms must validate:

* Required fields.
* Invalid values.
* Empty values.
* Boundary values.
* Decimal values where applicable.
* Extremely large values.
* Keyboard behavior.
* Submission states.
* Error messages.
* Recovery after validation failure.

Zod validation rules must match actual UI requirements.

---

# 35. EMPTY STATE TESTING

Test empty states for:

* No workouts.
* No history.
* No progress.
* No personal records.
* No exercise history.
* Empty exercise library.
* No custom exercises.
* No previous performance.

Empty states must guide the user toward the next useful action without unnecessary decoration.

---

# 36. ERROR STATE TESTING

Test:

* Firebase unavailable.
* Firestore permission denied.
* Authentication failure.
* SQLite failure.
* Sync failure.
* Invalid data.
* Network timeout.
* Unexpected API/service failure.

Errors should:

* Explain what happened when useful.
* Preserve user data.
* Provide recovery where possible.
* Avoid technical jargon.
* Never falsely indicate that a workout was lost.

---

# 37. THEME TESTING

Test both:

```text
Dark
Light
```

Verify:

* Background colors.
* Text hierarchy.
* Borders.
* Accent colors.
* Icons.
* Buttons.
* Inputs.
* Charts.
* Modals.
* Navigation.
* Offline states.
* Error states.

Dark Performance is the primary visual direction, but the light theme must remain functional and readable.

---

# 38. DESIGN SYSTEM VALIDATION

Verify adherence to the established tokens.

### Primary background

```text
#0B0D0F
```

### Secondary background

```text
#121519
```

### Primary text

```text
#F5F7F8
```

### Secondary text

```text
#A8B0B7
```

### Primary accent

```text
#B8F34A
```

Components must not introduce arbitrary colors without design-system justification.

---

# 39. ACCESSIBILITY TESTING

## 39.1 Touch targets

Minimum:

```text
44 × 44 px
```

Verify especially:

* Set completion controls.
* Navigation.
* Back buttons.
* Timer controls.
* Add buttons.
* Form controls.

---

## 39.2 Contrast

Verify sufficient contrast for:

* Primary text.
* Secondary text.
* Buttons.
* Error states.
* Warning states.
* Success states.
* Disabled states.

---

## 39.3 Screen readers

Verify that important controls have meaningful labels.

Examples:

```text
Complete set
Pause workout
Resume workout
Start workout
Finish workout
Skip workout
Start rest timer
```

Icons must not be the only indication of meaning.

---

## 39.4 Dynamic text

Test larger system font sizes.

Verify:

* No clipping.
* No overlapping.
* No inaccessible buttons.
* No broken layouts.
* Important values remain readable.

---

## 39.5 Color-independent status

Status must not rely only on color.

For example:

```text
✓ Completed
PR
Offline
Syncing
Error
```

should remain understandable without color perception.

---

# 40. PERFORMANCE TESTING

Performance must be evaluated on realistic mobile hardware.

Primary areas:

* App startup.
* Home screen.
* Plan loading.
* Active workout.
* Set completion.
* Rest timer.
* History.
* Progress charts.
* SQLite queries.
* Exercise search.
* Sync.

---

# 41. ACTIVE WORKOUT PERFORMANCE

The Active Workout screen is the highest-priority performance surface.

Verify:

* Smooth scrolling.
* Fast set logging.
* No noticeable lag after completing a set.
* No unnecessary re-renders.
* Timer remains responsive.
* Keyboard interactions remain smooth.
* Previous performance loads quickly.
* Large workouts remain usable.

The workout logging experience should feel immediate.

---

# 42. SQLITE PERFORMANCE

Test with realistic data volumes.

Example scenarios:

```text
100 workouts
500 workouts
1,000+ workouts
```

Test:

* History query.
* Exercise history query.
* Previous performance query.
* Progress calculations.
* PR calculations.
* Workout loading.

Queries should remain performant as history grows.

---

# 43. EXERCISE LIBRARY PERFORMANCE

Test with a realistic exercise library.

Verify:

* Search response.
* Filtering.
* Scrolling.
* Exercise selection.
* Custom exercise insertion.
* Duplicate handling.

---

# 44. SYNC PERFORMANCE

Test:

* Small queue.
* Medium queue.
* Large offline queue.
* Reconnect after several days.
* Multiple operations on the same entity.
* Retry-heavy scenarios.

Sync must not block the active workout.

---

# 45. DEVICE COMPATIBILITY MATRIX

Minimum reasonable coverage should include:

## Android

Test at least:

* Low/mid-range Android phone.
* Modern mid-range Android phone.
* Modern flagship Android phone.
* Small screen.
* Large screen.
* Android with larger system font.

Suggested OS coverage:

```text
Android 10+
Current supported Expo/React Native Android versions
```

Actual release support should follow the Expo/React Native compatibility matrix used by the project.

---

## iOS

Test at least:

* Older supported iPhone.
* Current-generation iPhone.
* Small-screen iPhone.
* Large-screen iPhone.
* Larger accessibility text settings.

---

# 46. ORIENTATION TESTING

If Repshade is portrait-only:

* Verify orientation is locked appropriately.
* Verify no broken layouts occur during orientation changes.

If landscape is supported:

* Test all major screens in both orientations.

---

# 47. NETWORK TEST MATRIX

Test the application under:

```text
Full connectivity
Wi-Fi
Mobile data
Slow network
Intermittent network
No network
Network restored
Network switching
```

The active workout must remain functional under all network conditions.

---

# 48. APP LIFECYCLE TESTING

Test:

* Foreground → background.
* Background → foreground.
* App termination.
* OS process termination.
* Device restart.
* Low-memory recovery.
* Network change while app is active.
* Authentication state restoration.

Special attention must be given to active workouts.

---

# 49. TIMER TESTING

Rest timer must be tested for:

* Start.
* Pause.
* Resume.
* Completion.
* Backgrounding.
* Foregrounding.
* App interruption.
* Notification behavior if enabled.
* Multiple timer starts.
* Accidental duplicate timers.

Timer state must never cause workout state corruption.

---

# 50. NOTIFICATION TESTING

Test:

* Notification permission granted.
* Permission denied.
* Permission later enabled.
* Reminder scheduling.
* Reminder cancellation.
* Multiple reminders.
* App restart.
* Time-zone changes.
* Notification interaction.

Notifications must remain secondary to the workout experience.

---

# 51. HISTORY TESTING

Verify:

* Workout list.
* Calendar.
* Workout details.
* Exercise-level history.
* Correct dates.
* Correct durations.
* Correct volume.
* Correct exercises.
* Correct sets.
* Correct PR indicators.

Historical data must remain stable.

---

# 52. PROGRESS TESTING

Verify:

* Weight trends.
* Rep trends.
* Volume.
* Exercise progress.
* Personal records.
* Historical performance.

Test:

* No history.
* One workout.
* Multiple workouts.
* Large history.
* Missing values.
* Decimal weights.
* Different units.

---

# 53. UNIT CONVERSION TESTING

Internal storage:

```text
Kilograms
```

Display:

```text
User-selected unit
```

Test:

* kg display.
* lb display.
* Switching units.
* Existing history after unit change.
* Decimal values.
* Rounding behavior.

Changing display units must not alter stored workout data.

---

# 54. REGRESSION TESTING

Regression testing must be performed after any change to:

* Split logic.
* Workout completion.
* Database schema.
* Sync logic.
* Authentication.
* Templates.
* History.
* Progress calculations.
* Navigation.
* Active workout UI.

At minimum, regression must cover:

```text
Launch
Login
Home
Plan
Start Workout
Log Set
Complete Set
Rest Timer
Pause
Resume
Finish
Summary
History
Progress
Profile
Offline
Sync
```

---

# 55. P0 REGRESSION CHECKLIST

Before every release candidate, verify:

* [ ] App launches.
* [ ] User can authenticate.
* [ ] Home loads.
* [ ] Correct next workout appears.
* [ ] Split follows completed workouts.
* [ ] Missed days do not advance split.
* [ ] Manual skip advances split.
* [ ] Opening workout does not advance split.
* [ ] Abandoned workout does not advance split.
* [ ] Quick Workout does not advance split.
* [ ] Sets can be logged.
* [ ] Previous performance is correct.
* [ ] Workout can be completed offline.
* [ ] Completion advances split exactly once.
* [ ] Duplicate completion is prevented.
* [ ] History remains correct.
* [ ] Template snapshot remains stable.
* [ ] Sync works.
* [ ] Sync retry works.
* [ ] No duplicate cloud records are created.
* [ ] Firestore user isolation works.

Any failure in a P0 item blocks release.

---

# 56. USER ACCEPTANCE TESTING

UAT should simulate real user behavior rather than isolated technical tests.

## UAT-001 — New User Setup

1. Install app.
2. Open app.
3. Create account.
4. Complete onboarding.
5. Choose split.
6. Configure workout.
7. Add exercises.
8. Finish setup.
9. Verify Home.

Expected: User reaches a usable workout plan without confusion.

---

## UAT-002 — First Planned Workout

1. Open Home.
2. View Next Workout.
3. Start workout.
4. Review exercises.
5. Log sets.
6. Use rest timer.
7. Finish workout.
8. View summary.

Expected: Complete workout flow works without unnecessary friction.

---

## UAT-003 — Rolling Split

1. Complete Push.
2. Skip the next calendar day.
3. Open app later.
4. Verify Pull remains next.

Expected:

```text
Next = Pull
```

---

## UAT-004 — Manual Skip

1. View planned workout.
2. Choose Skip.
3. Confirm.
4. Return Home.

Expected:

```text
Next workout = following split item
```

---

## UAT-005 — Quick Workout

1. Start Quick Workout.
2. Log exercise.
3. Complete.
4. Return Home.

Expected:

```text
Quick Workout recorded.
Planned split unchanged.
```

---

## UAT-006 — Offline Workout

1. Disable internet.
2. Open app.
3. Start planned workout.
4. Log sets.
5. Complete workout.
6. View history.
7. Reconnect internet.
8. Allow sync.
9. Verify cloud data.

Expected: No data loss and no duplicates.

---

## UAT-007 — Historical Template Stability

1. Complete workout using Template A.
2. Modify Template A.
3. Open historical workout.

Expected:

Historical workout still represents the original completed session.

---

## UAT-008 — Duplicate Completion

1. Complete workout.
2. Trigger completion operation again.
3. Refresh.
4. Sync.

Expected:

Exactly one completed session and one split advancement.

---

# 57. BUG SEVERITY

## P0 — Critical

Blocks release.

Examples:

* App cannot launch.
* Workout cannot be completed.
* Workout data is lost.
* Split advances incorrectly.
* Duplicate completion advances split twice.
* Offline workout fails.
* User can access another user's data.
* Historical data is corrupted.
* Critical sync corruption.

---

## P1 — High

Major functionality is broken but a limited workaround may exist.

Examples:

* History incorrect for some cases.
* Progress calculations wrong.
* Authentication recovery broken.
* Major navigation path broken.
* Sync retry consistently fails.

P1 bugs normally block MVP release unless explicitly accepted by the product owner.

---

## P2 — Medium

Functionality works but has meaningful defects.

Examples:

* Minor calculation display issue.
* Non-critical UI state issue.
* Some device-specific layout problem.
* Minor sync status problem.

May be deferred with approval.

---

## P3 — Low

Minor polish issue.

Examples:

* Small spacing inconsistency.
* Minor visual alignment.
* Non-critical copy issue.

Does not normally block release.

---

# 58. BUG REPORT FORMAT

Every bug should contain:

```text
Bug ID:
Title:
Severity:
Environment:
Device:
OS:
App Version:
Build:
Preconditions:

Steps to Reproduce:
1.
2.
3.

Expected Result:

Actual Result:

Reproducibility:

Screenshots / Video:

Logs:

Related Feature:

Regression Risk:

Status:
```

---

# 59. TEST DATA REQUIREMENTS

Create deterministic test fixtures for:

### Users

```text
New user
Existing user
Offline user
Multi-device user
```

### Splits

```text
Push / Pull / Legs
Upper / Lower
Custom split
Single-workout split
Large split
```

### Workouts

```text
Empty workout
Small workout
Normal workout
Large workout
Completed workout
Abandoned workout
Quick Workout
```

### History

```text
No history
1 session
10 sessions
100+ sessions
```

---

# 60. DATA RESET STRATEGY

Test environments should support resetting:

* Local SQLite database.
* Firebase test data.
* Authentication users.
* Sync queue.
* Workout history.
* Templates.

Production data must never be used as disposable test data.

---

# 61. AUTOMATED TEST SUITE

The automated suite should cover at minimum:

```text
splitEngine
workoutEngine
progressionEngine
recordEngine
volume calculations
unit conversion
validation
sync operation generation
idempotency
```

The most important business rules should have automated regression tests so future changes cannot silently break them.

---

# 62. E2E TEST SUITE

Critical E2E journeys:

```text
E2E-001 New user onboarding
E2E-002 Sign in
E2E-003 Start planned workout
E2E-004 Log sets
E2E-005 Rest timer
E2E-006 Pause/resume
E2E-007 Complete workout
E2E-008 Manual skip
E2E-009 Quick Workout
E2E-010 History
E2E-011 Progress
E2E-012 Offline workout
E2E-013 Reconnect and sync
E2E-014 Duplicate completion
E2E-015 Template modification
E2E-016 Sign out/sign in
```

---

# 63. VISUAL QA

Visual QA must compare implementation against the locked Stitch designs.

Check:

* Layout.
* Spacing.
* Typography.
* Colors.
* Iconography.
* Button dimensions.
* Border radius.
* Component hierarchy.
* Navigation.
* Empty states.
* Loading states.
* Error states.
* Dark/light themes.

The implementation should not introduce unnecessary visual complexity.

---

# 64. ACTIVE WORKOUT VISUAL QA

The Active Workout screen receives special review.

Verify visual hierarchy:

```text
Current Exercise
        ↓
Previous Performance
        ↓
Set Inputs
        ↓
Complete Set
        ↓
Rest
        ↓
Next Exercise
```

The user should immediately understand:

1. What exercise they are doing.
2. What they did previously.
3. What they need to enter.
4. How to complete the set.
5. What happens next.

---

# 65. RESPONSIVE LAYOUT TESTING

Test:

* Small phones.
* Standard phones.
* Large phones.
* Different aspect ratios.
* Safe areas.
* Notches.
* Dynamic Island areas.
* Different text sizes.

No important control should be pushed below an unusable region or clipped by device UI.

---

# 66. ACCESSIBILITY RELEASE CHECK

Before release:

* [ ] Touch targets meet minimum size.
* [ ] Text contrast is acceptable.
* [ ] Interactive controls have labels.
* [ ] Status does not depend only on color.
* [ ] Dynamic text does not break layouts.
* [ ] Focus/navigation order is logical.
* [ ] Screen-reader users can complete the core workout journey.

---

# 67. SECURITY QA CHECKLIST

* [ ] Firebase Authentication configured correctly.
* [ ] Firestore security rules tested.
* [ ] User-scoped data enforced.
* [ ] No credentials committed to source control.
* [ ] No production secrets exposed in client code.
* [ ] No sensitive information logged unnecessarily.
* [ ] Authentication errors do not expose sensitive information.
* [ ] Unauthorized Firestore operations are rejected.
* [ ] Local data handling reviewed.
* [ ] Debug logging disabled or appropriately restricted for production.

---

# 68. PERFORMANCE RELEASE CHECKLIST

* [ ] App startup acceptable.
* [ ] Home loads quickly.
* [ ] Plan loads quickly.
* [ ] Active Workout remains responsive.
* [ ] Set completion has no noticeable lag.
* [ ] Timer remains responsive.
* [ ] History handles realistic data.
* [ ] Exercise library search is responsive.
* [ ] Progress charts remain usable.
* [ ] SQLite queries remain performant.
* [ ] Sync does not block user interaction.
* [ ] Large offline queues remain manageable.

---

# 69. FINAL REGRESSION MATRIX

Before final MVP release, run the following:

| Area                 | P0 | P1 | P2 | Status |
| -------------------- | -- | -- | -- | ------ |
| Authentication       | ✓  | ✓  | ✓  |        |
| Onboarding           | ✓  | ✓  | ✓  |        |
| Home                 | ✓  | ✓  | ✓  |        |
| Plan                 | ✓  | ✓  | ✓  |        |
| Rolling Split        | ✓  | ✓  | ✓  |        |
| Workout Start        | ✓  | ✓  | ✓  |        |
| Set Logging          | ✓  | ✓  | ✓  |        |
| Previous Performance | ✓  | ✓  |    |        |
| Rest Timer           | ✓  | ✓  | ✓  |        |
| Pause/Resume         | ✓  | ✓  |    |        |
| Completion           | ✓  | ✓  | ✓  |        |
| Summary              | ✓  | ✓  | ✓  |        |
| Manual Skip          | ✓  | ✓  |    |        |
| Quick Workout        | ✓  | ✓  |    |        |
| History              | ✓  | ✓  | ✓  |        |
| Progress             | ✓  | ✓  | ✓  |        |
| PRs                  | ✓  | ✓  |    |        |
| Offline              | ✓  | ✓  |    |        |
| Sync                 | ✓  | ✓  |    |        |
| Firebase Security    | ✓  | ✓  |    |        |
| Settings             |    | ✓  | ✓  |        |
| Notifications        |    | ✓  | ✓  |        |
| Accessibility        | ✓  | ✓  | ✓  |        |
| Performance          | ✓  | ✓  | ✓  |        |
| Visual QA            |    | ✓  | ✓  |        |

---

# 70. MVP ACCEPTANCE CRITERIA

The Repshade MVP is considered functionally acceptable only when all of the following are true.

## Core workout

* User can create/configure a workout split.
* User can start a planned workout.
* User can log sets.
* User can pause/resume.
* User can complete a workout.
* User can see a workout summary.
* User can view history.

## Rolling Split

* Completed workouts advance the split.
* Intentionally skipped workouts advance the split.
* Missed days do not advance the split.
* Opening workouts does not advance the split.
* Abandoned workouts do not advance the split.
* Quick Workout does not advance the planned split.
* Duplicate completion cannot advance the split twice.

## Offline

* Core workout functionality works without internet.
* Data is saved locally.
* Active workout is not blocked by Firebase.
* Offline completion creates a sync operation.
* Reconnection synchronizes successfully.

## Historical data

* Completed sessions retain their historical state.
* Template changes do not rewrite history.
* Previous performance remains correct.

## Progress

* Volume is calculated correctly.
* Exercise progress is displayed correctly.
* PR calculations are deterministic.
* Historical performance is accurate.

## Security

* Users can access only their own cloud data.
* Firestore rules prevent unauthorized access.

## UX

* Core navigation works.
* Loading states work.
* Empty states work.
* Error states work.
* Offline states work.
* Dark theme works.
* Light theme works.
* Accessibility requirements are met.

---

# 71. RELEASE BLOCKERS

The MVP must NOT be released if any unresolved P0 issue exists.

The following automatically block release:

```text
Data loss
Incorrect split advancement
Duplicate split advancement
Duplicate workout records
Broken offline workout
Historical data corruption
Incorrect user data isolation
Critical authentication failure
Critical sync corruption
App cannot launch
Core workout cannot be completed
```

---

# 72. RELEASE CANDIDATE PROCESS

Before producing the final build:

```text
Feature Complete
      ↓
Automated Tests
      ↓
Integration Tests
      ↓
E2E Tests
      ↓
Manual QA
      ↓
Offline Testing
      ↓
Sync Testing
      ↓
Security Testing
      ↓
Accessibility Testing
      ↓
Performance Testing
      ↓
Visual QA
      ↓
Regression Testing
      ↓
UAT
      ↓
Release Candidate
      ↓
Final Smoke Test
      ↓
MVP Release
```

---

# 73. FINAL SMOKE TEST

Immediately before release, perform one clean end-to-end smoke test.

### Flow

```text
Install
 ↓
Launch
 ↓
Create account
 ↓
Onboarding
 ↓
Configure split
 ↓
Configure workout
 ↓
Home
 ↓
Start workout
 ↓
Log sets
 ↓
Rest
 ↓
Complete workout
 ↓
Summary
 ↓
History
 ↓
Progress
 ↓
Sign out
 ↓
Sign in
 ↓
Verify data
```

Then perform:

```text
Offline
 ↓
Start workout
 ↓
Log sets
 ↓
Complete
 ↓
Reconnect
 ↓
Sync
 ↓
Verify cloud data
```

Finally verify:

```text
No duplicate session
No duplicate split advancement
No historical mutation
```

---

# 74. FINAL RELEASE SIGN-OFF

The MVP may be signed off only when:

### Functional

* [ ] All P0 requirements pass.
* [ ] All critical P1 requirements pass or have explicit acceptance.
* [ ] Core user journeys pass.

### Business Rules

* [ ] Rolling Split verified.
* [ ] Missed-day behavior verified.
* [ ] Manual skip verified.
* [ ] Quick Workout behavior verified.
* [ ] Duplicate completion prevention verified.

### Data

* [ ] SQLite verified.
* [ ] Historical snapshots verified.
* [ ] Volume verified.
* [ ] PR calculations verified.
* [ ] Previous performance verified.

### Offline

* [ ] Offline launch verified.
* [ ] Offline workout verified.
* [ ] Offline completion verified.
* [ ] App-kill recovery verified.
* [ ] Reconnection verified.

### Sync

* [ ] CREATE verified.
* [ ] UPDATE verified.
* [ ] DELETE verified.
* [ ] Retry verified.
* [ ] Conflict behavior verified.
* [ ] Idempotency verified.
* [ ] Duplicate prevention verified.

### Security

* [ ] Authentication verified.
* [ ] Firestore rules verified.
* [ ] User isolation verified.
* [ ] Production secrets protected.

### UX

* [ ] Navigation verified.
* [ ] Forms verified.
* [ ] Empty states verified.
* [ ] Error states verified.
* [ ] Offline states verified.
* [ ] Dark theme verified.
* [ ] Light theme verified.
* [ ] Accessibility verified.

### Performance

* [ ] Startup acceptable.
* [ ] Active Workout responsive.
* [ ] SQLite performance acceptable.
* [ ] History performance acceptable.
* [ ] Sync performance acceptable.

### Release

* [ ] Final regression completed.
* [ ] UAT completed.
* [ ] No unresolved P0 bugs.
* [ ] Release candidate validated.
* [ ] Production configuration reviewed.
* [ ] Final build generated.
* [ ] Final smoke test passed.

---

# 75. QUALITY GATE

The final Repshade MVP quality gate is:

```text
                    ┌──────────────────────┐
                    │   PRODUCT COMPLETE   │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ AUTOMATED TESTS PASS │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ INTEGRATION / E2E    │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ OFFLINE + SYNC PASS  │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ SECURITY PASS        │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ ACCESSIBILITY PASS   │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ PERFORMANCE PASS     │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ VISUAL QA PASS       │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ REGRESSION PASS      │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ UAT PASS             │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ RELEASE SIGN-OFF     │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │   REP SHADE MVP      │
                    └──────────────────────┘
```

---

# 76. NON-NEGOTIABLE QA PRINCIPLES

Throughout development and testing, the following principles must remain unchanged.

### Principle 1

> **Repshade follows the user's training sequence, not the calendar.**

### Principle 2

> **Only completed or intentionally skipped planned workouts advance the split.**

### Principle 3

> **Firebase is the cloud layer, not the workout engine.**

### Principle 4

> **The active workout must work offline.**

### Principle 5

> **Historical workout records must remain stable.**

### Principle 6

> **Duplicate operations must never produce duplicate outcomes.**

### Principle 7

> **User data must remain isolated and secure.**

### Principle 8

> **The workout experience is more important than secondary features.**

### Principle 9

> **QA must test real failure conditions, not only the happy path.**

### Principle 10

> **A feature is not complete until its offline, error, recovery, and regression behavior are verified.**

---

# 77. NEXT PROJECT PHASE

After this QA specification is reviewed and accepted, the project moves into the Stitch design phase.

The sequence is:

```text
DOC 12
Testing & QA Specification
        ↓
Documentation consistency review
        ↓
STITCH DESIGN PHASE
        ↓
Priority 1 core screens
        ↓
Priority 2 progress screens
        ↓
Priority 3 setup screens
        ↓
Priority 4 supporting screens
        ↓
Visual refinement
        ↓
Design lock
        ↓
ANTIGRAVITY IMPLEMENTATION
        ↓
QA EXECUTION
        ↓
FINAL MVP
```

