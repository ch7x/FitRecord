# FitRecord

FitRecord is a lightweight personal workout log built with SvelteKit, SQLite, Drizzle, and Tailwind CSS.

## Features

- Date-first workout logging.
- Multiple exercises per day.
- Multiple sets per exercise.
- Automatic exercise library.
- Simple stats for training days, sets, volume, body parts, and best weights.
- Optional password gate through environment variables.
- JSON export for backups.

## Development

Install dependencies:

```sh
npm install
```

Start the dev server:

```sh
npm run dev
```

Open `http://127.0.0.1:5173`.

## Environment

By default the app stores SQLite data in `data/fitrecord.db`.

Optional environment variables:

```sh
FITRECORD_DB_PATH=data/fitrecord.db
FITRECORD_PASSWORD=change-this-password
FITRECORD_SESSION_SECRET=change-this-session-secret
```

If `FITRECORD_PASSWORD` is not set, local password protection is disabled.

## Build

```sh
npm run check
npm run build
```

The project uses `@sveltejs/adapter-node`, so production output can be run as a Node server after `npm run build`.

