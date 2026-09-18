# REPSHADE — UX & USER FLOW SPECIFICATION

**Document:** 03 — UX & User Flow Specification
**Version:** 1.0
**Status:** UX Definition
**Product:** Repshade
**Platform:** iOS & Android

---

# 1. UX OBJECTIVE

The primary UX objective of Repshade is:

> The user should be able to open the app, understand what workout comes next, complete the workout, and record every set with minimal friction.

The ideal experience is:

OPEN → KNOW → TRAIN → LOG → FINISH → PROGRESS

The user should not need to navigate through multiple screens while actively training.

---

# 2. CORE UX PRINCIPLE

## The Calendar Is Not the Program

The calendar tells the user:

> When did I train?

The split tells the user:

> What should I train next?

The application must never confuse these two concepts.

---

# 3. INFORMATION ARCHITECTURE

Repshade uses five primary navigation destinations.

```text
HOME
│
├── Today's Workout
├── Continue Workout
├── Quick Workout
└── Workout Summary

PLAN
│
├── Current Split
├── Split Workouts
├── Workout Builder
├── Exercise Library
└── Exercise Editor

PROGRESS
│
├── Overview
├── Exercise Progress
├── Personal Records
└── Training Statistics

HISTORY
│
├── Calendar
├── Workout History
└── Workout Details

PROFILE
│
├── Account
├── Preferences
├── Units
├── Notifications
├── Appearance
├── Data & Backup
└── About
```

---

# 4. FIRST-TIME USER FLOW

```text
App Launch
    ↓
Welcome Screen
    ↓
Create Account / Continue
    ↓
Choose Workout Split
    ↓
Customize Split
    ↓
Review Program
    ↓
Create First Workout
    ↓
Home
    ↓
Start First Workout
```

---

# 5. WELCOME SCREEN

The first screen should be minimal.

### Content

REPSHADE

Train. Log. Progress. Repeat.

A short supporting statement:

> Track every set. Remember every workout. Keep progressing.

Primary CTA:

[ Get Started ]

Secondary:

[ I already have an account ]

The screen should not contain unnecessary information.

---

# 6. AUTHENTICATION FLOW

Options:

[ Continue with Google ]

[ Continue with Email ]

For returning users:

[ Sign In ]

Authentication should not dominate onboarding.

After successful authentication:

→ Continue to split selection if no split exists.

→ Continue to Home if the user already has a split.

---

# 7. SPLIT SELECTION

Screen title:

> Choose your split

Subtitle:

> You can customize everything later.

Display cards:

```text
PUSH / PULL / LEGS

3 Workouts
Simple and flexible

[Select]
```

```text
UPPER / LOWER

2 Workouts
Balanced training

[Select]
```

```text
FULL BODY

3 Workouts
Train your whole body

[Select]
```

```text
BRO SPLIT

5 Workouts
One major focus per workout

[Select]
```

```text
CUSTOM

Build your own

[Select]
```

---

# 8. CUSTOM SPLIT CREATION

After selecting Custom:

### Screen

MY SPLIT

Workout 1
Chest + Triceps

Workout 2
Back + Biceps

Workout 3
Legs

Workout 4
Shoulders

[ + Add Workout ]

[ Continue ]

The user can:

* Rename workouts
* Delete workouts
* Reorder workouts
* Add workouts
* Duplicate workouts

---

# 9. SPLIT REORDERING

Use drag-and-drop.

Example:

```text
☰ Chest + Triceps
☰ Back + Biceps
☰ Legs
☰ Shoulders
```

The interface should make the order visually obvious.

The order determines the rolling sequence.

---

# 10. WORKOUT BUILDER FLOW

```text
Plan
 ↓
Select Workout
 ↓
Edit Workout
 ↓
Add Exercise
 ↓
Configure Exercise
 ↓
Save
```

---

# 11. WORKOUT BUILDER SCREEN

Example:

```text
PUSH A

Chest • Shoulders • Triceps

EXERCISES

☰ Incline Press
   4 sets • 8–12 reps

☰ Chest Press
   3 sets • 8–12 reps

☰ Shoulder Press
   3 sets • 8–12 reps

☰ Lateral Raise
   3 sets • 12–15 reps

☰ Triceps Pushdown
   3 sets • 10–15 reps

[ + Add Exercise ]

[ Save Workout ]
```

---

# 12. ADD EXERCISE FLOW

User taps:

* Add Exercise

↓

Exercise Library opens.

Search field:

> Search exercises

Categories:

* Chest
* Back
* Shoulders
* Biceps
* Triceps
* Legs
* Core
* Cardio

User selects exercise.

↓

Exercise configuration appears.

---

# 13. EXERCISE CONFIGURATION

Example:

INCLINE PRESS

Sets:

4

Target Reps:

8–12

Rest:

120 sec

Set Type:

Normal

Optional:

RPE
RIR

[ Add Exercise ]

---

# 14. HOME SCREEN UX

The Home screen should be the most important screen after onboarding.

### Header

```text
Monday
14 September

Good morning
```

### Main workout card

```text
YOUR NEXT WORKOUT

PUSH A

Chest • Shoulders • Triceps

6 Exercises
18 Sets
~55 min

[ START WORKOUT ]
```

### Secondary information

```text
LAST WORKOUT

Pull A
12 September
48 min
```

### Progress preview

```text
THIS WEEK

4 workouts
72 sets
31,420 kg volume
```

---

# 15. HOME SCREEN STATES

The Home screen must support different states.

## State A — Normal

Show next workout.

## State B — Active Workout

Show:

CONTINUE WORKOUT

Push A

Started 32 minutes ago

[ CONTINUE ]

## State C — No Split

Show:

CREATE YOUR FIRST SPLIT

[ GET STARTED ]

## State D — Workout Completed

Show:

WORKOUT COMPLETE ✓

Next:

PULL

## State E — Planned Rest

Show:

REST DAY

Next workout:

PUSH

---

# 16. ACTIVE WORKOUT UX

The Active Workout screen is the highest-priority UX in Repshade.

The user should spend most of the workout inside this screen.

### Header

```text
PUSH A

54:32
```

Controls:

* Pause
* More
* Finish

---

# 17. EXERCISE CARD

Example:

```text
INCLINE PRESS

LAST SESSION
22.5 kg × 10
22.5 kg × 9
20 kg × 10

TODAY

SET   KG      REPS

1     22.5    10     ✓
2     22.5    9      ✓
3     22.5    __     ○
4     __      __     ○

+ Add Set
```

The current set should be visually obvious.

---

# 18. FAST SET LOGGING

The primary interaction should be:

Enter weight → Enter reps → Complete.

Avoid opening a separate screen for every set.

Example:

```text
22.5 kg     10 reps     ✓
```

The user should be able to quickly tap into either field and edit it.

---

# 19. PREVIOUS PERFORMANCE

Previous performance must appear directly on the exercise card.

Do not force the user to:

Open exercise → History → Find last workout.

Instead:

```text
LAST SESSION
22.5 × 10
22.5 × 9
20 × 10
```

should already be visible.

---

# 20. SET COMPLETION

When the user taps ✓:

1. Mark set complete.
2. Save locally.
3. Start rest timer if enabled.
4. Move visual focus to next set.
5. Show next target if available.

Example:

```text
SET COMPLETE ✓

REST
01:42

Next:
22.5 kg × 10
```

---

# 21. REST TIMER UX

The timer can appear as:

* Bottom sheet
* Compact floating component
* Full-screen timer when requested

Primary actions:

[ +30 sec ]

[ Skip ]

[ Pause ]

The user must be able to continue navigating within the workout while the timer runs.

---

# 22. PAUSE WORKOUT

When the user taps Pause:

```text
WORKOUT PAUSED

Push A

Elapsed
34:21

[ Resume Workout ]

[ Finish Later ]
```

The workout state must be preserved.

---

# 23. EXIT ACTIVE WORKOUT

If the user attempts to leave an unfinished workout:

```text
Leave workout?

Your progress has been saved.

[ Stay ]

[ Leave ]
```

Do not discard data automatically.

---

# 24. RESUME WORKOUT

When returning to the application:

```text
WORKOUT IN PROGRESS

Push A

You have 3 exercises remaining.

[ Continue Workout ]

[ Discard Workout ]
```

---

# 25. FINISH WORKOUT

The Finish button should be accessible from the workout header.

If all planned sets are complete:

→ Finish immediately.

If incomplete:

```text
Some sets are incomplete.

Finish anyway?

[ Continue Workout ]

[ Finish Workout ]
```

The user must be allowed to finish an incomplete workout if they intentionally choose to.

---

# 26. WORKOUT SUMMARY

After finishing:

```text
WORKOUT COMPLETE

PUSH A

54 min

────────────────

6 Exercises
18 Sets
7,420 kg

────────────────

NEW PRs

Incline Press
Lateral Raise

────────────────

Compared to Last Push

Volume       +8%
Weight       +5%
Sets         +0

[ Done ]
```

The summary should be positive but not overly gamified.

---

# 27. ROLLING SPLIT TRANSITION

After successful completion:

Current:

PUSH

↓

Split advances

↓

Next:

PULL

The user should receive subtle confirmation.

Example:

```text
NEXT UP

PULL

See you next session.
```

---

# 28. MISSED DAY UX

No special warning should appear just because the user did not train.

Example:

User completed Push Monday.

Doesn't train Tuesday.

Opens app Wednesday.

Show:

```text
YOUR NEXT WORKOUT

PULL

Last completed:
Push • Monday

[ START PULL ]
```

Do not show:

"You missed Tuesday."

---

# 29. MANUAL SKIP FLOW

User selects:

[ Skip Workout ]

Confirmation:

```text
SKIP PULL?

This will move your split to:

LEGS

Your Pull workout will be marked as skipped.

[ Cancel ]

[ Skip Workout ]
```

After confirmation:

```text
PULL SKIPPED

Next workout:

LEGS
```

---

# 30. QUICK WORKOUT

The user should be able to ignore the current program temporarily.

Home:

QUICK WORKOUT

[ Start Empty Workout ]

This creates a standalone workout.

Important:

A Quick Workout must NOT automatically advance the rolling split unless the user explicitly chooses:

[ Count this as today's planned workout ]

---

# 31. PLAN SCREEN

The Plan tab should show:

```text
MY SPLIT

PUSH A
Chest • Shoulders • Triceps
6 exercises

PULL A
Back • Biceps
6 exercises

LEGS
Quads • Hamstrings • Glutes
7 exercises
```

The current position should be clearly identified.

Example:

```text
NEXT
PULL A
```

---

# 32. PROGRESS SCREEN

The Progress tab should start with a simple overview.

```text
YOUR PROGRESS

THIS WEEK

4 Workouts
72 Sets
31,420 kg
3h 42m

────────────────

PERSONAL RECORDS

12 PRs

────────────────

TOP EXERCISES

Bench Press
↑ 10%

Lat Pulldown
↑ 7%

Squat
↑ 5%
```

---

# 33. EXERCISE PROGRESS FLOW

Progress:

→ Select exercise

→ Exercise detail

Example:

```text
BENCH PRESS

CURRENT PR
80 kg × 6

EST. 1RM
94 kg

PROGRESS

[Chart]

RECENT SESSIONS

14 Sep
80 × 6

10 Sep
77.5 × 7

6 Sep
75 × 8
```

---

# 34. HISTORY SCREEN

History should contain two primary views:

CALENDAR

LIST

---

# 35. HISTORY CALENDAR

Example:

```text
SEPTEMBER 2026

M  T  W  T  F  S  S

      1  2  3  4  5
6  7  8  9 10 11 12
13 14 15 16 17 18 19
20 21 22 23 24 25 26
27 28 29 30
```

Workout days should be visually distinguishable.

Rest days should remain neutral.

Skipped workouts should use a different state.

---

# 36. WORKOUT HISTORY

List:

```text
TODAY
Push A
54 min
18 sets
7,420 kg

12 SEP
Pull A
48 min
16 sets
6,850 kg

10 SEP
Legs
62 min
21 sets
9,120 kg
```

Tap any item → Workout Details.

---

# 37. WORKOUT DETAILS

Display:

* Date
* Workout name
* Duration
* Exercises
* Sets
* Weight
* Reps
* Volume
* PRs
* Notes

The user should be able to inspect exactly what happened.

---

# 38. PROFILE SCREEN

Profile should remain simple.

```text
PROFILE

Account

Preferences

Workout Settings

Units

Notifications

Appearance

Data & Backup

About Repshade
```

---

# 39. EMPTY STATES

Every major screen must have a useful empty state.

### No workouts

```text
No workouts yet.

Your completed workouts
will appear here.

[ Start Your First Workout ]
```

### No PRs

```text
No PRs yet.

Keep training.
Your first one is coming.
```

### No exercise history

```text
No history yet.

Complete this exercise
to start tracking progress.
```

---

# 40. ERROR STATES

Errors should be human-readable.

Avoid:

"FirestoreError: PERMISSION_DENIED"

Instead:

```text
Something went wrong.

Your workout is safely saved on this device.

We'll try syncing again later.
```

---

# 41. OFFLINE UX

If the device loses internet:

Show a subtle status indicator:

```text
Offline
```

But do not block the workout.

User continues normally.

After reconnecting:

```text
Synced ✓
```

Avoid intrusive dialogs.

---

# 42. SYNC STATUS

Profile/Data screen can show:

```text
SYNC

✓ All data synced

Last synced:
2 minutes ago
```

If synchronization fails:

```text
Sync pending

Your data is safely stored
on this device.
```

---

# 43. LOADING STATES

Use skeletons or compact loading indicators.

Never leave blank screens.

For example:

```text
Loading workout...
```

should be replaced by a skeleton card whenever practical.

---

# 44. CONFIRMATION RULES

Confirmation should be required for destructive actions:

* Delete workout
* Delete split
* Delete exercise
* Discard active workout
* Skip workout
* Delete account

Do not require confirmation for normal actions such as:

* Completing a set
* Starting a rest timer
* Editing weight
* Editing reps

---

# 45. UX FOR WEIGHT INPUT

The weight field should be optimized for numeric entry.

Example:

```text
WEIGHT

[ 22.5 ] kg
```

The numeric keyboard should open automatically.

Support decimal values.

The unit should be globally configurable:

* kg
* lb

---

# 46. UX FOR REP INPUT

Reps should use numeric input.

Example:

```text
REPS

[ 10 ]
```

Provide quick controls where useful:

[-] 10 [+]

But direct input must remain available.

---

# 47. SET TYPES

The set type should be accessible without clutter.

Default:

NORMAL

Optional:

* Warm-up
* Dropset
* Failure
* AMRAP

Advanced options can be hidden under:

[ More ]

---

# 48. RPE / RIR

RPE and RIR should be optional.

Default MVP behavior:

Hidden.

Users can enable them in workout settings.

This prevents beginners from seeing unnecessary complexity.

---

# 49. SUPERSET UX

Supersets should visually group exercises.

Example:

```text
SUPERSET A

A1
Cable Curl

A2
Triceps Pushdown

Rest 60 sec
```

The grouping should be visually obvious without requiring a separate workflow.

---

# 50. NAVIGATION RULE

During an active workout, navigation should be minimized.

The user should not accidentally leave the workout by tapping the bottom navigation.

If they attempt to navigate away:

Show:

"Workout in progress."

[ Continue Workout ]

[ Leave ]

---

# 51. ACCESSIBILITY

The app should support:

* Dynamic font scaling
* Adequate touch targets
* High contrast
* Screen readers
* Clear labels
* Color-independent status indicators

Never communicate information using color alone.

For example:

Do not rely only on green for completed sets.

Use:

✓ Completed

---

# 52. MOBILE INTERACTION PRINCIPLES

The interface should prioritize:

* One-handed operation
* Large touch targets
* Numeric keyboards
* Bottom-sheet interactions
* Swipe gestures where useful
* Minimal typing
* Minimal navigation

The user may be:

* Holding a phone with one hand
* Wearing gym gloves
* Sweating
* Between sets

The UI must accommodate this.

---

# 53. UX HIERARCHY

The application should prioritize information in this order:

### Level 1

What workout should I do?

### Level 2

What exercise am I doing?

### Level 3

What did I do last time?

### Level 4

What am I doing this set?

### Level 5

How am I progressing?

Everything else is secondary.

---

# 54. PRIMARY CTA RULE

Every primary screen should have one obvious primary action.

Home:

START WORKOUT

Workout:

COMPLETE SET

Workout Summary:

DONE

Plan:

EDIT / SAVE

Progress:

VIEW EXERCISE

Avoid multiple competing primary CTAs.

---

# 55. UX ANTI-PATTERNS

Repshade should avoid:

* Excessive popups
* Full-screen ads
* Forced onboarding
* Excessive animations
* Too many charts
* Excessive gamification
* Guilt-based notifications
* Complicated workout logging
* Hidden controls
* Unnecessary confirmation dialogs

---

# 56. COMPLETE CORE FLOW

The complete primary flow is:

```text
OPEN REPSHADE
      ↓
HOME
      ↓
SEE NEXT WORKOUT
      ↓
START WORKOUT
      ↓
EXERCISE
      ↓
SEE LAST SESSION
      ↓
ENTER WEIGHT
      ↓
ENTER REPS
      ↓
COMPLETE SET
      ↓
REST TIMER
      ↓
NEXT SET
      ↓
NEXT EXERCISE
      ↓
FINISH WORKOUT
      ↓
WORKOUT SUMMARY
      ↓
PR / PROGRESS
      ↓
SPLIT ADVANCES
      ↓
NEXT WORKOUT
```

---

# 57. CORE MISSED-DAY FLOW

```text
PUSH COMPLETED
      ↓
CALENDAR DAY PASSES
      ↓
NO WORKOUT
      ↓
ANOTHER DAY PASSES
      ↓
USER OPENS APP
      ↓
PULL REMAINS NEXT
      ↓
USER STARTS PULL
```

---

# 58. CORE SKIP FLOW

```text
NEXT WORKOUT
      ↓
USER SELECTS SKIP
      ↓
CONFIRMATION
      ↓
WORKOUT MARKED SKIPPED
      ↓
SPLIT ADVANCES
      ↓
NEXT WORKOUT
```

---

# 59. CORE INTERRUPTION FLOW

```text
WORKOUT STARTED
      ↓
USER CLOSES APP
      ↓
WORKOUT SAVED LOCALLY
      ↓
USER RETURNS
      ↓
CONTINUE WORKOUT
      ↓
FINISH
```

---

# 60. CORE OFFLINE FLOW

```text
START WORKOUT
      ↓
INTERNET LOST
      ↓
CONTINUE LOGGING
      ↓
DATA SAVED LOCALLY
      ↓
FINISH WORKOUT
      ↓
INTERNET RETURNS
      ↓
SYNC TO FIREBASE
      ↓
SYNC COMPLETE
```

---

# 61. UX SUCCESS CRITERIA

The UX is successful if:

1. A user can identify their next workout within 3 seconds of opening the app.
2. A user can start their workout with one primary action.
3. A user can log a normal set without leaving the active workout screen.
4. Previous performance is visible without navigation.
5. A missed day never accidentally advances the split.
6. A completed workout advances the split exactly once.
7. An interrupted workout can always be recovered.
8. Workout logging works offline.
9. Destructive actions require confirmation.
10. The user always understands what happens next.
