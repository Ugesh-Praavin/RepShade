# Repshade Screen-by-Screen UI Specification

## 1. Document Purpose

This document defines the screen-by-screen UX and UI requirements for Repshade.

It should be used as the primary specification when designing the app in **Stitch**.

The previous documents define:

* Product vision
* Product requirements
* UX architecture
* Technical architecture
* Firebase/data architecture
* Visual design system

This document converts those decisions into concrete screens, states, interactions, navigation and UI hierarchy.

---

# 2. Core Navigation

Repshade uses five primary tabs:

```text
HOME
PLAN
PROGRESS
HISTORY
PROFILE
```

The active workout is a special full-screen experience and should not behave like a normal tab.

## Navigation Structure

```text
Auth
│
├── Welcome
├── Sign In
├── Sign Up
│
└── Onboarding
    ├── Choose Split
    ├── Create Split
    └── Build Workouts
          │
          ▼
       Main App
          │
          ├── Home
          ├── Plan
          ├── Progress
          ├── History
          └── Profile
                  │
                  ├── Settings
                  ├── Units
                  ├── Notifications
                  ├── Appearance
                  ├── Account
                  └── Data
```

Workout flow:

```text
Home / Plan
      ↓
Start Workout
      ↓
Active Workout
      ↓
Pause / Resume
      ↓
Finish
      ↓
Workout Summary
      ↓
Split Advances
      ↓
Home
```

---

# 3. Screen Inventory

## Authentication

1. Welcome
2. Sign In
3. Sign Up
4. Forgot Password

## Onboarding

5. Setup Introduction
6. Choose Split
7. Create Custom Split
8. Reorder Split
9. Configure Workout
10. Add Exercise
11. Exercise Configuration
12. Onboarding Complete

## Main App

13. Home
14. Plan
15. Workout Template Details
16. Active Workout
17. Rest Timer
18. Pause Workout
19. Finish Confirmation
20. Workout Summary
21. Workout Recovery

## Progress

22. Progress Overview
23. Exercise Progress
24. Exercise History
25. Personal Records

## History

26. History Overview
27. Calendar
28. Workout Details

## Profile

29. Profile
30. Settings
31. Units
32. Appearance
33. Notifications
34. Account
35. Data Management

## Supporting Screens / States

36. Exercise Library
37. Add Custom Exercise
38. Search Exercises
39. Quick Workout
40. Empty States
41. Offline States
42. Sync/Error States

---

# 4. Screen 01 — Welcome

## Purpose

Introduce Repshade quickly.

## Layout

```text
[Logo]

REPSHADE

TRAIN.
LOG.
PROGRESS.
REPEAT.

Your simple training companion.

[ GET STARTED ]

Already have an account?
[ SIGN IN ]
```

## Requirements

* Minimal visual design
* No long product explanation
* Strong typography
* Dark-first
* Primary CTA clearly visible

## Primary CTA

**GET STARTED**

Navigates to onboarding/account creation.

---

# 5. Screen 02 — Sign In

## Layout

```text
Welcome back.

Email
[________________]

Password
[________________]

[ SIGN IN ]

Forgot password?

──────── or ────────

Continue with Google

Don't have an account?
Create account
```

## Requirements

* Email validation
* Password validation
* Loading state
* Error state
* Keyboard-aware layout

---

# 6. Screen 03 — Sign Up

## Layout

```text
Create your account.

Name
[________________]

Email
[________________]

Password
[________________]

Confirm password
[________________]

[ CREATE ACCOUNT ]

Already have an account?
Sign in
```

Account creation should not require unnecessary information.

---

# 7. Screen 04 — Forgot Password

## Layout

```text
Reset password

Enter your email and we'll
send instructions to reset
your password.

Email
[________________]

[ SEND RESET LINK ]

Back to sign in
```

Success:

```text
Check your email.

If an account exists for this
email, reset instructions have
been sent.
```

---

# 8. Screen 05 — Setup Introduction

After authentication:

```text
LET'S SET UP YOUR TRAINING

First, choose how you train.

Your split determines what
workout comes next.

[ CONTINUE ]
```

Important educational message:

> The calendar tells you when you trained. Your split tells you what you train next.

---

# 9. Screen 06 — Choose Split

## Layout

```text
CHOOSE YOUR SPLIT

Push / Pull / Legs
3 workouts

Upper / Lower
2 workouts

Push / Pull / Legs / Upper
4 workouts

Full Body
3 workouts

Custom
Create your own
```

Each option should be a selectable card.

Selected state:

* Accent border
* Accent indicator
* Strong title

---

# 10. Screen 07 — Create Custom Split

## Layout

```text
CREATE YOUR SPLIT

Split name
[ My Training ]

WORKOUTS

Push
Pull
Legs

[ + ADD WORKOUT ]

[ CONTINUE ]
```

Users should be able to:

* Add workout
* Rename workout
* Delete workout
* Reorder workout

---

# 11. Screen 08 — Reorder Split

## Purpose

Allow users to define the sequence.

Example:

```text
YOUR SPLIT

☰  Push
☰  Pull
☰  Legs
☰  Upper

Drag to reorder.

[ SAVE SPLIT ]
```

Important:

The order determines the next workout.

---

# 12. Screen 09 — Configure Workout

Example:

```text
PUSH

Chest • Shoulders • Triceps

EXERCISES

Bench Press
Incline Dumbbell Press
Lateral Raise
Tricep Pushdown

[ + ADD EXERCISE ]

[ SAVE WORKOUT ]
```

Allow:

* Exercise ordering
* Exercise deletion
* Exercise configuration
* Superset grouping

---

# 13. Screen 10 — Add Exercise

Use a bottom sheet or full-screen search interface.

```text
ADD EXERCISE

[ 🔍 Search exercises ]

RECENT

Bench Press
Lat Pulldown
Lateral Raise

POPULAR

Barbell Squat
Deadlift
Bench Press
```

Exercise library should be searchable.

---

# 14. Screen 11 — Exercise Configuration

Example:

```text
BENCH PRESS

Default Sets
[ 3 ]

Target Reps
[ 8 – 10 ]

Rest
[ 120 sec ]

Set Type
[ Working ]

Notes
[ Optional ]

[ SAVE ]
```

Optional advanced settings:

* RPE
* RIR
* Warm-up sets
* Superset
* Dropset

Keep advanced controls collapsed by default.

---

# 15. Screen 12 — Onboarding Complete

```text
YOU'RE READY.

Your split is set.

NEXT WORKOUT

PUSH

[ START WORKOUT ]

or

[ GO TO HOME ]
```

The user should reach the actual product quickly.

---

# 16. Screen 13 — Home

Home is the most important non-workout screen.

## Layout

```text
Good morning, Ugesh.

NEXT WORKOUT

PULL
Back • Biceps

6 exercises
~50 min

[ START WORKOUT ]

────────────────

THIS WEEK

3 workouts
18 sets
12,480 kg volume

────────────────

RECENT

Push
Yesterday

Legs
3 days ago

Pull
5 days ago
```

Actual greeting should adapt to time of day where appropriate.

---

# 17. Home — Primary Hierarchy

Priority:

1. Next workout
2. Start workout
3. Current weekly activity
4. Recent activity
5. Progress summary

The user should not need to scroll to find the next workout.

---

# 18. Home — No Workout History

```text
READY TO TRAIN?

Your first workout is waiting.

[ START WORKOUT ]
```

---

# 19. Home — Missed Days

If the user has not trained for several days:

```text
READY WHEN YOU ARE.

NEXT WORKOUT

PULL

Back • Biceps

[ START WORKOUT ]
```

Do not display:

* Missed workout count
* "You're behind"
* Streak loss
* Guilt messaging

The split does not change because of missed calendar days.

---

# 20. Home — Workout In Progress

If an unfinished workout exists:

```text
WORKOUT IN PROGRESS

PULL

7 sets completed
28 min elapsed

[ RESUME WORKOUT ]
```

This card should replace or sit above the normal Next Workout card.

---

# 21. Screen 14 — Plan

## Purpose

Show the user's training program.

```text
PLAN

YOUR SPLIT

Push → Pull → Legs

NEXT
Pull

────────────────

WORKOUTS

Push
7 exercises

Pull
6 exercises

Legs
8 exercises

[ + ADD WORKOUT ]
```

---

# 22. Plan — Current Split Position

Show current position clearly.

Example:

```text
Push ✓

→ Pull NEXT

Legs
```

The current position should be based on completed/skipped workouts.

---

# 23. Screen 15 — Workout Template Details

Example:

```text
PULL

Back • Biceps

6 exercises

1. Lat Pulldown
2. Barbell Row
3. Seated Cable Row
4. Face Pull
5. Dumbbell Curl
6. Hammer Curl

[ START WORKOUT ]

[ EDIT WORKOUT ]
```

---

# 24. Workout Template Editing

Edit actions:

* Rename workout
* Reorder exercises
* Add exercise
* Remove exercise
* Configure sets
* Configure reps
* Configure rest
* Configure advanced set types

---

# 25. Screen 16 — Active Workout

This is the most important screen in the entire application.

## Design Objective

The user should be able to:

> Look → Enter → Tap → Rest → Repeat

without navigating around the app.

---

# 26. Active Workout Layout

```text
←   PULL                    42:18   ⋯

7 exercises

────────────────────────

LAT PULLDOWN
Back

Previous
70 kg × 10
70 kg × 9
65 kg × 10

SET     KG      REPS

1       70       10       ✓
2       70       9        ✓
3       65       10       ✓

[ + ADD SET ]

────────────────────────

[ START REST ]

────────────────────────

SEATED CABLE ROW
```

---

# 27. Active Workout Header

Header contains:

* Back/exit
* Workout name
* Timer
* More menu

Do not put unnecessary information in the header.

---

# 28. Exercise Progress

Show:

```text
3 / 7 exercises
```

or a subtle progress indicator.

Do not make the progress indicator dominate the screen.

---

# 29. Current Exercise

The current exercise should have the strongest hierarchy.

Example:

```text
BENCH PRESS

Chest

Previous
80 kg × 8
80 kg × 8
75 kg × 10
```

Then current sets.

---

# 30. Set Logging

Default:

```text
SET    KG     REPS

1      80      8      ✓
2      80      8      ✓
3      75      10     ✓
```

User actions:

1. Tap weight
2. Enter/edit weight
3. Tap reps
4. Enter/edit reps
5. Tap complete

The process should be extremely fast.

---

# 31. Set Completion

After completion:

```text
1    80    8    ✓
```

The completed row should visually settle.

Optional haptic feedback.

---

# 32. Automatic Rest

After completing a working set, Repshade may automatically surface the rest timer.

Example:

```text
SET COMPLETE

REST
01:32

[ +30s ]    [ SKIP ]
```

The user should be able to continue interacting with the workout.

---

# 33. Screen 17 — Rest Timer

Can appear as:

* Compact bottom panel
* Bottom sheet
* Floating workout control

Preferred:

```text
RESTING

01:24

[ +30s ]

[ SKIP REST ]
```

The timer should not unnecessarily hide the next exercise.

---

# 34. Screen 18 — Pause Workout

Pause should preserve everything.

```text
WORKOUT PAUSED

PULL

12 sets completed
31 min elapsed

[ RESUME WORKOUT ]

[ END WORKOUT ]
```

No workout data should be lost.

---

# 35. Leaving Active Workout

When user taps back:

```text
LEAVE WORKOUT?

Your workout is saved locally
and can be resumed.

[ KEEP WORKOUT ]
[ END WORKOUT ]
[ CANCEL ]
```

Primary action:

**KEEP WORKOUT**

---

# 36. Screen 19 — Finish Confirmation

Only show when necessary.

```text
FINISH WORKOUT?

You've completed 6 of 7
exercises.

Finish anyway?

[ FINISH WORKOUT ]
[ KEEP TRAINING ]
```

If everything is complete, finishing should be immediate.

---

# 37. Screen 20 — Workout Summary

Example:

```text
WORKOUT COMPLETE

PULL

58 min

18 sets
7,420 kg volume

────────────────

PERSONAL RECORDS

NEW PR
Barbell Row
80 kg × 8

────────────────

NEXT WORKOUT

LEGS

[ DONE ]
```

---

# 38. Workout Completion Logic

On successful completion:

1. Save workout session.
2. Save all sets.
3. Calculate volume.
4. Calculate PRs.
5. Advance split position.
6. Queue sync.
7. Show summary.
8. Return user to Home.

The split advancement must happen exactly once.

---

# 39. Screen 21 — Workout Recovery

If app restarts while a workout is active:

```text
WORKOUT IN PROGRESS

PULL

Started 28 min ago

7 sets logged

[ RESUME ]
[ DISCARD ]
```

Resume should be primary.

---

# 40. Screen 22 — Progress Overview

```text
PROGRESS

THIS MONTH

12 workouts
68 sets
48,320 kg volume

────────────────

STRENGTH

Bench Press
+7.5 kg

Squat
+10 kg

Deadlift
+15 kg

────────────────

PERSONAL RECORDS

3 new PRs

[ VIEW ALL ]
```

---

# 41. Progress Metrics

Prioritize useful metrics:

* Workout count
* Total sets
* Volume
* Exercise strength
* PRs
* Weekly adherence
* Training frequency

Do not overload the dashboard.

---

# 42. Screen 23 — Exercise Progress

Example:

```text
BENCH PRESS

82.5 kg × 6

+5 kg since first logged

────────────────

STRENGTH

[ chart ]

4W   3M   6M   1Y

────────────────

RECENT

82.5 × 6
80 × 8
80 × 8
77.5 × 8
```

---

# 43. Screen 24 — Exercise History

```text
BENCH PRESS

HISTORY

Sep 12
82.5 × 6
80 × 8

Sep 08
80 × 8
80 × 8
75 × 10

Sep 03
77.5 × 8
77.5 × 8
```

History should be easy to scan.

---

# 44. Screen 25 — Personal Records

```text
PERSONAL RECORDS

RECENT PRs

Bench Press
82.5 kg × 6

Squat
120 kg × 5

Deadlift
160 kg × 3

────────────────

ALL RECORDS

Chest
Shoulders
Back
Legs
Arms
```

---

# 45. Screen 26 — History Overview

```text
HISTORY

September 2026

S  M  T  W  T  F  S
      •  •     •  •

12 WORKOUTS

Sep 12
Pull
58 min
18 sets

Sep 10
Push
52 min
16 sets

Sep 07
Legs
64 min
20 sets
```

---

# 46. Screen 27 — Calendar

Calendar displays completed workouts.

Example visual states:

```text
● = workout completed
○ = no workout
```

Selecting a completed day shows the workout.

Important:

Calendar state must never determine the next split workout.

---

# 47. Calendar Empty Day

Selecting an empty day:

```text
NO WORKOUT

You didn't train on this day.

Your split was not affected.
```

The final sentence may be omitted if unnecessary, but the UI must never imply that the user is behind.

---

# 48. Screen 28 — Workout Details

Example:

```text
PULL

September 12
58 min

18 sets
7,420 kg

────────────────

LAT PULLDOWN

70 × 10
70 × 9
65 × 10

────────────────

BARBELL ROW

80 × 8
80 × 8
75 × 10
```

Historical workout data should remain readable and stable.

---

# 49. Screen 29 — Profile

```text
PROFILE

Ugesh

────────────────

PREFERENCES
Units
Appearance
Notifications

────────────────

ACCOUNT
Account
Data

────────────────

ABOUT
About Repshade
Privacy
Terms
```

Keep this screen intentionally simple.

---

# 50. Screen 30 — Settings

Settings should be grouped.

```text
SETTINGS

Training
Default rest
Weight unit
Rep preferences

Appearance
Theme

Notifications
Workout reminders
Rest timer

Account
Email
Password

Data
Export data
Delete data
```

---

# 51. Screen 31 — Units

```text
UNITS

Weight

● Kilograms
○ Pounds

Rest timer

Seconds
Minutes
```

Changing units should affect presentation without corrupting stored data.

---

# 52. Screen 32 — Appearance

```text
APPEARANCE

THEME

● Dark
○ Light
○ System
```

Dark should be the default.

---

# 53. Screen 33 — Notifications

Notifications should be optional.

```text
NOTIFICATIONS

Workout reminders
[ ON ]

Reminder time
7:00 PM

Rest timer alerts
[ ON ]
```

Avoid guilt-based messaging.

Example good reminder:

> Your next workout is ready.

Avoid:

> You haven't trained in 3 days!

---

# 54. Screen 34 — Account

```text
ACCOUNT

Email
user@email.com

Password
••••••••

[ CHANGE PASSWORD ]

[ SIGN OUT ]

────────────────

Danger Zone

[ DELETE ACCOUNT ]
```

Delete account requires confirmation.

---

# 55. Screen 35 — Data Management

```text
DATA

Cloud sync
✓ Enabled

Last synced
Just now

[ EXPORT DATA ]

[ SYNC NOW ]

────────────────

DANGER ZONE

[ DELETE ALL WORKOUT DATA ]
```

Destructive operations require explicit confirmation.

---

# 56. Screen 36 — Exercise Library

```text
EXERCISES

[ 🔍 Search ]

CHEST

Bench Press
Incline Bench Press
Chest Fly

BACK

Lat Pulldown
Barbell Row
Seated Cable Row

LEGS

Squat
Leg Press
Leg Curl
```

System exercises are always available.

---

# 57. Screen 37 — Add Custom Exercise

```text
CUSTOM EXERCISE

Exercise name
[________________]

Primary muscle
[________________]

Equipment
[________________]

[ CREATE EXERCISE ]
```

Custom exercises belong to the user's account.

---

# 58. Screen 38 — Search Exercises

Search should support:

* Name
* Muscle
* Equipment

Example:

```text
Search: incline

RESULTS

Incline Bench Press
Incline Dumbbell Press
Incline Cable Fly
```

Search should feel instant.

---

# 59. Screen 39 — Quick Workout

Quick Workout allows the user to train without modifying their normal split.

```text
QUICK WORKOUT

Start a one-off workout.

[ START EMPTY WORKOUT ]

or

ADD EXERCISES
```

Important:

A Quick Workout should not automatically alter the rolling split unless explicitly defined as a completed workout assigned to the current split position.

For MVP, default Quick Workout behavior:

**It records the session but does not advance the split.**

---

# 60. Global Empty State

Use:

```text
TITLE

Short explanation.

[ PRIMARY ACTION ]
```

Never leave an empty screen without explaining what the user can do.

---

# 61. Global Offline State

If offline:

```text
Offline • Saved locally
```

The app continues functioning.

Do not block workout actions because Firebase is unavailable.

---

# 62. Global Sync Error

If synchronization fails:

```text
Sync pending

Your data is safely stored
on this device.

[ TRY AGAIN ]
```

The user should not lose data.

---

# 63. Global Network Recovery

When internet returns:

```text
Syncing…
```

Then:

```text
✓ Synced
```

This should happen quietly.

---

# 64. Destructive Confirmation

Example:

```text
DELETE WORKOUT?

This cannot be undone.

[ DELETE ]
[ CANCEL ]
```

Destructive actions must never be accidentally triggered by a single ambiguous tap.

---

# 65. Reset Split Confirmation

```text
RESET SPLIT?

This will change your current
next workout.

Your workout history will not
be deleted.

[ RESET SPLIT ]
[ CANCEL ]
```

Historical workouts must remain intact.

---

# 66. Important Interaction Rules

## Starting Workout

One clear CTA.

## Logging Set

One interaction path.

## Completing Set

Immediate feedback.

## Rest

Automatic but dismissible.

## Finishing Workout

One clear completion action.

## Skipping Workout

Manual skip must be explicit.

---

# 67. Manual Skip Flow

From Home or Plan:

```text
NEXT WORKOUT

PULL

[ START WORKOUT ]

⋯
```

Menu:

```text
Skip this workout
```

Confirmation:

```text
SKIP PULL?

Your next workout will become
LEGS.

This will not create a workout
record.

[ SKIP ]
[ CANCEL ]
```

After skipping:

```text
NEXT WORKOUT

LEGS
```

The split advances.

---

# 68. Missed Day Flow

User does nothing.

No special action occurs.

Example:

```text
Monday
Push completed

Tuesday
No workout

Wednesday
No workout

Thursday
Home shows:

NEXT WORKOUT
Pull
```

This is a core Repshade behavior.

---

# 69. Workout Interruption Flow

```text
Start workout
↓
Log sets
↓
App closes
↓
Reopen
↓
Resume workout
↓
Continue
↓
Finish
```

No logged set should disappear.

---

# 70. Data Flow From UI Perspective

```text
USER ACTION
    ↓
UI
    ↓
Zustand
    ↓
Domain Logic
    ↓
Local Database
    ↓
Sync Queue
    ↓
Firebase
```

The UI must not directly manipulate Firebase.

---

# 71. Stitch Screen Design Order

Design screens in this order:

## Phase 1 — Visual Foundation

1. Welcome
2. Home
3. Active Workout

## Phase 2 — Core Product

4. Plan
5. Workout Details
6. Add Exercise
7. Workout Summary

## Phase 3 — Progress

8. Progress
9. Exercise Progress
10. History
11. Calendar

## Phase 4 — Configuration

12. Profile
13. Settings
14. Appearance
15. Notifications

## Phase 5 — Edge States

16. Empty
17. Offline
18. Sync Error
19. Workout Recovery
20. Manual Skip

---

# 72. Stitch Design Priority

The following three screens must be exceptional:

### 1. Home

Answers:

> What do I train now?

### 2. Active Workout

Answers:

> What do I log now?

### 3. Progress

Answers:

> Am I getting better?

If these three experiences are excellent, the rest of the app can remain comparatively simple.

---

# 73. Screen Consistency Requirements

Every screen should maintain:

* Same spacing system
* Same typography
* Same buttons
* Same card language
* Same icon style
* Same navigation
* Same semantic colors
* Same interaction patterns

Do not create one-off visual systems for individual screens.

---

# 74. Mobile Safe Areas

All screens must respect:

* Status bar
* Notches
* Home indicator
* Bottom navigation
* Keyboard

Active Workout should ensure bottom controls remain accessible above the device home indicator.

---

# 75. Keyboard Behavior

When keyboard opens:

* Content should remain scrollable.
* Focused input should remain visible.
* Bottom CTA should not be hidden.
* Keyboard dismissal should be intuitive.

Numeric inputs should use numeric keyboards where appropriate.

---

# 76. Accessibility Requirements

Every interactive element must have:

* Accessible label
* Clear purpose
* Minimum 44×44 touch area
* Visible state

Do not rely exclusively on color.

Example:

Completed set:

```text
✓ Completed
```

rather than simply changing the row color.

---

# 77. Performance Requirements

Screens should appear immediately using local data where possible.

Do not:

* Wait for Firebase before rendering local data
* Reload the entire workout after every set
* Re-render unrelated exercises unnecessarily
* Perform expensive calculations on every keystroke

The active workout must feel instantaneous.

---

# 78. UX Performance Target

The ideal set logging interaction:

```text
Tap input
↓
Enter value
↓
Tap complete
↓
Immediate feedback
↓
Rest begins
```

Target feeling:

**under a few seconds per set.**

---

# 79. Final UX Principle

Repshade should always answer the user's next question.

When opening the app:

> What do I train?

During a workout:

> What do I log?

After training:

> What did I accomplish?

Over time:

> Am I progressing?

The interface should exist to answer these questions with as little friction as possible.

---

# 80. Final Screen Architecture

```text
                         REPSHADE
                            │
             ┌──────────────┴──────────────┐
             │                             │
          AUTH                          MAIN APP
             │                             │
        ONBOARDING              ┌──────────┼──────────┐
                                │          │          │
                              HOME       PLAN      PROGRESS
                                │          │          │
                                │          │      Exercise Progress
                                │          │      PRs
                                │          │
                                │      Workout Details
                                │
                                ├── Start Workout
                                │
                                ▼
                          ACTIVE WORKOUT
                                │
                       ┌────────┼────────┐
                       │        │        │
                     Rest     Pause    Finish
                       │        │        │
                       └────────┼────────┘
                                │
                         WORKOUT SUMMARY
                                │
                         SPLIT ADVANCES
                                │
                                ▼
                              HOME

                 HISTORY ── Calendar ── Workout Details

                 PROFILE ── Settings ── Account ── Data
```

---

# 81. Product-Critical UX Rules

These rules must never be violated during implementation:

1. **Calendar days do not advance the split.**
2. **Completed workouts advance the split.**
3. **Manual skips advance the split.**
4. **Missed days do nothing.**
5. **Quick Workout does not advance the split by default.**
6. **Active workouts work offline.**
7. **Logged sets are saved locally immediately.**
8. **Firebase failure must not destroy workout data.**
9. **Previous performance is visible during logging.**
10. **Workout completion advances the split exactly once.**
11. **Historical workout data must remain stable.**
12. **The user must never be shamed for missing a workout.**
13. **The active workout must remain the fastest part of the app.**
14. **No unnecessary social or gamification features should enter the core experience.**
15. **The UI should always prioritize the user's next action.**

---

# 82. Stitch Deliverable

The Stitch phase should produce:

* Complete mobile visual design
* Dark theme
* Light theme
* Component variations
* Navigation
* Core screen layouts
* Active workout interaction states
* Empty states
* Offline states
* Loading states
* Error states
* Workout completion states
* Progress charts
* Calendar
* Settings

The final Stitch design should be detailed enough that a developer can implement the UI without making major visual decisions independently.

---

# 83. Definition of a Good Repshade UI

A successful Repshade interface should allow a new user to:

1. Open the app.
2. Immediately understand their next workout.
3. Start training.
4. See what they did previously.
5. Log sets quickly.
6. Rest without losing context.
7. Finish the workout.
8. Understand what changed.
9. Know what comes next.
10. Return later and see meaningful progress.

If the interface accomplishes those ten things without unnecessary friction, the design is successful.

---

# 84. Final UX Statement

> **Repshade should disappear while you train.**

The best interface is not the one the user notices.

It is the one that lets them focus on:

**TRAIN. LOG. PROGRESS. REPEAT.**
