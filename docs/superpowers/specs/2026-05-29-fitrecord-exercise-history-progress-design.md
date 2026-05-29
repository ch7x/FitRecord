# FitRecord Exercise History And Progress Design

Date: 2026-05-29

## Goal

Redesign the exercise library and stats experience so FitRecord behaves more like a focused strength-training log. The product reference is Hevy, specifically its exercise history and progress surfaces, not its social feed or marketing style.

## Product Direction

The redesign should shift the product from:

- a static exercise list
- a totals-first stats page

to:

- an exercise-first history flow
- a progress overview that helps answer whether training is moving forward

## Scope

### In Scope

- Redesign `/exercises` into an exercise entry and discovery page.
- Add `/exercises/[id]` for single-exercise history and records.
- Redesign `/stats` into a progress overview.
- Add the server-side aggregates required to support those pages.

### Out Of Scope

- Changes to workout logging flow on `/day/[date]`.
- Database schema changes.
- Complex interactive charts.
- Social features, routines, or coaching.

## Reference Principles From Hevy

The implementation should borrow these ideas:

- each exercise should answer “am I improving?”
- stats should balance overall progress with drill-down entry points
- recent history should always link back to concrete training sessions
- exercise performance matters more than decorative dashboards

The implementation should not borrow:

- social feed mechanics
- oversized marketing visuals
- feature sprawl unrelated to logging and progress

## Information Architecture

### `/exercises`

This becomes an exercise index page rather than a static library.

Sections:

- page summary
- search and quick filters
- recently trained exercises
- most trained exercises
- full exercise list

Each exercise card should include:

- exercise name
- body part
- equipment
- training count
- total sets
- best weight
- latest training date

Each card should link to the new exercise detail page.

### `/exercises/[id]`

This is the core new page.

Sections:

- exercise summary hero
- key records
- recent training history
- best sets / PR summary
- links back to the original day pages

The page should help answer:

- what is this exercise?
- how often do I train it?
- what are my best numbers?
- how has it looked recently?

### `/stats`

This becomes a progress overview page.

Sections:

- time-range selector: 7 days, 30 days, all time
- headline totals for the selected range
- training frequency block
- body-part distribution
- most trained exercises
- recent PR summary

The stats page should feel like an overview that points back to concrete exercises and sessions.

## Data Requirements

No schema changes are needed. All data can be derived from:

- `training_days`
- `exercises`
- `day_exercises`
- `exercise_sets`

### Exercise Index Aggregates

Needed for `/exercises`:

- training count
- set count
- best weight
- latest training date
- recent exercises subset
- most trained exercises subset

### Exercise Detail Aggregates

Needed for `/exercises/[id]`:

- summary metadata
- total sessions
- total sets
- total volume
- best weight
- best reps
- best single-set volume
- recent sessions with per-session sets and totals
- best-set records with date references

### Stats Aggregates

Needed for `/stats`:

- totals for selected time range
- training frequency
- body-part distribution
- most trained exercises in range
- recent PR-style entries derived from best or latest records

## Implementation Strategy

### Phase 1

Build new workout aggregate helpers in `src/lib/server/workouts.ts`.

### Phase 2

Rebuild `/exercises` as an exercise index and add `/exercises/[id]`.

### Phase 3

Rebuild `/stats` around range-based progress data.

## Validation

The redesign is successful if:

- `/exercises` feels like an entry point into exercise history
- `/exercises/[id]` clearly shows records and recent performance
- `/stats` is more useful than raw totals alone
- users can move from overview to exercise detail to original day record easily
- no database or logging behavior regresses
