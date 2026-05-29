# FitRecord UI Refresh Design

Date: 2026-05-29

## Goal

Refresh the FitRecord frontend so it feels more polished, calm, and premium while staying fast for everyday workout logging. The design direction should be light, friendly, and subtly inspired by Apple system apps rather than a heavy fitness brand aesthetic.

## Design Direction

### Core Mood

- Light and approachable for daily use.
- Refined and calm instead of loud or aggressive.
- Clear hierarchy with soft depth and strong readability.
- Consistent across calendar, workout entry, library, stats, and settings.

### Visual Reference

The target feel is:

- soft cloud-white backgrounds
- frosted or misty card surfaces
- rounded system-like controls
- gentle shadows and borders
- restrained accent colors
- smooth but subtle motion feedback

This should not imitate a specific Apple screen. It should borrow the interaction qualities and visual restraint that make Apple system interfaces feel composed.

## Scope

### In Scope

- Global visual language refresh.
- Shared layout and navigation styling updates.
- Homepage calendar redesign.
- Day workout page redesign.
- Exercise library visual refresh.
- Stats page visual refresh.
- Settings page visual refresh.
- Badge and control styling consistency improvements.

### Out of Scope

- Data model changes.
- Route changes.
- New product features unrelated to presentation.
- Complex charting or analytics additions.
- Authentication logic changes.

## Principles

1. Logging speed stays more important than decoration.
2. Every page should feel like part of one product, not separate Tailwind sections.
3. Visual depth should come from layered surfaces, not dark heavy panels.
4. Accent color use should guide attention, not dominate the page.
5. Mobile use is a first-class constraint, especially on the day entry screen.

## Visual System

### Color

Move away from plain stone and slate surfaces toward a warmer and softer palette.

- App background: warm off-white with a faint gradient wash.
- Primary surface: translucent white or soft white cards.
- Secondary surface: slightly tinted panels for grouped content.
- Primary text: deep slate for readability.
- Secondary text: muted gray-blue.
- Accent: clean aqua-blue for primary actions and selected states.
- Supporting accents: soft lime, amber, and coral for data highlights and status chips.

The accent palette should stay restrained so the interface still feels calm.

### Surfaces

Use a layered surface system:

- page atmosphere layer with faint radial gradients
- elevated hero and summary panels
- standard content cards
- inset panels for grouped controls and small summaries

Cards should use larger radii, softer borders, and lighter shadows than the current UI.

### Typography

Keep a clean sans-serif stack but improve hierarchy through spacing, weight, and scale:

- page titles feel more spacious and premium
- helper copy is softer and more legible
- key numbers feel intentional and prominent
- small labels remain readable without looking cramped

### Shape and Spacing

- Main cards: large radius, approximately 20px to 24px feel.
- Inputs and buttons: medium radius, approximately 14px to 18px feel.
- Tags and badges: rounded pill-like feel.
- Increase vertical rhythm so stacked sections breathe more.

### Interaction

Replace plain hover states with:

- slight lift on interactive cards
- subtle border brightening
- gentle background tint changes
- light active press feedback on buttons

Transitions should feel responsive but understated.

## Shared UI Patterns

### App Shell

The shell should feel more product-like:

- softly tinted page background
- semi-translucent top header
- more refined logo block
- navigation items that read like system tabs or sidebar capsules

The navigation should clearly show the active section instead of treating every item the same.

### Hero Blocks

Large title sections on each page should become reusable hero panels with:

- label
- page title
- short supporting text
- optional right-side icon or summary

The homepage hero should be the most expressive. Other pages should use a quieter variant.

### Summary Cards

Metric cards should move from plain bordered boxes to softer information tiles with better number emphasis and more visual hierarchy.

### Forms and Controls

Inputs, selects, and action buttons should share one visual system:

- softer border color
- stronger focus ring
- fuller background fill
- more comfortable height

Primary buttons should use the aqua-blue accent instead of flat black. Secondary buttons should remain quiet and neutral.

### Badges

`IconBadge` should be refined so metadata chips feel lighter and more polished. The update should reduce the default utility-tag look and fit the new card surfaces better.

## Page Designs

### Homepage `/`

This becomes the visual anchor of the app.

Changes:

- Replace the current plain top panel with a premium hero card that combines title, month navigation, and quick actions.
- Give the monthly summary metrics richer tiles with clearer number styling.
- Redesign calendar cells into softer cards with improved spacing and better content grouping.
- Highlight today with a cleaner selected state that feels system-like rather than harsh.
- Show workout metadata using soft tinted mini-panels inside active dates.
- Keep empty dates visually quiet so the month view stays calm.

Success criteria:

- The homepage feels immediately more special when opened.
- The calendar remains quick to scan on desktop and mobile.
- Data in filled dates is easier to parse than the current stacked labels.

### Day Page `/day/[date]`

This page is the usability priority of the redesign.

Changes:

- Upgrade the date summary card into a softer hero with clearer stats.
- Restyle logged exercise cards to feel more like clean training modules.
- Improve the set table styling so rows are easier to scan.
- Turn the add-exercise sidebar into a more cohesive entry workspace.
- Refine the exercise picker buttons, filter selects, and set-row controls.
- Make the primary save action visually obvious and pleasant to use.

Success criteria:

- Adding an exercise feels cleaner and more focused.
- Logged exercises are easier to review at a glance.
- The page still works well on narrow mobile widths.

### Exercise Library `/exercises`

Changes:

- Convert the list into softer catalog cards.
- Improve metadata layout and summary tiles inside each exercise card.
- Upgrade the empty state so it feels intentional rather than default.

Success criteria:

- The page feels like a curated library, not a raw dump of records.

### Stats `/stats`

Changes:

- Refresh total metric cards with stronger visual hierarchy.
- Soften the body-part distribution panel.
- Improve the best-exercise cards so they feel more premium and less boxy.

Success criteria:

- The page feels informative and calm without turning into a dense dashboard.

### Settings `/settings`

Changes:

- Bring settings cards into the same surface system.
- Restyle inline code and utility blocks so they fit the new visual language.
- Keep controls quiet and system-like.

Success criteria:

- Settings no longer feel like a leftover page from a different product.

## Implementation Strategy

### Phase 1: Global Foundation

Update:

- `src/app.css`
- `src/routes/+layout.svelte`
- shared utility classes or reusable class patterns
- `src/lib/components/IconBadge.svelte`

Work:

- define global color and surface tokens
- add app background atmosphere
- standardize card, button, input, badge, and hero treatments
- improve shell and navigation styling

### Phase 2: Primary Pages

Update:

- `src/routes/+page.svelte`
- `src/routes/day/[date]/+page.svelte`

Work:

- apply hero system
- redesign calendar and date cells
- redesign workout entry workspace
- improve main interaction hierarchy

### Phase 3: Secondary Pages

Update:

- `src/routes/exercises/+page.svelte`
- `src/routes/stats/+page.svelte`
- `src/routes/settings/+page.svelte`

Work:

- align all remaining pages to the shared language
- improve empty states and information cards
- fix consistency gaps discovered during implementation

## Technical Notes

- Prefer global design tokens and shared class patterns over one-off styling.
- Avoid introducing heavy component abstractions unless repetition becomes clear.
- Keep existing route logic and form actions intact.
- Preserve Tailwind-first authoring and fit within the current SvelteKit structure.

## Risks and Mitigations

### Risk: Too Much Glass Effect

If translucency is overused, readability and focus will drop.

Mitigation:

- use frosted treatment mainly for hero and elevated surfaces
- keep dense content cards mostly opaque

### Risk: Mobile Density Regressions

If spacing grows too much, the day page may become slower to use on phone screens.

Mitigation:

- preserve compact controls where input speed matters
- verify mobile layout after each major page update

### Risk: Inconsistent Accent Use

If accents are applied ad hoc, the UI will feel noisy.

Mitigation:

- reserve aqua-blue for primary actions, selection, and key highlights
- keep secondary accents limited to summaries and tags

## Validation

The redesign is successful if:

- the app feels visibly more polished and cohesive
- the homepage has stronger first-impression quality
- the day page becomes more pleasant without becoming slower
- desktop and mobile layouts both remain comfortable
- no server or data behavior changes are introduced
