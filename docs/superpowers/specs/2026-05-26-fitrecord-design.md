# FitRecord Design

Date: 2026-05-26

## Goal

FitRecord is a lightweight personal fitness record website. It should make daily workout logging fast on phone and desktop, then make past workouts easy to review by date, exercise, body part, and simple progress metrics.

The first version is for one person. It will run on a server and store data in a local SQLite database file so the site can be opened from home or other devices through a browser.

## Product Scope

### In Scope

- Select a date and view that day's workout record.
- Add multiple exercises to a date.
- Record multiple sets for each exercise.
- Store exercise name, body part, equipment type, and icon metadata.
- View workout history by date.
- View an exercise library built from previously entered exercises.
- Show simple stats such as training count, recent body-part distribution, and per-exercise best records.
- Use a professional, clean visual style with a unified icon system.
- Protect the site with a simple password gate.
- Export data from settings for backup.

### Out of Scope for V1

- Multi-user accounts.
- Social features.
- Training plans or coaching.
- Built-in exercise image or GIF library.
- Single-side weight tracking.
- kg/lb switching.
- Full nutrition or meal tracking.
- Native mobile apps.

## User Experience

The main interaction model is date-first:

1. The user chooses a date.
2. The app opens or creates that day's workout record.
3. The user adds exercises one by one.
4. Each exercise contains multiple sets.
5. The user can later review records by date or by exercise.

Example:

```text
2026-05-26

Bench Press
1. 60kg x 8
2. 60kg x 8
3. 65kg x 6

Incline Dumbbell Press
1. 20kg x 10
2. 20kg x 10
3. 22kg x 8
```

## Routes

```text
/              Recent workouts and quick date selection
/day/:date     Workout record for one date
/exercises     Exercise library and exercise history
/stats         Simple progress and frequency statistics
/settings      Password, export, and backup-related actions
```

The app should not have a marketing landing page. The first screen should be useful immediately.

## Visual Design

The visual direction is professional and clean. The UI should prioritize fast scanning, clear hierarchy, and compact controls.

The first version will use a unified icon system:

- Body part icons: chest, back, legs, shoulders, arms, core, cardio.
- Equipment icons: barbell, dumbbell, machine, cable, bodyweight, cardio.
- UI icons: add, edit, delete, search, calendar, settings, trend.

Exercise photos and GIFs are not part of V1. The data model may keep icon and equipment fields so future image support can be added without changing the core flow.

## Technical Stack

```text
SvelteKit
SQLite
Drizzle ORM
Tailwind CSS
Lucide or Iconify icons
Node server deployment
```

SvelteKit will own both the UI and server-side actions. SQLite will be stored as a database file on the server. Drizzle will manage schema and queries.

The deployment shape is:

```text
Browser / phone
  -> SvelteKit Node server
  -> SQLite database file
```

## Application Components

- Date dashboard: shows recent workout days and gives quick access to today's record or another selected date.
- Day workout page: owns the main logging flow for one date, including adding exercises and editing sets.
- Exercise picker: lets the user reuse an existing exercise or create a new one with body part, equipment, and icon metadata.
- Set editor: captures weight, reps, set order, and optional notes for one exercise.
- Exercise library: lists known exercises and links to exercise-specific history.
- Stats views: derive simple summaries from stored workouts.
- Settings: handles export and password-related configuration surfaces.
- Server actions and data access layer: validate input, run Drizzle queries, and return typed results to the UI.

## Authentication

V1 should use simple password protection rather than full account registration. The password or password hash should be configured through server environment variables.

Authentication goals:

- Block casual public access.
- Keep setup lightweight.
- Avoid multi-user complexity until it is actually needed.

## Data Model

### `training_days`

Represents one calendar day with optional day-level notes.

```text
id
date
note
created_at
updated_at
```

### `exercises`

Represents a reusable exercise in the user's exercise library.

```text
id
name
body_part
equipment
icon
created_at
updated_at
```

### `day_exercises`

Connects an exercise to a specific training day and preserves its order on that day.

```text
id
training_day_id
exercise_id
order_index
note
created_at
updated_at
```

### `exercise_sets`

Stores each set for an exercise performed on a day.

```text
id
day_exercise_id
set_index
weight
reps
note
created_at
updated_at
```

## Data Flow

### Open a Date

```text
User selects date
-> Server validates date
-> Find existing training_day
-> If missing, create training_day
-> Return day record with exercises and sets
```

### Add an Exercise

```text
User enters or selects exercise name
-> If exercise exists, reuse it
-> If exercise is new, create it with body_part, equipment, and icon
-> Create day_exercise for the selected training_day
-> Add one or more exercise_sets
```

### Edit Sets

```text
User edits weight, reps, or note
-> Server validates numeric fields
-> Update exercise_sets
-> Recalculate display summaries from stored sets
```

## Validation and Error Handling

- Dates must be valid calendar dates.
- Exercise names are required.
- Each saved day exercise must contain at least one set.
- Weight may be `0` or a decimal number.
- Reps must be a positive integer.
- Empty optional notes are allowed.
- Deleting an exercise from a day should require confirmation.
- Database write failures should show a clear user-facing error.
- Password errors should use a generic message.

## Statistics

V1 statistics should be simple and derived from saved workout records:

- Training count by week or month.
- Recent body-part distribution.
- Per-exercise best weight.
- Per-exercise best reps at a given weight when useful.
- Recent history for a selected exercise.

The first version should prefer readable tables and compact charts over complex analytics.

## Backup and Export

Settings should include JSON export for user-controlled backup. The server deployment should also allow backing up the SQLite database file directly.

Automatic scheduled backup can be added later, but it is not required for V1.

## Testing

Core tests should cover:

- Creating a training day from a date.
- Adding a new exercise.
- Reusing an existing exercise.
- Adding multiple sets to an exercise.
- Editing and deleting sets.
- Reading a day's full workout record.
- Calculating simple exercise statistics.

Manual UI checks should cover:

- Phone-width workout entry.
- Desktop history browsing.
- No overlapping labels, icons, or buttons.
- Clear empty states for dates with no exercises.

## Open Decisions

- Exact icon library: Lucide is preferred for core UI icons; Iconify may be added if more fitness-specific equipment icons are needed.
- Exact deployment target: VPS, home server, NAS, or another Node-capable host.
- Exact password implementation details: recommended V1 direction is an environment-configured password hash plus an HTTP-only signed session cookie.

## Accepted Direction

The accepted V1 direction is:

```text
Date-first workout logging
Multiple exercises per day
Multiple sets per exercise
No single-side weight tracking
No built-in exercise image library
Professional clean interface
Unified icon system
SvelteKit + SQLite + Drizzle
Server deployment with simple password protection
```
