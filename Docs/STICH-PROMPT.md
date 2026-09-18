# Repshade Stitch Design Prompt Pack

## 1. Purpose

This document contains the copy-paste-ready prompts for designing Repshade in Stitch.

Use these prompts after the product, UX, architecture, data and design-system documents have been established.

The goal is to make Stitch generate a **coherent product system**, not a collection of unrelated screens.

The prompts should be used in sequence.

---

# 2. Global Design Context

Paste this context before designing Repshade screens when necessary.

```text
Design a premium mobile workout tracking application called Repshade.

Repshade is a simple, offline-friendly workout tracker built around one core idea:

"The calendar tells you when you trained. Your split tells you what you train next."

The product follows a Rolling Split.

Example:
Push → Pull → Legs

If the user completes Push on Monday and does not train Tuesday or Wednesday, Thursday still shows Pull.

Missing a calendar day does NOT advance the split.

Only:
1. Completing a workout
2. Manually skipping a workout

advance the split.

Repshade is not a social network, nutrition tracker, calorie counter, trainer marketplace, medical app, or gamified fitness community.

Product mantra:

TRAIN. LOG. PROGRESS. REPEAT.

The visual identity should be:

- Dark-first
- Premium
- Minimal
- Calm
- Strong
- Performance-focused
- High contrast
- Typography-led
- Data-focused
- Gym-friendly

Use a deep graphite background, warm off-white typography, subtle borders and a restrained electric lime accent.

Avoid:
- Excessive gradients
- Neon overload
- Excessive shadows
- Social feed patterns
- Gamification
- Badges everywhere
- Streak pressure
- Motivational clichés
- Giant fitness photography
- Clutter

The workout experience is the most important part of the application.

The user should be able to look, enter, tap, rest and repeat with minimal friction.
```

---

# 3. Stitch Design Strategy

Do not attempt to generate the entire application as one giant design request.

Design the product progressively.

Recommended order:

```text
1. Visual foundation
2. Home
3. Active Workout
4. Plan
5. Workout Details
6. Progress
7. History
8. Profile
9. Supporting states
10. Edge cases
```

The Home and Active Workout screens should establish the design language for the rest of the application.

---

# 4. Prompt 01 — Design System Foundation

```text
Create the visual design foundation for Repshade.

Design a mobile-first dark fitness application with a premium performance-tool aesthetic.

Use:

- Deep graphite background
- Warm white primary text
- Muted gray secondary text
- Subtle dark borders
- Restrained electric lime accent
- Modern sans-serif typography
- Large readable workout numbers
- Compact information hierarchy
- 8px spacing system
- 12–16px card radius
- Minimal shadows
- Outline iconography

Create reusable visual patterns for:

- Primary button
- Secondary button
- Text button
- Icon button
- Card
- Workout card
- Exercise card
- Set row
- Numeric input
- Bottom sheet
- Modal
- Chip
- Progress indicator
- Stat card
- PR indicator
- Empty state
- Error state
- Offline indicator
- Sync indicator
- Bottom navigation

The visual language should feel consistent, restrained and premium.

Do not make it look like a generic fitness template.

The design should prioritize function over decoration.
```

---

# 5. Prompt 02 — Home Screen

```text
Design the Repshade Home screen.

The primary purpose of Home is to answer:

"What should I train now?"

Use a dark-first premium mobile UI.

Top area:

- Simple greeting
- Minimal profile/avatar indicator
- Optional sync/offline status

Main content:

A large "NEXT WORKOUT" card.

Example:

NEXT WORKOUT

PULL

Back • Biceps

6 exercises
~50 min

[ START WORKOUT ]

This card should dominate the screen.

Below it show:

THIS WEEK

3 workouts
18 sets
12,480 kg volume

Then:

RECENT

Push
Yesterday

Legs
3 days ago

Pull
5 days ago

Use strong numeric hierarchy.

Do not use motivational quotes.

Do not use streak counters.

Do not use social content.

Do not use large workout photography.

The screen should feel calm, focused and immediately actionable.

The Start Workout button should be the strongest CTA.
```

---

# 6. Prompt 03 — Home Missed-Day State

```text
Create an alternate Repshade Home state for a user who has not trained for several days.

Do NOT show guilt, missed-workout counters or streak warnings.

The user should see:

READY WHEN YOU ARE.

NEXT WORKOUT

PULL

Back • Biceps

6 exercises
~50 min

[ START WORKOUT ]

The UI should communicate that the user's split has remained unchanged.

Do not say:

"You missed your workout."

Do not say:

"You're falling behind."

Do not show:

- Broken streak
- Missed workout count
- Shame messaging

Keep the design neutral, supportive and confident.
```

---

# 7. Prompt 04 — Home Workout-In-Progress State

```text
Design the Repshade Home screen when the user has an unfinished workout.

The unfinished workout should become the primary action.

Show:

WORKOUT IN PROGRESS

PULL

7 sets completed
28 min elapsed

[ RESUME WORKOUT ]

Below that, show the normal Next Workout information in a secondary position.

The Resume Workout CTA should clearly dominate.

The design should communicate that the workout was safely preserved.

Use subtle language:

"Saved locally"

if the app is offline.

Do not make the user feel like they made a mistake by leaving the workout.
```

---

# 8. Prompt 05 — Active Workout

```text
Design the most important screen in Repshade: Active Workout.

This screen must be optimized for real gym usage.

The user may have:
- One free hand
- Sweaty hands
- Limited attention
- Poor lighting
- Minimal time

The interface must therefore be extremely readable and fast.

Header:

←   PULL                       42:18   ⋯

7 exercises

Current exercise:

LAT PULLDOWN

Back

Previous

70 kg × 10
70 kg × 9
65 kg × 10

Current sets:

SET     KG      REPS

1       70      10      ✓
2       70      9       ✓
3       65      10      ✓

[ + ADD SET ]

[ START REST ]

Then show the next exercise below.

Prioritize:

1. Current exercise
2. Previous performance
3. Set inputs
4. Completion controls
5. Rest

Use large numeric values and large touch targets.

Do not make the screen visually busy.

Do not hide set logging behind menus.

Do not use unnecessary illustrations.

This should feel like a premium training instrument.
```

---

# 9. Prompt 06 — Active Workout Set Logging

```text
Design the set logging component for Repshade.

The set row is one of the most important components in the application.

Create a highly readable row:

SET     KG      REPS      STATUS

1       80       8        ✓
2       80       8        ✓
3       75       10       ✓

Weight and reps must be easy to edit.

Use large numeric typography.

Completed sets should receive subtle accent/success treatment.

The completed state should remain readable.

Provide:

- Default state
- Active input state
- Completed state
- Error state
- Disabled state

Do not make completed rows bright glowing green.

The component must feel fast and practical in a real gym.
```

---

# 10. Prompt 07 — Previous Performance

```text
Design the Previous Performance component for Repshade.

Place previous workout information directly next to the current exercise and set logging area.

Example:

PREVIOUS

80 kg × 8
80 kg × 8
75 kg × 10

The information should be visually secondary to the current workout but immediately accessible.

Use muted typography and compact spacing.

The component should help the user remember what they previously lifted without navigating away from the workout.

Include an optional "Use previous" or autofill interaction without making it visually dominant.
```

---

# 11. Prompt 08 — Rest Timer

```text
Design the Repshade rest timer.

The rest timer should feel integrated into the workout rather than like a separate application.

Show:

RESTING

01:24

[ +30s ]

[ SKIP REST ]

Use large timer typography.

The timer should be visually obvious but should not unnecessarily block the workout.

Explore a compact bottom panel or bottom-sheet treatment.

Create states for:

- Active
- Paused
- Completed
- Skipped

The design should be calm and functional.

Avoid excessive animation or glowing effects.
```

---

# 12. Prompt 09 — Pause Workout

```text
Design the Repshade Pause Workout state.

Show:

WORKOUT PAUSED

PULL

12 sets completed
31 min elapsed

[ RESUME WORKOUT ]

[ END WORKOUT ]

Resume Workout is the primary action.

The screen should reassure the user that workout data has been preserved.

Keep the interface minimal.

Do not introduce unnecessary warnings.
```

---

# 13. Prompt 10 — Leave Workout Confirmation

```text
Design a Repshade confirmation modal for leaving an active workout.

Show:

LEAVE WORKOUT?

Your workout is saved locally
and can be resumed.

[ KEEP WORKOUT ]

[ END WORKOUT ]

[ CANCEL ]

"KEEP WORKOUT" should be the safest and most obvious action.

Use a restrained modal.

Do not use alarming visual treatment unless the user is actually about to lose data.
```

---

# 14. Prompt 11 — Workout Completion

```text
Design the Repshade workout completion screen.

The experience should feel satisfying but restrained.

Show:

WORKOUT COMPLETE

PULL

58 min

18 sets
7,420 kg volume

PERSONAL RECORDS

NEW PR
Barbell Row
80 kg × 8

NEXT WORKOUT

LEGS

[ DONE ]

Use strong typography and clean spacing.

If there are no PRs, simply omit the PR section.

Do not add:
- XP
- Coins
- Streak celebrations
- Confetti
- Badges
- Leaderboards

The accomplishment should come from the actual training data.
```

---

# 15. Prompt 12 — Plan Screen

```text
Design the Repshade Plan screen.

Purpose:

Show the user's training split and workouts.

Top:

PLAN

YOUR SPLIT

Push → Pull → Legs

NEXT

Pull

Then show workout cards:

PUSH
7 exercises

PULL
6 exercises

LEGS
8 exercises

[ + ADD WORKOUT ]

Clearly indicate the current split position.

The design should make it obvious that the split sequence determines what comes next.

Do not present the calendar as the driver of the program.
```

---

# 16. Prompt 13 — Workout Template

```text
Design the Repshade Workout Template Details screen.

Example:

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

Each exercise should be visually easy to scan.

Provide subtle drag/reorder affordances when editing.

Do not over-card the interface.
```

---

# 17. Prompt 14 — Add Exercise

```text
Design the Repshade Add Exercise screen as a fast exercise-selection experience.

Top:

ADD EXERCISE

[ Search exercises ]

Sections:

RECENT

Bench Press
Lat Pulldown
Lateral Raise

POPULAR

Barbell Squat
Deadlift
Bench Press

Allow users to quickly search and select exercises.

Use compact rows rather than large cards.

Include a clear option:

[ + CREATE CUSTOM EXERCISE ]

The experience should feel fast and utilitarian.
```

---

# 18. Prompt 15 — Exercise Configuration

```text
Design the Repshade Exercise Configuration screen.

Example:

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

Advanced settings should be hidden or collapsed by default.

Advanced options may include:

- RPE
- RIR
- Warm-up sets
- Superset
- Dropset

The basic configuration must remain simple.
```

---

# 19. Prompt 16 — Progress Overview

```text
Design the Repshade Progress screen.

Purpose:

Answer:

"Am I getting better?"

Show:

PROGRESS

THIS MONTH

12 workouts
68 sets
48,320 kg volume

STRENGTH

Bench Press
+7.5 kg

Squat
+10 kg

Deadlift
+15 kg

PERSONAL RECORDS

3 new PRs

[ VIEW ALL ]

Use clean data visualization.

Do not overwhelm the user with analytics.

The most useful metrics should be visible first.
```

---

# 20. Prompt 17 — Exercise Progress

```text
Design the Repshade Exercise Progress screen.

Example:

BENCH PRESS

82.5 kg × 6

+5 kg since first logged

STRENGTH

[ minimal line chart ]

4W   3M   6M   1Y

RECENT

82.5 × 6
80 × 8
80 × 8
77.5 × 8

The chart should be minimal and highly readable.

Current performance should be visually dominant.

Use the accent color only for the primary data series.

Avoid overly complex analytics.
```

---

# 21. Prompt 18 — Personal Records

```text
Design the Repshade Personal Records screen.

Show:

PERSONAL RECORDS

RECENT PRs

Bench Press
82.5 kg × 6

Squat
120 kg × 5

Deadlift
160 kg × 3

Then:

ALL RECORDS

Chest
Shoulders
Back
Legs
Arms

PRs should feel meaningful but restrained.

Avoid gamified trophy-room aesthetics.
```

---

# 22. Prompt 19 — History

```text
Design the Repshade History screen.

Show a clean calendar/timeline combination.

Top:

HISTORY

September 2026

Calendar

Then:

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

Completed workout days should be visually identifiable.

Empty calendar days should remain neutral.

Do not use red or negative styling for missed days.
```

---

# 23. Prompt 20 — Workout Details

```text
Design the Repshade historical Workout Details screen.

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

BARBELL ROW

80 × 8
80 × 8
75 × 10

The screen should feel like a permanent training record.

Historical data should be highly readable.

Do not allow the visual treatment to imply that historical workouts can be accidentally changed.
```

---

# 24. Prompt 21 — Profile

```text
Design the Repshade Profile screen.

Keep it simple.

Show:

PROFILE

User name

PREFERENCES
Units
Appearance
Notifications

ACCOUNT
Account
Data

ABOUT
About Repshade
Privacy
Terms

Use simple list rows with clear hierarchy.

Do not turn Profile into another analytics dashboard.
```

---

# 25. Prompt 22 — Settings

```text
Design the Repshade Settings screen.

Group settings into clear sections:

TRAINING

Default rest
Weight unit
Rep preferences

APPEARANCE

Theme

NOTIFICATIONS

Workout reminders
Rest timer

ACCOUNT

Email
Password

DATA

Export data
Delete data

Use simple, readable rows.

Avoid complicated settings cards.
```

---

# 26. Prompt 23 — Offline State

```text
Design Repshade's offline state.

The application must continue to work normally when offline.

Show a subtle indicator:

Offline • Saved locally

Do not block:

- Starting workouts
- Logging sets
- Completing workouts
- Viewing history
- Viewing previous performance

Offline status should be visible but not distracting.

Use a small status indicator rather than a large warning screen.
```

---

# 27. Prompt 24 — Sync State

```text
Design Repshade synchronization states.

Create subtle UI states for:

✓ Synced

Syncing…

Offline

Sync pending

Sync failed

The sync indicator should never dominate the screen.

Example:

Sync pending

Your data is safely stored
on this device.

[ TRY AGAIN ]

The interface should communicate reliability and trust.
```

---

# 28. Prompt 25 — Empty States

```text
Design reusable empty states for Repshade.

Style:

TITLE

Short explanation.

[ PRIMARY ACTION ]

Examples:

NO WORKOUTS YET

Complete your first workout
to start building your history.

[ START WORKOUT ]

NO PRs YET

Keep training and your
personal records will appear here.

NO HISTORY YET

Your completed workouts
will appear here.

Empty states should be calm and useful.

Avoid giant illustrations.
```

---

# 29. Prompt 26 — Error States

```text
Design reusable error states for Repshade.

Example:

SOMETHING WENT WRONG

Your workout is still stored
on this device.

[ TRY AGAIN ]

Create variants for:

- Network error
- Sync error
- Save error
- Loading error
- Invalid input

Use clear human language.

Do not show technical error codes to normal users.
```

---

# 30. Prompt 27 — Manual Skip

```text
Design the Repshade Manual Skip interaction.

Current Home state:

NEXT WORKOUT

PULL

[ START WORKOUT ]

More menu:

Skip this workout

Confirmation:

SKIP PULL?

Your next workout will become
LEGS.

This will not create a workout
record.

[ SKIP ]

[ CANCEL ]

After skipping:

NEXT WORKOUT

LEGS

Make the behavior extremely clear.

The user must understand that manual skip advances the rolling split without creating a workout record.
```

---

# 31. Prompt 28 — Custom Split Builder

```text
Design the Repshade Custom Split Builder.

Show:

CREATE YOUR SPLIT

Split name
[ My Training ]

WORKOUTS

☰ Push
☰ Pull
☰ Legs

[ + ADD WORKOUT ]

[ SAVE SPLIT ]

Users should be able to drag workouts to reorder them.

The interface should communicate:

Order matters.

The split order determines the next workout.

Keep the builder simple and mobile-friendly.
```

---

# 32. Prompt 29 — Quick Workout

```text
Design the Repshade Quick Workout screen.

Purpose:

Allow a user to perform a one-off workout without changing their normal planned split.

Show:

QUICK WORKOUT

Start a one-off workout.

[ START EMPTY WORKOUT ]

or

[ ADD EXERCISES ]

Include a short explanation:

"This workout is recorded separately from your current split."

Keep the screen minimal.
```

---

# 33. Prompt 30 — Workout Recovery

```text
Design the Repshade Workout Recovery screen.

This appears when the app is reopened while an unfinished workout exists.

Show:

WORKOUT IN PROGRESS

PULL

Started 28 min ago

7 sets logged

[ RESUME ]

[ DISCARD ]

Resume must be the primary action.

The user should trust that their workout data was preserved.
```

---

# 34. Prompt 31 — Light Theme

```text
Create a light-theme version of Repshade.

Preserve the same design system and component hierarchy.

Use:

- Warm off-white background
- White elevated surfaces
- Dark charcoal text
- Muted gray secondary text
- Subtle borders
- Same restrained electric accent

Do not redesign the application.

The light theme should feel like the same product.

Preserve:
- Typography
- Spacing
- Component sizes
- Navigation
- Interaction patterns
- Visual hierarchy
```

---

# 35. Prompt 32 — Bottom Navigation

```text
Design Repshade's five-item bottom navigation.

Items:

Home
Plan
Progress
History
Profile

Use simple outline icons and labels.

Active item:
- Accent icon
- Strong label
- Clear active indicator

Inactive items:
- Muted
- Visually quiet

The navigation should feel premium and minimal.

Do not add navigation items for individual features.
```

---

# 36. Prompt 33 — Mobile Interaction Refinement

```text
Refine the Repshade UI specifically for one-handed mobile use.

Prioritize:

- 44px minimum touch targets
- Large set controls
- Numeric inputs
- Bottom-reachable primary actions
- Minimal typing
- Clear pressed states
- Strong contrast
- Keyboard-aware layouts
- Safe-area support

The active workout should require as little navigation as possible.

Optimize for actual gym usage rather than presentation screenshots.
```

---

# 37. Prompt 34 — Accessibility Refinement

```text
Audit and refine the Repshade UI for accessibility.

Ensure:

- Strong text contrast
- Large touch targets
- Accessible labels
- Clear focus states
- Screen-reader-friendly controls
- State is not communicated by color alone
- Important numbers remain readable
- Buttons have clear names
- Interactive elements are easy to identify

Completed sets must communicate completion through icon/text/state, not color alone.

Maintain the premium minimal aesthetic while improving accessibility.
```

---

# 38. Prompt 35 — Final Visual Polish

```text
Perform a final visual refinement pass on the Repshade mobile application.

The result should feel:

- Premium
- Minimal
- Calm
- Strong
- Focused
- Modern
- Gym-friendly

Improve:

- Alignment
- Spacing
- Typography hierarchy
- Component consistency
- Button hierarchy
- Card consistency
- Icon consistency
- Touch target sizing
- Data readability
- Navigation clarity

Remove:

- Unnecessary decorative elements
- Excessive cards
- Excessive borders
- Excessive shadows
- Excessive accent color
- Generic fitness-app patterns
- Gamification
- Motivational clutter

The application should feel like a serious training instrument.
```

---

# 39. Stitch Review Checklist

After generating the designs, review every screen against this checklist.

## Brand

* Does it look like Repshade?
* Is the dark-first identity consistent?
* Is the accent restrained?

## Hierarchy

* Is the most important action obvious?
* Can the user understand the screen in seconds?
* Are important numbers visually dominant?

## Workout

* Can the user log sets quickly?
* Is previous performance visible?
* Are touch targets large enough?
* Can the user train without unnecessary navigation?

## Rolling Split

* Is the next workout clear?
* Does the UI avoid implying that missed days advance the split?
* Is manual skip clearly different from completing a workout?

## Data

* Is progress understandable?
* Is history readable?
* Are PRs meaningful without gamification?

## Offline

* Is offline status clear but unobtrusive?
* Does the UI imply that data is safe locally?

## Accessibility

* Is text readable?
* Are controls large enough?
* Does state rely on more than color?

## Consistency

* Same buttons?
* Same typography?
* Same spacing?
* Same radius?
* Same icons?
* Same navigation?

---

# 40. Screens That Require Extra Attention

The following screens deserve the most iteration in Stitch:

## #1 Active Workout

This is the core product experience.

## #2 Home

This is the primary entry point.

## #3 Workout Summary

This closes the training loop.

## #4 Progress

This demonstrates long-term value.

## #5 Plan

This communicates the Rolling Split.

---

# 41. Final Stitch Acceptance Criteria

The Stitch design is ready for implementation when:

* Every major screen has a defined layout.
* Dark theme is complete.
* Light theme is defined.
* Navigation is consistent.
* Active workout is fully designed.
* Set logging states are defined.
* Rest timer states are defined.
* Workout completion is defined.
* Manual skip is defined.
* Workout recovery is defined.
* Offline states are defined.
* Sync states are defined.
* Empty states are defined.
* Error states are defined.
* Components are visually reusable.
* Typography is consistent.
* Spacing is consistent.
* Touch targets are appropriate.
* The Rolling Split concept is visually understandable.
* No major screen requires the developer to invent the UX.

---

# 42. Final Stitch Objective

The final Stitch output should answer three questions instantly:

### When I open Repshade:

**What should I train?**

### When I start training:

**What should I log?**

### After months of training:

**Am I progressing?**

Everything else is secondary.

The visual system exists to make those three experiences exceptionally clear.

---

# 43. Design North Star

When deciding between two UI approaches, choose the one that:

* Requires fewer taps
* Requires less reading
* Makes important data clearer
* Keeps the user inside the workout
* Works offline
* Reduces cognitive load
* Preserves user control
* Looks calm rather than noisy

The final design should feel like:

> **A quiet training partner that gets out of the way when you start lifting.**
