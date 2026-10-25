---
name: Lumina Exchange
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001e2f'
  on-tertiary-container: '#008cc7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  currency-numeral:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  currency-numeral-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies precise, modern financial clarity. Tailored for global travelers, digital nomads, and cross-border professionals, it transforms volatile market mechanics into a serene, frictionless utility. The emotional tone is reassuring, ultra-competent, and transparent.

The aesthetic fuses **Modern Financial Minimalism** with delicate **Tactile Atmosphere**. It avoids both clinical starkness and neon crypto-maximalism, leaning into crisp mathematical structure, deep editorial contrast, and whisper-quiet ambient depth. Layouts feel weightless yet substantial, using airy whitespace punctuated by tactile inputs, jewel-tone status accents, and razor-sharp typographic hierarchy.

## Colors

The palette establishes an unshakeable institutional foundation accented by vivid real-time indicators:

- **Primary (`#0F172A` - Deep Slate):** Anchors high-priority data points, primary numerical displays, master buttons, and primary structural typography.
- **Secondary (`#059669` - Vital Emerald):** Represents currency stability, positive market delta, primary interactive states, and confirmation pathways.
- **Tertiary (`#0EA5E9` - Sky Kinetic):** Reserved for live chart pulses, sync states, and network connectivity beacons.
- **Neutral (`#64748B` - Slate Muted):** Governs secondary labels, market metadata, conversion fees, and divider rules.

### Background & Surface Hierarchy
- **Canvas Base:** `#F8FAFC` (Off-white ceramic, minimizing eye strain)
- **Card Surface:** `#FFFFFF` (Pure white for raised interactives)
- **Inset / Well Surface:** `#F1F5F9` (Subtle recessed container for input fields and quick action tracks)
- **Border / Hairline:** `#E2E8F0` with emerald ambient focus rings (`rgba(5, 150, 105, 0.15)`)

## Typography

The typography couples the geometry and approachability of **Plus Jakarta Sans** with the structural legibility of **Inter**. 

### Typographic Rules
- **Numerical Dominance:** Currency inputs use `currency-numeral` styles with tabular figures (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during rate calculations.
- **Labels & Micro-data:** Micro badges, conversion timestamps, and market spread disclaimers use `label-sm` or `label-md` with subtle uppercase tracking for instant scannability.
- **Line Heights:** Tightly clamped on display numbers to keep conversion paired modules cohesive.

## Layout & Spacing

The application employs a centered, card-based layout structured around an 8pt base grid unit. 

### Breakpoints & Layout Architecture
- **Desktop (1024px+):** Max-width converter shell capped at `540px` (single column focused view) or `960px` (dual conversion and historic trend view). Centered on canvas with `margin: 2rem auto`.
- **Tablet (768px - 1023px):** Fluid container with `margin: 1.5rem` and `gutter: 1.5rem`.
- **Mobile (Up to 767px):** Full-bleed responsive card with `margin-mobile: 1rem`. Interactive touch zones expand to a minimum target size of `44px x 44px`.

### Stacking Rhythm
- Pair items within an input block using `space-xs` (4px) to `space-sm` (8px).
- Separate the primary "Source" and "Target" currency panes with an overlapping swap trigger node pinned between them via negative margins or absolute anchor points.
- Separate action trays and historical chart modules using `space-lg` (24px).

## Elevation & Depth

Visual hierarchy uses delicate layered planes, hairline borders, and ambient light physics rather than harsh, opaque drop shadows:

- **Level 0 (App Canvas):** Flat `#F8FAFC`.
- **Level 1 (Converter Core Card):** Pure white background (`#FFFFFF`), bounded by a 1px solid stroke of `#E2E8F0`, elevated by a dual-tier ambient shadow:
  - Base shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04)`
  - Ambient glow: `0 20px 40px -15px rgba(15, 23, 42, 0.05), 0 0 1px 0 rgba(15, 23, 42, 0.08)`
- **Level 2 (Active/Focused Card & Modals):** Enhanced ambient aura with a soft emerald tint:
  - Shadow: `0 25px 50px -12px rgba(5, 150, 105, 0.08), 0 0 0 1px rgba(5, 150, 105, 0.2)`
- **Level -1 (Recessed Inputs / Wells):** Inset surfaces utilizing `#F1F5F9` without shadows, defined by an interior hairline border to create functional visual depth.

## Shapes

The geometric framework balances organic modernity with technical precision (`roundedness: 2`):

- **Main Cards & Sheets:** `rounded-xl` (1.5rem / 24px) gives conversion containers a polished, pebble-smooth perimeter.
- **Conversion Wells & Input Fields:** `rounded-lg` (1rem / 16px) creates distinct nests inside the main cards.
- **Buttons, Rate Chips, & Badges:** `rounded-md` (0.5rem / 8px) for buttons, while status indicators and quick-swap buttons use full circular pills (`border-radius: 9999px`) to denote immediate tactile responsiveness.

## Components

### 1. Currency Cards & Numerical Inputs
- **Structure:** Stacked pair ("You Send" / "You Receive"). Encapsulated in `#F8FAFC` recessed containers with `1px border solid #E2E8F0`.
- **Typography:** Value input rendered in `currency-numeral` (`#0F172A`). Zero border, zero background for the text field itself.
- **Interactive States:** On focus within the well, the container boundary shifts to `rgba(5, 150, 105, 0.4)` accompanied by a `0 0 0 3px rgba(5, 150, 105, 0.1)` ring.

### 2. Flag & Symbol Badges
- **Structure:** Pill-shaped selector embedded directly within the input well.
- **Styling:** White surface `#FFFFFF`, 1px border `#E2E8F0`, subtle shadow `0 1px 2px rgba(0,0,0,0.05)`.
- **Content:** Circular SVG country flag (24px x 24px), currency code in `label-lg` (`#0F172A`), followed by a chevron icon (`#64748B`).
- **Hover/Tap:** Surface transitions to `#F1F5F9` with standard 150ms ease.

### 3. Quick Action Buttons
- **Pill Increments:** Quick-fill chips (`+100`, `+500`, `Max`) styled in transparent backgrounds with `1px solid #CBD5E1`, text in `label-sm` (`#64748B`). Hover shifts to `#0F172A` text and `#E2E8F0` surface.
- **Currency Invert/Swap Action:** Centered floating circular button (42px x 42px) bridging the two input wells. White background, 1px border `#E2E8F0`, elevated by `0 4px 12px rgba(15, 23, 42, 0.08)`. Contains bidirectional icons in emerald (`#059669`). On active tap, performs a 180-degree rotation animation.

### 4. Live Exchange Rate Indicator
- **Visual Design:** Compact horizontal pill badge with real-time pulse.
- **Indicator:** An animated pulsing dot (`#059669` core with a pinging ring `rgba(5, 150, 105, 0.4)`).
- **Text:** "1 USD = 0.9241 EUR" in `label-md` accompanied by an emerald trend arrow `↑ 0.12% today`.
- **Background:** Soft mint tint (`#ECFDF5`) bordered by `#A7F3D0`.

### 5. Primary Buttons
- **Styling:** High-contrast solid Deep Slate (`#0F172A`) or Emerald (`#059669`) with white text (`#FFFFFF`) using `label-lg`.
- **Height & Spacing:** `52px` total height, full width across mobile, padded `space-lg` horizontally on desktop.
- **Hover:** Darkens 4% with an elevated vertical lift of `-1px` and shadow `0 8px 20px -4px rgba(15, 23, 42, 0.25)`.