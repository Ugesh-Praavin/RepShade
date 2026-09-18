# REPSHADE — PRODUCT REQUIREMENTS DOCUMENT

**Document:** 02 — Product Requirements Document
**Version:** 1.0
**Status:** Product Definition
**Product:** Repshade
**Platform:** iOS & Android
**Primary Architecture:** React Native + Expo + Firebase

---

# 1. PRODUCT SUMMARY

Repshade is a mobile workout tracking application that allows users to create or select workout splits, perform workouts, manually record sets/reps/weights, review previous performance, and track progress.

The defining feature is the **Rolling Split System**.

The next workout is determined by the user's last completed workout rather than the current calendar date.

Example:

PUSH → PULL → LEGS → PUSH

If the user completes Push on Monday and does not train Tuesday or Wednesday, their next workout on Thursday remains Pull.

The application should prioritize:

* Fast workout logging
* Simple navigation
* Accurate workout history
* Automatic split progression
* Previous-session visibility
* Offline functionality
* Progressive improvement

---

# 2. PRODUCT GOALS

## Primary Goals

1. Make workout logging extremely fast.
2. Ensure users always know their next workout.
3. Prevent missed calendar days from incorrectly advancing the workout split.
4. Automatically remember previous workout performance.
5. Help users understand their progression.
6. Work reliably without an internet connection.
7. Keep the interface simple enough to use between sets.

## Secondary Goals

1. Detect personal records.
2. Suggest progressive overload.
3. Provide useful training analytics.
4. Provide detailed workout history.
5. Allow highly customizable workout programs.

---

# 3. NON-GOALS FOR MVP

The MVP will NOT include:

* Nutrition tracking
* Calorie tracking
* Meal planning
* Social feed
* Chat
* Trainer marketplace
* Supplement marketplace
* AI-generated workout plans
* Advanced wearable integrations
* Medical advice
* Competition/leaderboards
* Subscription/paywall system

These may be considered in future versions.

---

# 4. TARGET USERS

## User Type 1 — Beginner

Needs:

* Easy setup
* Pre-built splits
* Exercise library
* Simple logging
* Clear progress

## User Type 2 — Intermediate

Needs:

* Custom programs
* Previous performance
* Progressive overload
* PR tracking
* Volume analytics

## User Type 3 — Advanced

Needs:

* Detailed set tracking
* Supersets
* Dropsets
* RIR/RPE
* Custom exercises
* Detailed history
* Fast logging

---

# 5. CORE USER JOURNEY

FIRST LAUNCH

↓

Create account / Continue

↓

Choose workout split

↓

Customize split

↓

Review workout plan

↓

Home screen

↓

View next workout

↓

Start workout

↓

Log exercises

↓

Log sets

↓

Use rest timer

↓

Complete workout

↓

Workout summary

↓

Split advances

↓

Next workout becomes available

---

# 6. FUNCTIONAL REQUIREMENTS

# 6.1 ONBOARDING

The application must provide an onboarding flow for new users.

## Requirements

The user must be able to:

* Create an account
* Sign in
* Continue with Google
* Select a workout split
* Customize the split
* Review the selected program
* Start their first workout

## Initial Split Templates

The application should provide:

* Push / Pull / Legs
* Upper / Lower
* Full Body
* Bro Split
* Custom Split

---

# 6.2 HOME SCREEN

The Home screen is the primary screen.

It must display:

* Current date
* Greeting
* Current/next workout
* Workout name
* Target muscle groups
* Number of exercises
* Number of planned sets
* Estimated workout duration
* Start Workout button

Example:

TODAY

PUSH A

Chest • Shoulders • Triceps

6 Exercises
18 Sets
~55 min

[ START WORKOUT ]

---

# 6.3 NEXT WORKOUT LOGIC

The application must maintain a current workout position within the selected split.

Example:

Split:

1. Push
2. Pull
3. Legs

Initial state:

currentWorkoutIndex = 0

After completing Push:

currentWorkoutIndex = 1

After completing Pull:

currentWorkoutIndex = 2

After completing Legs:

currentWorkoutIndex = 0

The index must wrap around automatically.

---

# 6.4 MISSED WORKOUT LOGIC

This is a critical requirement.

A workout must NOT automatically be marked as skipped simply because the date changes.

Example:

Monday:

Push completed.

Tuesday:

No workout.

Wednesday:

No workout.

Thursday:

The app must still show:

PULL

The application must never advance the split merely because a calendar day passed.

---

# 6.5 MANUAL SKIP

Users must have the ability to intentionally skip a workout.

Example:

PULL

[ START WORKOUT ]

[ SKIP WORKOUT ]

When Skip Workout is selected, the application must show confirmation.

Example:

"Skip Pull?"

"Your split will move to Legs."

Options:

[Cancel]

[Skip]

After confirmation:

Pull → Skipped

Next workout → Legs

---

# 6.6 WORKOUT BUILDER

Users must be able to create and edit workouts.

Each workout must support:

* Workout name
* Description
* Muscle groups
* Exercises
* Exercise order
* Number of sets
* Target reps
* Rest duration
* Notes

Users must be able to:

* Add exercise
* Remove exercise
* Reorder exercise
* Duplicate exercise
* Edit sets
* Edit rep ranges
* Edit rest time

---

# 6.7 EXERCISE LIBRARY

The application must provide a searchable exercise library.

Exercises should contain:

* Name
* Primary muscle
* Secondary muscles
* Equipment
* Exercise type

Example:

INCLINE DUMBBELL PRESS

Primary:

Upper Chest

Secondary:

Front Delts
Triceps

Equipment:

Dumbbell

---

# 6.8 CUSTOM EXERCISES

Users must be able to create custom exercises.

Required fields:

* Exercise name
* Primary muscle
* Equipment
* Tracking type

Tracking types:

* Weight + reps
* Reps only
* Duration
* Distance
* Weight + duration
* Custom

---

# 6.9 ACTIVE WORKOUT

The Active Workout screen is the most important screen in the application.

It must allow the user to:

* View exercises
* View previous performance
* Enter weight
* Enter reps
* Complete sets
* Add sets
* Delete sets
* Reorder exercises
* Add notes
* Start rest timer
* Pause workout
* Resume workout
* Finish workout

---

# 6.10 SET LOGGING

Each set must support:

* Set number
* Weight
* Reps
* Completed state
* Set type
* Optional RPE
* Optional RIR
* Optional notes

Set types should include:

* Normal
* Warm-up
* Dropset
* Failure
* AMRAP

---

# 6.11 PREVIOUS PERFORMANCE

For every exercise, the app must display the most recent completed performance.

Example:

LAST SESSION

22.5 kg × 10
22.5 kg × 9
20 kg × 10

TODAY

22.5 kg × __
22.5 kg × __
22.5 kg × __

This should be visible without navigating to another screen.

---

# 6.12 AUTOFILL

The application should optionally pre-populate today's sets with the previous workout's values.

Example:

Previous:

22.5 × 10
22.5 × 9
20 × 10

Today's initial values:

22.5 × 10
22.5 × 9
20 × 10

The user can edit them before completing the set.

---

# 6.13 REST TIMER

The application must provide a rest timer.

Requirements:

* Start automatically after completing a set if enabled
* Manual start option
* Pause timer
* Add 30 seconds
* Skip timer
* Background operation
* Notification when timer ends

Default rest durations should be configurable.

Example:

Compound:

120 seconds

Isolation:

60 seconds

---

# 6.14 SUPERSETS

Users should be able to group exercises.

Example:

SUPERSET A

A1 — Cable Curl
A2 — Triceps Pushdown

Flow:

Complete A1

↓

Complete A2

↓

Rest

↓

Repeat

---

# 6.15 DROPSets

A set can be marked as a dropset.

Example:

25 kg × 10

↓

20 kg × 8

↓

15 kg × 8

The app must preserve each individual set.

---

# 6.16 WORKOUT PAUSE

Users must be able to pause an active workout.

Possible states:

PLANNED

IN_PROGRESS

PAUSED

COMPLETED

ABANDONED

If the user closes the app during an active workout, the workout must remain recoverable.

---

# 6.17 WORKOUT COMPLETION

When all required exercises are completed, the user can finish the workout.

The application should display a summary.

Example:

WORKOUT COMPLETE

Duration: 54 min

Exercises: 6

Sets: 18

Volume: 7,420 kg

PRs: 2

The split must advance only after successful workout completion.

---

# 6.18 WORKOUT ABANDONMENT

If the user exits without finishing, the workout should remain in progress.

When returning:

"Continue your workout?"

Options:

[Continue]

[Discard]

Discarding must require confirmation.

---

# 6.19 WORKOUT HISTORY

Users must be able to view previous workouts.

Each history item should show:

* Date
* Workout name
* Duration
* Sets
* Volume
* PR count

Example:

14 Sep

Push A

54 min
18 sets
7,420 kg
2 PRs

---

# 6.20 CALENDAR

The History section should contain a calendar.

Users can select a date to view completed workouts.

The calendar should visualize:

* Workout days
* Rest days
* Skipped workouts
* Missed/non-training days

The calendar is for history and analysis.

It must NOT control the rolling split.

---

# 6.21 EXERCISE HISTORY

Users must be able to open any exercise and see its historical performance.

Example:

INCLINE PRESS

Recent Sessions:

14 Sep
30 × 8
27.5 × 10
27.5 × 9

10 Sep
27.5 × 10
27.5 × 10
25 × 12

The application should support historical charts.

---

# 6.22 PERSONAL RECORDS

The app should automatically detect:

### Weight PR

Highest weight successfully lifted.

### Rep PR

Highest number of reps at a given weight.

### Volume PR

Highest total exercise volume.

### Estimated 1RM PR

Highest estimated one-rep maximum.

When a PR occurs:

NEW PR

30 kg × 8

The user should receive subtle visual feedback.

---

# 6.23 PROGRESSIVE OVERLOAD

The app may provide suggestions based on historical performance.

Example:

Previous:

22.5 kg × 10

Suggestion:

Try 25 kg today.

The suggestion must never automatically modify the user's workout.

User controls:

[Accept]

[Edit]

[Ignore]

---

# 6.24 WORKOUT NOTES

Users must be able to add notes at:

* Workout level
* Exercise level
* Set level

Example:

Workout note:

"Felt strong today."

Exercise note:

"Machine seat position 4."

---

# 6.25 BODY WEIGHT

Users should optionally record body weight.

Required:

* Weight
* Unit
* Date

The application should show historical trends.

---

# 6.26 ANALYTICS

The Progress section should provide:

* Workouts completed
* Total sets
* Total reps
* Total volume
* Training time
* PR count
* Average workout duration
* Weekly adherence

Optional future analytics:

* Muscle-group volume
* Exercise progression
* Estimated 1RM
* Training frequency

---

# 6.27 WEEKLY ADHERENCE

Repshade should not rely on traditional streaks.

Example:

4 workouts completed this week.

4 / 5 planned workouts

80% adherence

The system should not punish users for planned rest days.

---

# 6.28 OFFLINE FUNCTIONALITY

The active workout must function without internet access.

Users must be able to:

* Start workout
* Log sets
* Edit sets
* Use rest timer
* Add notes
* Complete workout
* View cached previous performance

Data must be stored locally first.

When internet becomes available, data should synchronize with Firebase.

---

# 6.29 CLOUD SYNC

Firebase should provide cloud persistence.

Sync requirements:

* Upload completed workouts
* Upload split configuration
* Upload exercise configuration
* Upload user settings
* Download user history
* Resolve basic synchronization conflicts

The local database should remain the primary source during active workout logging.

---

# 6.30 AUTHENTICATION

Authentication should use Firebase Authentication.

Initial options:

* Google Sign-In
* Email/password

Future options:

* Apple Sign-In
* Anonymous account upgrade

---

# 6.31 SETTINGS

Settings should include:

### Workout

* Default rest timer
* Auto-start rest timer
* Default weight unit
* Default distance unit
* RPE visibility
* RIR visibility

### Appearance

* Light mode
* Dark mode
* System mode

### Data

* Sync status
* Export data
* Delete account
* Backup

---

# 7. NAVIGATION

The application should use five primary tabs.

HOME

PLAN

PROGRESS

HISTORY

PROFILE

---

## HOME

Purpose:

Show the user what to do next.

---

## PLAN

Purpose:

Manage workout splits and exercises.

---

## PROGRESS

Purpose:

View training analytics and progression.

---

## HISTORY

Purpose:

Review completed workouts.

---

## PROFILE

Purpose:

Manage account, preferences, and data.

---

# 8. USER STORIES

## US-001 — Select Split

As a user,

I want to select a workout split,

so that Repshade knows what workouts I follow.

Acceptance Criteria:

* User can select a template.
* User can create a custom split.
* User can reorder workouts.
* User can save the split.

---

## US-002 — View Next Workout

As a user,

I want to immediately see my next workout,

so that I know what to train without navigating through the app.

Acceptance Criteria:

* Home displays the next workout.
* Workout name is visible.
* Start button is visible.

---

## US-003 — Continue After Missing Days

As a user,

I want my workout split to remain where I left it,

so that missing a day does not cause my program to skip a workout.

Acceptance Criteria:

* Calendar date does not advance split position.
* Only completed or intentionally skipped workouts advance the split.

---

## US-004 — Log Sets

As a user,

I want to enter weight and reps,

so that I can record my workout.

Acceptance Criteria:

* Weight can be entered.
* Reps can be entered.
* Set can be marked complete.
* Multiple sets are supported.

---

## US-005 — View Previous Performance

As a user,

I want to see what I did last time,

so that I can make informed decisions about today's workout.

Acceptance Criteria:

* Previous session appears on exercise card.
* Previous values are clearly distinguishable from today's values.

---

## US-006 — Finish Workout

As a user,

I want to finish my workout,

so that my results are saved and my split advances.

Acceptance Criteria:

* Summary is displayed.
* Workout is saved.
* Split advances exactly once.
* Next workout is updated.

---

## US-007 — Recover Interrupted Workout

As a user,

I want an unfinished workout to remain available,

so that closing the app doesn't erase my progress.

Acceptance Criteria:

* Workout state persists locally.
* User can reopen it.
* User can continue or discard it.

---

## US-008 — Track Progress

As a user,

I want to see my performance over time,

so that I can determine whether I am improving.

Acceptance Criteria:

* Exercise history is available.
* Volume history is available.
* PRs are recorded.

---

# 9. EDGE CASES

## Edge Case 1

User starts workout but logs nothing.

Result:

Workout remains in progress.

---

## Edge Case 2

User completes only half the exercises.

Result:

Workout remains in progress.

Split does not advance.

---

## Edge Case 3

User closes app during workout.

Result:

Workout is recoverable.

---

## Edge Case 4

User misses five calendar days.

Result:

Current split position remains unchanged.

---

## Edge Case 5

User intentionally skips workout.

Result:

Split advances once.

---

## Edge Case 6

User accidentally taps Complete twice.

Result:

Split must advance only once.

---

## Edge Case 7

Internet disappears during workout.

Result:

Workout continues normally using local storage.

---

## Edge Case 8

Internet returns after workout.

Result:

Local data synchronizes automatically.

---

## Edge Case 9

User changes split after completing workouts.

The application must preserve historical workouts.

Changing the current program must not modify previous workout records.

---

## Edge Case 10

User deletes an exercise from their plan.

Historical workouts containing that exercise must remain intact.

---

# 10. DATA INTEGRITY REQUIREMENTS

The application must never:

* Delete historical workouts because a program changed
* Change historical set values when the exercise template changes
* Advance the split twice
* Lose an active workout because the application closes
* Require internet to save a set
* Treat a missed calendar day as an automatically skipped workout

---

# 11. PERFORMANCE REQUIREMENTS

The application should:

* Launch quickly
* Display today's workout immediately
* Allow set logging with minimal latency
* Work smoothly during active workouts
* Avoid unnecessary Firebase reads
* Cache frequently accessed data
* Perform synchronization in the background

---

# 12. PRIVACY REQUIREMENTS

User workout data should be private by default.

Users must only be able to access their own:

* Workouts
* Sets
* Splits
* Exercises
* Progress data
* Body-weight records
* Notes

Firebase security rules must enforce user-level data isolation.

---

# 13. MVP DEFINITION

The MVP is complete when a user can:

1. Install Repshade.
2. Create an account.
3. Select a workout split.
4. Customize the split.
5. Create/edit exercises.
6. View their next workout.
7. Start the workout.
8. Enter weight and reps.
9. Complete sets.
10. See previous performance.
11. Use the rest timer.
12. Finish the workout.
13. See a workout summary.
14. Automatically advance to the next workout.
15. Close the app and continue later.
16. Miss multiple days without breaking the split.
17. Intentionally skip a workout.
18. View workout history.
19. View basic progress.
20. Use the core workout experience offline.

---

# 14. V1 SUCCESS CRITERIA

A successful V1 should make the following interaction feel effortless:

OPEN APP

↓

SEE NEXT WORKOUT

↓

START

↓

SEE PREVIOUS PERFORMANCE

↓

ENTER WEIGHT + REPS

↓

COMPLETE SET

↓

REST

↓

REPEAT

↓

FINISH

↓

SEE PROGRESS

↓

NEXT WORKOUT

The user should rarely need to leave the active workout screen.

---

# 15. PRODUCT PRIORITY

### P0 — Must Have

* Authentication
* Onboarding
* Split selection
* Custom splits
* Rolling split engine
* Home
* Workout builder
* Exercise library
* Active workout
* Weight/reps logging
* Previous performance
* Workout completion
* Local persistence
* Firebase sync
* Workout history
* Rest timer

### P1 — Should Have

* PR detection
* Progressive overload
* Supersets
* Dropsets
* Exercise history
* Calendar
* Workout notes
* Body weight
* Progress analytics

### P2 — Future

* Plateau detection
* Deload suggestions
* Progress photos
* Health integrations
* Wearables
* Widgets
* Advanced analytics
* AI assistance

---

# 16. PRODUCT CONSTRAINT

Repshade should remain a focused workout tracker.

Every new feature must answer at least one of these questions:

1. Does it make training easier?
2. Does it make logging faster?
3. Does it help the user understand progression?
4. Does it improve workout consistency?
5. Does it improve the reliability of the workout data?

If the answer is no to all five, the feature should not be prioritized.

---

# 17. FINAL PRODUCT REQUIREMENT

The most important system rule is:

THE CALENDAR DOES NOT ADVANCE THE WORKOUT.

ONLY A COMPLETED OR INTENTIONALLY SKIPPED WORKOUT ADVANCES THE SPLIT.

This rule must be enforced at the application logic level and must not depend on the UI.

