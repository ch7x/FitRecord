import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const trainingDays = sqliteTable(
	'training_days',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		date: text('date').notNull(),
		note: text('note').default(''),
		createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => [uniqueIndex('training_days_date_idx').on(table.date)]
);

export const exercises = sqliteTable(
	'exercises',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		name: text('name').notNull(),
		bodyPart: text('body_part').notNull(),
		equipment: text('equipment').notNull(),
		icon: text('icon').notNull(),
		createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => [uniqueIndex('exercises_name_idx').on(table.name)]
);

export const dayExercises = sqliteTable('day_exercises', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	trainingDayId: integer('training_day_id')
		.notNull()
		.references(() => trainingDays.id, { onDelete: 'cascade' }),
	exerciseId: integer('exercise_id')
		.notNull()
		.references(() => exercises.id, { onDelete: 'restrict' }),
	orderIndex: integer('order_index').notNull(),
	note: text('note').default(''),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const exerciseSets = sqliteTable('exercise_sets', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	dayExerciseId: integer('day_exercise_id')
		.notNull()
		.references(() => dayExercises.id, { onDelete: 'cascade' }),
	setIndex: integer('set_index').notNull(),
	weight: real('weight').notNull(),
	reps: integer('reps').notNull(),
	note: text('note').default(''),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

