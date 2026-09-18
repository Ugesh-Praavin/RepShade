---
name: Dark Performance
colors:
  surface: '#121416'
  surface-dim: '#121416'
  surface-bright: '#38393c'
  surface-container-lowest: '#0c0e10'
  surface-container-low: '#1a1c1e'
  surface-container: '#1e2022'
  surface-container-high: '#282a2c'
  surface-container-highest: '#333537'
  on-surface: '#e2e2e5'
  on-surface-variant: '#c3c9b0'
  inverse-surface: '#e2e2e5'
  inverse-on-surface: '#2f3033'
  outline: '#8d937c'
  outline-variant: '#434936'
  surface-tint: '#9fd830'
  primary: '#fcffec'
  on-primary: '#233600'
  primary-container: '#b8f34a'
  on-primary-container: '#4c6d00'
  inverse-primary: '#486800'
  secondary: '#c5c6cc'
  on-secondary: '#2e3135'
  secondary-container: '#44474c'
  on-secondary-container: '#b3b5ba'
  tertiary: '#fefdff'
  on-tertiary: '#2c3136'
  tertiary-container: '#dde1e8'
  on-tertiary-container: '#5f6469'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#baf54c'
  primary-fixed-dim: '#9fd830'
  on-primary-fixed: '#131f00'
  on-primary-fixed-variant: '#354e00'
  secondary-fixed: '#e1e2e8'
  secondary-fixed-dim: '#c5c6cc'
  on-secondary-fixed: '#191c20'
  on-secondary-fixed-variant: '#44474c'
  tertiary-fixed: '#dee3ea'
  tertiary-fixed-dim: '#c2c7cd'
  on-tertiary-fixed: '#171c21'
  on-tertiary-fixed-variant: '#42474d'
  background: '#121416'
  on-background: '#e2e2e5'
  surface-variant: '#333537'
  accent-pressed: '#A4DD3F'
  accent-soft: '#26331A'
  surface-tertiary: '#191D21'
  text-primary: '#F5F7F8'
  text-secondary: '#A8B0B7'
  text-tertiary: '#707980'
  text-disabled: '#4D555B'
  border-subtle: '#242A2F'
  border-default: '#30373D'
  border-strong: '#414A52'
  status-success: '#6FD08C'
  status-warning: '#F2C94C'
  status-error: '#FF6B6B'
  status-info: '#6EA8FE'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  metric-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.02em
  metric-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-lg: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies an uncompromising, distraction-free aesthetic built for serious lifters and dedicated athletes. Rooted in the **Dark Performance** ethos, the interface evokes the tactile, stoic quality of precision gym hardware: matte graphite surfaces, knurled bar steel, and crisp monochrome telemetry. It completely rejects performative gamification, artificial streaks, virtual confetti, and emotional guilt in favor of quiet competence, functional legibility, and high-velocity utility.

The visual style is a blend of **High-Contrast Minimalism** and **Technical Utility**. It treats the workout environment as harsh and demanding—sweaty hands, uneven overhead fluorescent lighting, short rest intervals, and elevated heart rates require immense visual clarity. Surfaces are grounded in deep graphite layers rather than pure pitch black, preserving contrast depth and tactile boundaries without eye fatigue. A single, razor-sharp electric lime accent is deployed with severe restraint: it commands immediate attention for primary progression actions and verified set records, leaving the rest of the interface calm, legible, and unobtrusive.

## Colors

The color palette is architected with a dark-first priority, delivering an ergonomic, high-density experience that minimizes battery draw on OLED screens and reduces visual glare during heavy exertion.

### Hierarchy & Tonal Layering
- **Neutral Canvas (`#0B0D0F`)**: The base foundation for application views and zero-level surfaces.
- **Surface Elevation**: Content cards and grouping panels utilize stacked graphite steps (`#121519` for primary containers, `#191D21` for embedded rows, and `#20252A` for floating elements, bottom sheets, and elevated dialogs).
- **Text & Contrast Ramp**: High-contrast warm off-white (`#F5F7F8`) serves as the dominant reading plane for weight values, active rep counts, and headings. Secondary metadata runs in `#A8B0B7`, while inactive labels and timestamps rely on `#707980`.
- **Restrained Electric Lime Accent**: `#B8F34A` is strictly reserved for actionable drivers—the primary CTA (e.g., `START WORKOUT`, `LOG SET`), active tab markers, and new Personal Record (PR) badges. It must never be used as a large decorative wash. `#A4DD3F` serves as its physical pressed state, and `#26331A` delivers subtle, low-intensity background tinting for verified rows.
- **Structural Outlines**: Depth is achieved via hairline borders (`#242A2F` subtle, `#30373D` default, `#414A52` focused) rather than heavy drop shadows.

## Typography

Typography in this design system is utilitarian, disciplined, and optimized for rapid glanceability across arm's length distances. A single typographical family—**Inter**—is leveraged across all surfaces, utilizing varying weights and tabular configurations to create immediate visual hierarchy.

### Rules of Usage
- **Tabular Numerics**: Metric readouts (e.g., `82.5 kg`, `10 reps`, elapsed workout clocks `42:18`, and rest timers) must be rendered with `font-variant-numeric: tabular-nums` to eliminate jitter during active updates.
- **Section Headers & Overlines**: Structural groupings and column anchors (e.g., `SET`, `KG`, `REPS`, `NEXT WORKOUT`) use `label-sm` or `label-md` styled with uppercase casing and expanded letter spacing (`+0.04em` to `+0.05em`).
- **Headlines & Body**: Main titles and exercise identifiers use sentence or uppercase formatting with heavy weights (`600`–`700`). Conversational body text is kept minimal, rarely exceeding 2–3 lines per card.

## Layout & Spacing

The layout system is built on a rigid **8-point rhythm**, supplemented by a `4px` (`space-xs`) micro step for tight grouping pairs (such as metric units adjacent to scalar numbers).

### Structural Architecture
- **Canvas & Gutters**: Built for single-column mobile execution. Standard mobile screen padding defaults to `16px` (`margin`), scaling up to `24px` (`margin-lg`) on wider devices. Internal card grid elements utilize `12px` to `16px` gutters.
- **Safe Area Insets**: Explicit boundaries guard the top notch, dynamic island, and the bottom software home indicator. In the Active Workout view, sticky operational buttons (`FINISH WORKOUT`, rest timer floats) remain fixed above the safe area boundary with `16px` vertical offset.
- **Ergonomics & Touch Targets**: Every tappable cell, set verification checkbox, input container, and row action guarantees an inviolable minimum touch target of **44 × 44px**. Primary workout action buttons maintain a standardized height of `48px` to `52px`.

## Elevation & Depth

This design system avoids decorative drop shadows, blurred light glows, and diffuse skeuomorphic gradients. Visual depth is established purely through **tonal layering**, surface containment, and **low-contrast outlines**.

### Elevation Stack
1. **Base Layer (L0)**: `#0B0D0F` — The canvas substrate holding primary views and scrolling content.
2. **Surface Layer (L1)**: `#121519` — Standard workout containers, routine cards, and split selections, bounded by a uniform `1px solid #242A2F` border.
3. **Embedded Layer (L2)**: `#191D21` — Distinct input boxes, historical benchmark rows, and nested table headers.
4. **Elevated Surfaces (L3)**: `#20252A` — Persistent rest timer panels, floating set quick-adds, and bottom sheets, bordered by `1px solid #30373D`.
5. **System Overlays (L4)**: `#20252A` with a `#000000` 60% opacity backdrop curtain for blocking modal confirmations (e.g., workout cancellation, split reset).

All edges remain crisp, planar, and matte.

## Shapes

The shape system employs an intentional, semi-compact curvature spectrum designed to preserve maximum internal screen real estate while feeling machined and ergonomic in the hand.

### Corner Radius Mapping
- **`radius.xs` (4px–6px)**: Micro tags, badge indicators, and progress segment nodes.
- **`radius.sm` (8px)**: Set category tags, chip filters, and secondary stat blocks.
- **`radius.md` (12px)**: Input fields, set row controls, and primary/secondary action buttons (`height: 48–52px`).
- **`radius.lg` (16px)**: Exercise summary cards, workout split selection modules, and modal containers.
- **`radius.xl` (20px)**: Top corners of draggable bottom sheets.
- **`radius.full` (999px)**: Checkmark circle triggers, circular state dots, and floating auxiliary pills.

## Components

### Buttons
- **Primary CTA**: Filled with `#B8F34A`, label in `#0B0D0F` (`weight: 700`, uppercase, `label-md`). Height is `48px` to `52px` with `12px` border radius. On active press, transitions instantly (120ms) to `#A4DD3F`.
- **Secondary / Ghost**: Background of `#191D21`, border `1px solid #30373D`, text `#F5F7F8`. Used for auxiliary actions like `+ ADD EXERCISE` or `CANCEL`.
- **Destructive**: Background transparent or `#20252A`, border `1px solid #FF6B6B`, text `#FF6B6B`.

### Cards & Grouping Containers
- Built on `#121519` with `1px solid #242A2F` borders and `16px` border radius. Internal padding is strictly `16px`.
- **Selected Split Card**: Features a `1px solid #B8F34A` border along with a small lime accent indicator.

### Set Logging Rows & Input Fields
- Structured as a high-density, 4-column inline grid: `[Set #] [Previous Value] [Weight / KG] [Reps] [Checkmark Button]`.
- Input fields use `#191D21` background with a subtle `#30373D` stroke, rendering large `18px` tabular text. Focus states trigger a `#414A52` outline.
- **Checkmark Action**: An oversized target (minimum 44 × 44px). Unchecked: bordered circular pill with `#707980` outline. Completed: instantaneous transition to `#B8F34A` fill with `#0B0D0F` checkmark, row background tinted with `#26331A`.

### Rest Timer Floating Bar
- A persistent, non-blocking floating pill situated at the bottom viewport above safe areas. Rendered in `#20252A` with `1px solid #30373D` boundary.
- Displays elapsed rest countdown in tabular `metric-md` numbers, accompanied by inline `+30s` and `SKIP` micro-actions. Never obscures underlying exercise inputs.

### Chips & Badges
- Compact pills utilizing `radius.sm` (8px). Previous performance benchmarks display as de-emphasized `#707980` text. PR indicator chips utilize `#B8F34A` text over `#26331A` fills.