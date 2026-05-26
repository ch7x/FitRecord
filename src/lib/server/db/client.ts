import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { dirname, isAbsolute, join } from 'node:path';
import { mkdirSync } from 'node:fs';
import * as schema from './schema';

const configuredPath = process.env.FITRECORD_DB_PATH ?? 'data/fitrecord.db';
const dbPath = isAbsolute(configuredPath) ? configuredPath : join(process.cwd(), configuredPath);

if (configuredPath !== ':memory:') {
	mkdirSync(dirname(dbPath), { recursive: true });
}

export const sqlite = new Database(configuredPath === ':memory:' ? configuredPath : dbPath);

sqlite.pragma('foreign_keys = ON');
sqlite.pragma('journal_mode = WAL');

sqlite.exec(`
	CREATE TABLE IF NOT EXISTS training_days (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		date TEXT NOT NULL UNIQUE,
		note TEXT DEFAULT '',
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS exercises (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE,
		body_part TEXT NOT NULL,
		equipment TEXT NOT NULL,
		icon TEXT NOT NULL,
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS day_exercises (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		training_day_id INTEGER NOT NULL REFERENCES training_days(id) ON DELETE CASCADE,
		exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
		order_index INTEGER NOT NULL,
		note TEXT DEFAULT '',
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS exercise_sets (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		day_exercise_id INTEGER NOT NULL REFERENCES day_exercises(id) ON DELETE CASCADE,
		set_index INTEGER NOT NULL,
		weight REAL NOT NULL,
		reps INTEGER NOT NULL,
		note TEXT DEFAULT '',
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
`);

export const db = drizzle(sqlite, { schema });

