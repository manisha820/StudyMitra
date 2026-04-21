# Design System Specification: The Academic Curator

## 1. Overview & Creative North Star
This design system is built upon the "Academic Curator" North Star. Unlike standard educational platforms that feel like rigid databases, this system treats a student’s data as a high-end editorial experience. It moves away from the "grid-of-boxes" mentality, opting instead for a fluid, organic layout characterized by **Intentional Asymmetry** and **Tonal Depth**. 

The goal is to provide a "Soft Minimalist" environment that reduces cognitive load while maintaining an authoritative, premium feel. By utilizing overlapping elements and varying typographic scales, we transform a simple dashboard into a sophisticated workspace that encourages focus and academic excellence.

---

## 2. Colors
Our palette is a curated selection of professional blues and encouraging greens, designed to evoke a sense of calm productivity.

*   **Primary & Secondary:** `primary` (#006592) provides a grounded, authoritative anchor, while `secondary` (#006d4a) acts as a refreshing accent for progress and success states.
*   **Tertiary:** `tertiary` (#6e3bd8) is reserved exclusively for AI-driven interactions, signaling the presence of the "AI Professor."

### The "No-Line" Rule
Explicitly prohibit the use of 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. For example, a sidebar should use `surface-container-low` against a `background` main stage.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to define importance through "nested" depth:
1.  **Base:** `surface` (#f8f9ff)
2.  **Sectioning:** `surface-container-low` (#eff4ff)
3.  **Content Cards:** `surface-container-lowest` (#ffffff)
4.  **Floating Elements:** `surface-container-high` (#dce9ff) or `highest`.

### The "Glass & Gradient" Rule
To elevate the system above "standard" UI, main CTAs and the AI Professor interface should utilize subtle linear gradients (e.g., `primary` to `primary-container`). For floating modals or navigation bars, apply **Glassmorphism**: use semi-transparent surface colors with a `20px` to `40px` backdrop-blur to allow the content beneath to bleed through softly.

---

## 3. Typography
The system uses a tri-font strategy to balance character with extreme readability.

*   **The Voice (Display & Headline):** **Plus Jakarta Sans**. Used for large headers. Its geometric yet friendly curves provide a modern, "tech-forward" feel.
*   **The Workhorse (Title & Body):** **Manrope**. Used for content and interface labels. It is highly legible and maintains a professional editorial tone.
*   **The Utility (Labels):** **Inter**. Used for data-heavy small text and UI micro-copy where clarity is the only priority.

**Hierarchy Strategy:**
*   Use `display-lg` for daily greetings (e.g., "Good morning, Alex") to create a focal point.
*   Use `headline-sm` for timetable headers, paired with `label-md` in `on-surface-variant` for time stamps to create a clear, sophisticated temporal hierarchy.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** rather than structural lines.

*   **The Layering Principle:** Place a `surface-container-lowest` card on top of a `surface-container-low` section. This creates a soft, natural "lift" that feels integrated into the environment.
*   **Ambient Shadows:** For high-level floating elements (like the AI Chat bubble), use extra-diffused shadows. 
    *   *Spec:* `Y: 8px, Blur: 24px, Spread: -4px, Color: on-surface (opacity 6%)`. 
    *   Avoid pure black/grey shadows; always tint the shadow with the `on-surface` color.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at 15% opacity. Never use 100% opaque borders.
*   **Glassmorphism:** Use for the AI Professor interface to make the AI feel like an omnipresent, "lighter than air" assistant rather than a heavy, pinned window.

---

## 5. Components

### Timetable Events (Asymmetric Cards)
*   **Style:** No borders. Use `primary-container` or `secondary-container` backgrounds.
*   **Layout:** Offset the text slightly from the edge to create an editorial feel.
*   **Interaction:** On hover, shift the background to the `fixed` variant (e.g., `primary-fixed`) and increase the corner radius from `md` to `lg`.

### AI Professor Chat Interface
*   **Container:** Glassmorphic pane using `surface-container-highest` at 80% opacity with backdrop-blur.
*   **Typography:** AI responses use `body-lg` in `tertiary` for distinction.
*   **Input:** A "Ghost Border" input field using `outline-variant` at 20%.

### Buttons
*   **Primary:** Linear gradient from `primary` to `primary-dim`. Corner radius: `full`.
*   **Secondary:** No background. `outline` at 20% opacity. Corner radius: `full`.
*   **Tertiary:** Text-only with `label-md` uppercase, 1px letter spacing.

### Chips & Tags
*   **Filter Chips:** Use `surface-container-low`. On selection, transition to `secondary-container`. 
*   **Spacing:** Use `xl` (1.5rem) padding for a "breathable" touch target.

### Cards & Lists
*   **Rule:** Forbid divider lines. Use `0.75rem` to `1rem` of vertical white space to separate list items. For complex data tables, use alternating `surface` and `surface-container-low` backgrounds (zebra striping) but keep the transitions extremely subtle.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use whitespace as a functional tool. If an element feels cramped, double the padding instead of adding a line.
*   **DO** use `tertiary` colors sparingly to highlight AI-generated insights or "professor" suggestions.
*   **DO** utilize the `xl` (1.5rem) roundedness for large dashboard containers to maintain the "friendly" aesthetic.

### Don't:
*   **DON'T** use 1px solid borders to separate the sidebar from the main content. Use a background color shift.
*   **DON'T** use pure black (#000000) for text. Always use `on-surface` (#05345c) to maintain the sophisticated blue-grey tonal range.
*   **DON'T** use standard "drop shadows" with high opacity. If you can clearly see where the shadow starts, it’s too dark.
*   **DON'T** crowd the timetable. Allow events to "breathe" with generous internal padding.