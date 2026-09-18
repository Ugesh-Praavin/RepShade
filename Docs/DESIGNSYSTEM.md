# Repshade UI / Design System

## 1. Document Purpose

This document defines the visual language and reusable UI system for Repshade.

It should be used as the visual foundation for:

* Stitch UI exploration
* Screen design
* Component creation
* React Native implementation
* Design consistency
* Accessibility
* Future feature expansion

This document defines **how Repshade should look and feel**.

It does not define every individual screen. Screen-by-screen specifications will be created separately.

---

# 2. Product Visual Identity

## Product

**Repshade**

## Product Mantra

**TRAIN. LOG. PROGRESS. REPEAT.**

## Core Emotional Qualities

Repshade should feel:

* Strong
* Calm
* Focused
* Personal
* Modern
* Premium
* Minimal
* Reliable
* Fast
* Intelligent without feeling complicated

It should NOT feel:

* Childish
* Over-gamified
* Loud
* Aggressive
* Cluttered
* Like a social network
* Like a calorie-counting app
* Like a bodybuilding forum
* Like a medical application

---

# 3. Primary Visual Direction

## Direction: Dark Performance

The default Repshade experience should be **dark-first**.

The visual language should combine:

* Deep graphite backgrounds
* Warm/light text
* Restrained accent color
* Strong typography
* Large numbers
* Compact workout controls
* Subtle borders
* Minimal shadows
* Clear hierarchy

The interface should resemble a **premium training tool**, not a generic fitness template.

### Design Principle

> The workout should be the most visually important thing on the screen.

During an active workout, the UI should become even more focused and stripped down.

---

# 4. Color System

Use semantic design tokens rather than hard-coded colors throughout the application.

## 4.1 Dark Theme

### Backgrounds

```text
background.primary      #0B0D0F
background.secondary    #121519
background.tertiary     #191D21
background.elevated     #20252A
```

### Text

```text
text.primary            #F5F7F8
text.secondary          #A8B0B7
text.tertiary           #707980
text.disabled           #4D555B
```

### Borders

```text
border.subtle            #242A2F
border.default           #30373D
border.strong            #414A52
```

### Primary Accent

Baseline accent:

```text
accent.primary           #B8F34A
accent.primaryPressed    #A4DD3F
accent.primarySoft       #26331A
```

The accent should be used sparingly.

Use it for:

* Primary CTA
* Completed set state
* Active indicators
* Important progress
* PR indicators
* Selected states
* Key numbers
* Progress chart highlights

Do not flood the interface with accent color.

### Semantic Colors

```text
success                  #6FD08C
warning                  #F2C94C
error                    #FF6B6B
info                     #6EA8FE
```

Semantic colors should communicate state rather than decoration.

---

# 5. Light Theme

A light theme should exist, but Dark Theme is the primary visual experience.

### Backgrounds

```text
background.primary       #F7F8F6
background.secondary     #FFFFFF
background.tertiary      #EEF0ED
background.elevated      #FFFFFF
```

### Text

```text
text.primary             #16191B
text.secondary           #5E666C
text.tertiary            #858D92
text.disabled            #B0B6BA
```

### Borders

```text
border.subtle             #E4E7E5
border.default            #D5D9D7
border.strong             #B9BFBC
```

### Accent

Use the same semantic accent family as the dark theme while adjusting contrast where necessary.

The product identity must remain recognizable across themes.

---

# 6. Color Usage Rules

## Rule 1

Do not use accent color for every important element.

If everything is highlighted, nothing is highlighted.

## Rule 2

Primary CTA = accent.

Secondary CTA = neutral.

Destructive CTA = error.

## Rule 3

Completed sets should have a subtle success/accent treatment.

They should not become giant glowing green blocks.

## Rule 4

Charts should prioritize readability over decoration.

## Rule 5

Avoid gradients in core UI.

Gradients may be explored for marketing or onboarding visuals but should not dominate the product interface.

---

# 7. Typography

Typography should feel strong and functional.

Use a modern sans-serif font with excellent readability.

Recommended baseline:

**Inter**

If unavailable, use the platform/system sans-serif equivalent.

## Type Scale

### Display

```text
Display Large
Size: 36
Weight: 700
Line Height: 42
```

Use for:

* Major workout numbers
* Important progress metrics
* Hero onboarding moments

### Heading 1

```text
Size: 28
Weight: 700
Line Height: 34
```

### Heading 2

```text
Size: 22
Weight: 700
Line Height: 28
```

### Heading 3

```text
Size: 18
Weight: 650
Line Height: 24
```

### Body Large

```text
Size: 16
Weight: 500
Line Height: 24
```

### Body

```text
Size: 15
Weight: 400
Line Height: 22
```

### Body Small

```text
Size: 13
Weight: 400
Line Height: 18
```

### Caption

```text
Size: 12
Weight: 500
Line Height: 16
```

### Numeric / Data

Important workout numbers should use:

```text
Weight: 700
Size: 18–24
```

Large numerical values should have strong visual hierarchy.

Examples:

```text
80 kg
8 reps
3 sets
42 min
12,480 kg
```

---

# 8. Typography Rules

* Use bold typography for actionable data.
* Use regular typography for supporting information.
* Avoid excessive uppercase text.
* Use uppercase sparingly for labels.
* Never use more than 3–4 meaningful text hierarchy levels on one screen.
* Workout numbers should be easier to scan than exercise descriptions.
* Avoid tiny text for important workout information.

---

# 9. Spacing System

Use an 8-point spacing system.

```text
4px   = micro
8px   = xs
12px  = sm
16px  = md
24px  = lg
32px  = xl
40px  = 2xl
48px  = 3xl
64px  = 4xl
```

Primary spacing should generally use:

```text
8
16
24
32
```

Avoid arbitrary spacing values unless necessary.

---

# 10. Screen Layout

Standard mobile horizontal padding:

```text
16px
```

For larger devices:

```text
16–24px
```

Content should not touch screen edges unless intentionally designed to do so.

## Screen Structure

Typical screen:

```text
Safe Area
↓
Header
↓
Primary Content
↓
Supporting Content
↓
Bottom Action Area / Navigation
```

Active workout may use a more compact layout.

---

# 11. Corner Radius

Use restrained rounded corners.

```text
radius.xs       6px
radius.sm       8px
radius.md       12px
radius.lg       16px
radius.xl       20px
radius.full     999px
```

Recommended:

* Inputs: 10–12px
* Cards: 14–16px
* Buttons: 12px
* Pills: full radius
* Bottom sheets: 20px top corners

Avoid excessive pill-shaped UI.

---

# 12. Borders

Cards should primarily be separated through:

* Background contrast
* Spacing
* Subtle borders

Use:

```text
1px solid border.subtle
```

Avoid heavy outlines around every element.

---

# 13. Shadows and Elevation

Repshade should use minimal shadows.

Dark mode should rely primarily on:

* Background contrast
* Borders
* Layering

Rather than large shadows.

Elevation hierarchy:

```text
Level 0
Page background

Level 1
Cards

Level 2
Floating elements

Level 3
Bottom sheets / dialogs

Level 4
Critical overlays
```

Avoid excessive glowing effects.

---

# 14. Iconography

Use a consistent outline icon set.

Recommended:

**Lucide React Native**

Icons should generally be:

```text
16px
20px
24px
```

Primary navigation icons:

```text
24px
```

Icon rules:

* Use icons consistently.
* Do not mix unrelated icon styles.
* Icons should support text, not replace essential text.
* Avoid decorative icons that add no meaning.
* Use familiar symbols whenever possible.

---

# 15. Buttons

## Primary Button

Purpose:

* Start Workout
* Finish Workout
* Save
* Create Split
* Add Exercise

Style:

```text
Background: accent.primary
Text: dark
Height: 48–52px
Radius: 12px
Font Weight: 700
```

Example:

```text
START WORKOUT
```

## Secondary Button

Neutral background with clear text.

Used for:

* Edit
* Add Set
* View History
* Cancel

## Tertiary Button

Text/icon only.

Used for:

* Skip
* Close
* More
* Secondary navigation

## Destructive Button

Used only for destructive actions.

Examples:

* Delete exercise
* Delete workout
* Abandon workout

Destructive actions should never look identical to the primary action.

---

# 16. Button States

Every button must support:

```text
Default
Pressed
Disabled
Loading
Success
```

Pressed state should provide immediate visual feedback.

Loading state should prevent accidental duplicate submissions.

---

# 17. Cards

Cards are used for:

* Next Workout
* Workout templates
* Exercises
* Progress summaries
* History entries
* PRs
* Analytics

A standard card:

```text
Padding: 16px
Radius: 14–16px
Border: subtle
Background: secondary/elevated
```

Cards should have clear hierarchy:

```text
Title
Supporting information
Primary metric/action
Optional secondary action
```

Avoid nesting too many cards inside cards.

---

# 18. Next Workout Card

The Next Workout card is one of the most important components in the application.

It should immediately answer:

> What should I train now?

Example hierarchy:

```text
NEXT WORKOUT

PULL

Back • Biceps

6 exercises
~55 min

[ START WORKOUT ]
```

The card should feel actionable without being visually overwhelming.

---

# 19. Workout Cards

Workout cards should communicate:

* Workout name
* Muscle groups
* Exercise count
* Estimated duration
* Last performed
* Completion state where relevant

Example:

```text
PUSH

Chest • Shoulders • Triceps

7 exercises
Last trained 3 days ago
```

---

# 20. Exercise Cards

Exercise cards should prioritize fast recognition.

Example:

```text
BENCH PRESS
Chest

3 sets × 8–10 reps

Previous
80 kg × 8
80 kg × 8
75 kg × 10
```

During an active workout, exercise cards should become more compact and functional.

---

# 21. Set Row

The set row is one of the most important UI components in Repshade.

It must be extremely fast to use.

Example:

```text
SET     KG       REPS       ✓

1       80       8          ✓
2       80       8          ✓
3       75       10         ✓
```

Recommended fields:

```text
Set number
Weight
Reps
Optional RPE/RIR
Completion control
```

The user should be able to log a set with minimal interaction.

---

# 22. Previous Performance

Previous performance should appear close to the current input.

Example:

```text
PREVIOUS

80 kg × 8
80 kg × 8
75 kg × 10
```

When useful, autofill the previous values.

The user should never need to navigate away from the workout just to remember what they did last time.

---

# 23. Completed Set State

When a set is completed:

* Input becomes visually settled.
* Completion indicator changes.
* Accent/success treatment appears.
* Row remains readable.
* User can still edit if necessary.

Do not permanently lock the set unless the product explicitly requires it.

---

# 24. Workout Header

The active workout header should show:

```text
Workout name
Elapsed time
Optional exercise/set progress
Pause
More
```

Example:

```text
PUSH                         42:18
7 exercises                    ⋯
```

The header should remain compact.

---

# 25. Rest Timer

Rest timer is a functional tool, not a decorative widget.

Example:

```text
REST

01:24

[ +30s ]     [ SKIP ]
```

When active, it should be visually obvious without blocking the entire workout unnecessarily.

The timer should support:

* Start
* Pause
* Resume
* Skip
* Add time
* Finish

---

# 26. Rest Timer Presentation

Preferred hierarchy:

```text
Exercise
↓
Completed Set
↓
Rest Timer
↓
Next Set
```

The timer should feel integrated into the workout rather than like a separate application.

---

# 27. Bottom Navigation

Primary navigation contains five destinations:

```text
Home
Plan
Progress
History
Profile
```

Use icon + label.

Example:

```text
⌂ Home
▣ Plan
↗ Progress
◷ History
◎ Profile
```

Use actual Lucide icons during implementation.

The active destination should use:

* Accent icon
* Strong label
* Clear active state

Inactive items should remain visually quiet.

---

# 28. Bottom Navigation Rules

Do not add navigation items for every feature.

Features should live inside the five primary areas.

Examples:

* Exercise History → Progress
* Workout Details → History
* Settings → Profile
* Split Builder → Plan

---

# 29. Bottom Sheets

Bottom sheets should be used for contextual actions.

Examples:

* Add Exercise
* Set Type
* Exercise Options
* Workout Options
* Filter
* Quick Actions

Bottom sheet structure:

```text
Drag Handle

Title

Content

Actions
```

Use large enough touch targets.

---

# 30. Modals

Use modals only when user attention is genuinely required.

Appropriate:

* Delete confirmation
* Abandon workout confirmation
* Important destructive actions
* Conflict resolution

Avoid modal usage for normal navigation.

---

# 31. Inputs

Inputs should be optimized for gym environments.

Users may have:

* sweaty hands
* limited attention
* poor lighting
* one free hand
* minimal time

Therefore:

* Large touch targets
* Large numeric values
* High contrast
* Minimal typing
* Numeric keyboards where appropriate
* Clear focus states

---

# 32. Weight Input

Weight input should make numerical entry fast.

Example:

```text
WEIGHT

80.0 kg

−       + 
```

Potential interactions:

* Tap value → numeric keyboard
* Increment/decrement buttons
* Previous value autofill

The increment should respect user settings.

Example:

```text
2.5 kg
5 lb
```

---

# 33. Reps Input

Reps should use a numeric input.

Example:

```text
REPS

8
```

Provide quick adjustment where useful.

Avoid forcing users through complicated pickers.

---

# 34. Set Type Indicators

Support:

```text
Warm-up
Working
Drop
Failure
AMRAP
Rest-pause
```

However, the standard working set should remain the default.

Special set types should not visually overwhelm the normal workflow.

---

# 35. Superset UI

Supersets should visually group exercises.

Example:

```text
SUPERSET A

A1  BICEP CURL
A2  TRICEP PRESSDOWN
```

Use a subtle grouping indicator.

Do not require users to navigate through separate screens for each exercise.

---

# 36. Progress Indicators

Progress indicators should answer useful questions.

Examples:

```text
Workout
4 / 7 exercises

Weekly
3 / 4 workouts

Split
Pull → Legs → Push
```

Avoid meaningless progress bars.

---

# 37. Progress Charts

Charts should be:

* Minimal
* Readable
* Interactive where useful
* Data-focused

Possible charts:

* Weight over time
* Reps over time
* Volume over time
* Estimated 1RM
* Workout frequency
* Body weight

Avoid charts simply because they look impressive.

---

# 38. Chart Design

Chart hierarchy:

```text
Metric
Current value
Change
Chart
Time range
```

Example:

```text
BENCH PRESS

82.5 kg
+5 kg

[ chart ]

4W   3M   6M   1Y
```

Use the accent only for the primary data series.

---

# 39. PR Indicators

Personal records should be visually recognizable.

Example:

```text
NEW PR

Bench Press
82.5 kg × 6
```

Use restrained success/accent styling.

PR celebrations should be satisfying but brief.

---

# 40. Calendar Design

The calendar is a **history representation**, not the source of the training split.

It should show:

* Training days
* Rest days
* Workout type
* Completed sessions

Do not visually imply:

> "You missed this day, therefore your next workout changed."

Calendar UI should communicate:

> "This is when you trained."

---

# 41. Rolling Split UI

The split position should be visible when useful.

Example:

```text
YOUR SPLIT

PUSH → PULL → LEGS

NEXT
PULL
```

After completing Push:

```text
PUSH ✓

NEXT
PULL
```

Missed days should not alter this position.

---

# 42. Missed Day State

Repshade should never shame the user for missing a workout.

Avoid:

```text
You missed your workout!
You're falling behind!
```

Prefer:

```text
Ready when you are.

NEXT WORKOUT
PULL
```

The application should feel neutral and supportive.

---

# 43. Empty States

Empty states should be useful, not decorative.

Example:

```text
NO WORKOUTS YET

Complete your first workout
to start building your history.

[ START WORKOUT ]
```

Each empty state should contain:

1. Clear explanation
2. Relevant next action

---

# 44. Error States

Errors should be:

* Clear
* Human-readable
* Actionable
* Non-blaming

Bad:

```text
Error 500.
```

Better:

```text
Something went wrong while saving your workout.

Your workout is still stored on this device.

[ TRY AGAIN ]
```

---

# 45. Offline State

Offline functionality is a core product capability.

The UI should clearly communicate offline status without constantly distracting the user.

Possible indicator:

```text
Offline
```

or:

```text
Offline • Saved locally
```

The user should still be able to:

* Start workouts
* Log sets
* Finish workouts
* View previous data
* Edit workouts

---

# 46. Sync State

Use subtle synchronization indicators.

States:

```text
Synced
Syncing…
Offline
Sync pending
Sync failed
```

Example:

```text
✓ Synced
```

Do not make sync status a dominant UI element.

---

# 47. Workout Recovery

If an active workout exists after the app is reopened:

```text
WORKOUT IN PROGRESS

Push
Started 38 min ago

[ RESUME ]
[ DISCARD ]
```

Resume should be the obvious primary action.

---

# 48. Confirmation Patterns

Do not ask for confirmation unnecessarily.

No confirmation needed:

* Completing a normal set
* Starting workout
* Adding exercise
* Editing weight

Confirmation generally required:

* Abandon workout
* Delete workout
* Delete exercise
* Reset split
* Delete account
* Destructive data actions

---

# 49. Loading States

Prefer skeletons for larger content areas.

For actions:

```text
Saving…
Syncing…
Creating…
```

Avoid full-screen loading whenever the local database can provide data immediately.

---

# 50. Motion Design

Motion should be subtle and functional.

Use animation for:

* Screen transitions
* Set completion
* Timer appearance
* Bottom sheets
* Progress updates
* Expand/collapse
* Success feedback

Avoid:

* Excessive bouncing
* Constant animations
* Distracting particle effects
* Long transitions

Recommended general animation duration:

```text
Fast:      120–180ms
Standard:  200–300ms
Slow:      300–400ms
```

Workout interactions should feel immediate.

---

# 51. Haptic Feedback

Use haptics selectively.

Good use cases:

* Set completed
* Workout completed
* PR achieved
* Button confirmation
* Timer finished
* Destructive action warning

Do not vibrate for every tap.

Haptics should reinforce important physical actions.

---

# 52. Workout Completion Experience

Finishing a workout should feel satisfying.

The completion screen should emphasize:

```text
WORKOUT COMPLETE

PULL

58 min
18 sets
7,420 kg volume

+1 workout

[ DONE ]
```

If a PR occurred:

```text
NEW PR
Bench Press
82.5 kg × 6
```

Keep celebration focused.

Do not turn completion into a game screen filled with badges and points.

---

# 53. Visual Hierarchy

Every screen should have one primary question.

Examples:

Home:

> What should I train now?

Plan:

> What does my program look like?

Progress:

> Am I getting stronger?

History:

> What have I done?

Profile:

> How is Repshade configured?

Active Workout:

> What do I need to log next?

---

# 54. Information Density

Repshade should favor **high information density with low visual complexity**.

This means:

* More useful information
* Fewer decorative elements
* Strong typography
* Clear grouping
* Minimal scrolling where possible
* No unnecessary cards

---

# 55. Gym-Friendly Design Principles

The app should work while the user is actively training.

Therefore:

### Large Touch Targets

Minimum recommended interactive target:

```text
44 × 44px
```

Prefer larger controls for set logging.

### Fast Scanning

The user should understand a workout card within seconds.

### Minimal Typing

Use:

* Previous performance
* Autofill
* Numeric inputs
* Quick increment/decrement

### Strong Contrast

Important values must remain readable in different lighting conditions.

### One-Hand Friendly

Primary controls should be reachable and comfortable.

---

# 56. Accessibility

Accessibility is required, not optional.

## Requirements

* Sufficient color contrast
* Screen reader labels
* Accessible touch targets
* Do not communicate state through color alone
* Dynamic text support where practical
* Clear focus states
* Semantic labels
* Meaningful button names

Example:

Do not rely only on:

```text
Green = completed
```

Also provide:

```text
Completed
```

---

# 57. Dark Mode Accessibility

Dark mode must not simply invert colors.

Avoid:

* Pure white text everywhere
* Extremely bright accent backgrounds
* Very low-contrast gray text
* Thin borders that disappear

Use warm/light text and restrained contrast levels.

---

# 58. Responsive Design

Primary target:

```text
Mobile portrait
```

Support:

* Small phones
* Standard phones
* Large phones

The layout should adapt rather than simply scale.

Avoid designing exclusively around one device size.

---

# 59. Landscape

Landscape support is not a priority for MVP.

If supported later, workout logging should remain usable.

---

# 60. Component Design Philosophy

Components should be:

* Reusable
* Composable
* Small
* Predictable
* Accessible
* Theme-aware

Avoid giant components containing:

* UI
* business logic
* Firebase calls
* database operations
* navigation logic

Business logic belongs outside presentation components.

---

# 61. Core Component Library

Initial reusable components should include:

```text
AppButton
IconButton
TextButton
AppText
Screen
ScreenHeader
Card
WorkoutCard
NextWorkoutCard
ExerciseCard
SetRow
SetInput
WeightInput
RepInput
RestTimer
ProgressBar
ProgressChart
StatCard
PRBadge
WorkoutSummary
BottomSheet
Modal
ConfirmDialog
EmptyState
ErrorState
OfflineBanner
SyncIndicator
TabBar
SectionHeader
Avatar
Chip
Divider
```

---

# 62. Component State Standard

Interactive components should define:

```text
Default
Pressed
Focused
Disabled
Loading
Selected
Completed
Error
```

Not every component needs every state, but states must be intentionally designed.

---

# 63. Design Tokens

Implementation should centralize tokens.

Example:

```text
colors.background.primary
colors.background.secondary

colors.text.primary
colors.text.secondary
colors.text.tertiary

colors.border.subtle
colors.border.default

colors.accent.primary
colors.accent.primaryPressed

colors.success
colors.warning
colors.error
colors.info

spacing.xs
spacing.sm
spacing.md
spacing.lg
spacing.xl

radius.sm
radius.md
radius.lg
radius.xl

typography.display
typography.h1
typography.h2
typography.h3
typography.body
typography.bodySmall
typography.caption
```

Never scatter raw design values throughout the application.

---

# 64. Stitch Design Guidance

When creating Repshade screens in Stitch:

## Start With

Create a visual foundation before designing every screen.

First explore:

1. Home
2. Active Workout
3. Plan
4. Progress
5. History
6. Profile

These screens establish most of the design system.

## Stitch should explore

* Dark Performance
* Minimal dark
* Dark + electric accent
* Typography-heavy layouts
* Compact workout cards
* Strong numeric hierarchy

However, all explorations should preserve the Repshade principles.

---

# 65. Stitch Prompt Principles

When prompting Stitch:

```text
Design a premium mobile workout tracking application called Repshade.

The product is dark-first, minimal, calm, strong and performance-focused.

Avoid generic fitness-app aesthetics.

Prioritize workout execution and fast set logging.

Use deep graphite backgrounds, warm white typography, subtle borders and a restrained electric lime accent.

Use large, highly readable workout numbers.

Avoid excessive gradients, cards, badges, gamification, social-feed patterns and decorative elements.

The interface should feel like a premium training tool used in a real gym.
```

This baseline should be adapted for individual screens later.

---

# 66. Home Screen Visual Priority

Home should prioritize:

```text
Greeting
↓
Next Workout
↓
Start Workout
↓
Recent Progress
↓
Recent Activity
```

The Next Workout should dominate.

The user should not need to scroll through statistics before starting their workout.

---

# 67. Active Workout Visual Priority

Active Workout should prioritize:

```text
Workout name
↓
Current exercise
↓
Previous performance
↓
Set inputs
↓
Complete set
↓
Rest
↓
Next exercise
```

Everything else is secondary.

---

# 68. Progress Screen Visual Priority

Progress should prioritize:

```text
Overall progress
↓
Key metrics
↓
Exercise progress
↓
Charts
↓
PRs
```

The user should be able to answer:

> "Am I improving?"

without interpreting complicated analytics.

---

# 69. History Screen Visual Priority

History should prioritize:

```text
Calendar / timeline
↓
Workout frequency
↓
Recent workouts
↓
Workout details
```

History is a record, not a motivational scoreboard.

---

# 70. Profile Screen Visual Priority

Profile should remain simple.

Potential sections:

```text
Profile
Preferences
Units
Notifications
Theme
Account
Data
About
```

Do not turn Profile into a dashboard.

---

# 71. Visual Anti-Patterns

Do not use:

### Excessive Neon

Repshade is not a cyberpunk app.

### Excessive Gradients

They add visual noise.

### Giant Hero Images

The product is about training data and execution.

### Social Feed Cards

No feed-style design.

### Gamification Overload

Avoid:

* XP
* Coins
* Streak fireworks
* Leaderboards
* Badges everywhere

### Excessive Empty Space

Minimal does not mean inefficient.

### Excessive Cards

Not every section needs a card.

### Tiny Controls

Workout logging requires large touch targets.

### Excessive Modals

Keep users inside the workout flow.

---

# 72. Brand Voice in UI

UI copy should be:

* Direct
* Calm
* Short
* Human
* Confident

Examples:

Good:

```text
Ready when you are.
```

```text
Next: Pull
```

```text
Workout complete.
```

```text
New PR.
```

```text
Saved locally.
```

Avoid:

```text
YOU'RE CRUSHING IT!!! 🔥🔥🔥
```

```text
DON'T BREAK YOUR STREAK!!!
```

```text
OMG AMAZING!!!
```

Repshade should motivate through clarity and progress, not pressure.

---

# 73. Design System Golden Rules

1. **Workout first.**
2. **Make important numbers obvious.**
3. **Keep set logging extremely fast.**
4. **Use accent color sparingly.**
5. **Prefer hierarchy over decoration.**
6. **Use spacing to organize information.**
7. **Never shame missed workouts.**
8. **Do not over-gamify.**
9. **Offline capability should feel normal.**
10. **Previous performance should always be easy to access.**
11. **Every interaction should have clear feedback.**
12. **The UI should remain useful with one hand.**
13. **The active workout should be the simplest experience in the app.**
14. **Do not sacrifice usability for visual novelty.**
15. **Repshade should feel like a training tool, not a social platform.**

---

# 74. Final Visual Definition

Repshade should look like:

> **A premium, dark-first, minimal training instrument designed around the physical act of working out.**

The interface should combine:

```text
Graphite surfaces
+
Warm high-contrast typography
+
Electric accent
+
Large workout numbers
+
Compact controls
+
Subtle borders
+
Minimal motion
+
Fast interactions
+
Clear progress visualization
```

The final experience should communicate:

**TRAIN. LOG. PROGRESS. REPEAT.**

without ever getting in the user's way.
