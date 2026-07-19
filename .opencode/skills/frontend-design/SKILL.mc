---
name: frontend-design
description: Complete production guidelines for building responsive, accessible, high-performance UI systems with polished visual hierarchy.
compatibility: opencode
---

## Core Mission
Transform abstract feature requests into clean, production-grade frontend interfaces. Eliminate layout drift, enforce perfect typography, implement absolute accessibility, and maintain a highly unified visual system without "vibe-coding" arbitrary styles.

---

## 1. Visual Hierarchy & Spacing

### Layout System
- **Grid & Flexbox First**: Never use absolute positioning for structural layouts. Use CSS Grid for two-dimensional structures (dashboards, cards, grids) and Flexbox for one-dimensional layouts (navbars, lists, button groups).
- **Fluid Units**: Use relative units (`rem`, `em`, `vh`, `vw`, `%`) instead of fixed pixels (`px`) for layout widths, padding, and margins.
- **The 8px Grid Rule**: Drive all spatial relationships from an 8px base system. Margins, padding, and gap spaces must be multiples of 8 (e.g., `8px / 0.5rem`, `16px / 1rem`, `24px / 1.5rem`, `32px / 2rem`).

### Typography Scaling
- **Proportional Scaling**: Implement a clear typographic scale (e.g., Minor Third or Perfect Fourth multiplier).
- **Readability Ratios**: 
  - Body text font sizes must be at least `1rem` (16px).
  - Body line-height must sit strictly between `1.5` and `1.75` for tracking comfort.
  - Headings (`h1`, `h2`, `h3`) must use tight line heights (`1.1` to `1.25`) to prevent awkward multi-line spacing.
- **Clamping**: Use CSS `clamp()` for fluid headings that scale smoothly between mobile and desktop without disjointed media-query jumps.

---

## 2. Inclusive & Semantic Accessibility (WCAG 2.1 AA)

### Semantic DOM Infrastructure
- **Structural Tags**: Always wrap content in structural landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. 
- **Header Order**: Enforce absolute sequential heading hierarchies (`<h1>` down to `<h6>`). Never skip a heading level to achieve a specific font size; use CSS classes for styling instead.
- **Buttons vs. Links**: Use `<button>` for actions that alter data or state. Use `<a>` exclusively for routing or changing the URL path.

### Interactive Requirements
- **Contrast Ratios**: Small text must hit a minimum contrast ratio of 4.5:1 against its background. Large text (18pt+ or bold) must hit at least 3:1.
- **Focus Rings**: Never globally suppress outline focuses (`outline: none`). Ensure highly visible, high-contrast `:focus-visible` rings for all interactive elements.
- **Form Controls**: Every single form input must have a programmatically linked `<label for="...">`. Use `aria-describedby` to associate helper text or validation errors.
- **Aria Annotations**: Provide explicit `aria-label` tags for icon-only buttons. Add `aria-expanded` and `aria-controls` for dropdowns, modals, and collapsible panels.

---

## 3. UI Resilience & State Handling

### State Architecture
- **Defensive Layout**: UI components must safely contain varying lengths of user-generated data. Use `text-overflow: ellipsis`, `overflow-wrap: break-word`, or flexible min/max dimensions.
- **The Four UI States**: Every component that fetches, processes, or renders asynchronous content must explicitly define four structural states:
  1. **Ideal State**: The designed layout filled with complete text and data.
  2. **Loading State**: Uses precisely matching structural bone elements (Skeletons) instead of generic spinners to prevent Layout Shift (CLS).
  3. **Empty State**: Clear fallback illustration, friendly explainer text, and a direct Call-To-Action (CTA) button when zero items exist.
  4. **Error State**: Non-destructive alert boundary displaying a readable message along with an inline "Retry" mechanism.

---

## 4. Modern Component Best Practices

### CSS/Styling Strategy
- **Utility & Variables**: Depend entirely on CSS variables (or Tailwind utility tokens) for colors, radiuses, animations, and shadows. Never inject arbitrary hex codes.
- **Component Isolation**: Use CSS Modules, styled-components, or scoped Tailwind styles to prevent global style bleeding.
- **Component Splits**: Break monolithic components down into highly reusable visual fragments when they exceed 150 lines of code.

### Micro-Interactions & Transitions
- **Performance**: Animations must only manipulate hardware-accelerated CSS properties (`transform`, `opacity`). Never animate layout triggers like `height`, `width`, `margin`, or `top`.
- **Timing**: Keep transitions swift and responsive. Use `150ms` to `200ms` with `ease-in-out` or custom cubic-beziers for subtle micro-interactions (hovers, focuses, clicks).
- **Reduced Motion**: Always honor user operating system preferences by nesting transitions inside a `@media (prefers-reduced-motion: no-preference)` block.
