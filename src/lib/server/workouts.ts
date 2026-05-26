import { fail } from '@sveltejs/kit';
import { and, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import {
	bodyPartLabels,
	bodyPartOptions,
	equipmentLabels,
	equipmentOptions,
	validBodyParts,
	validEquipment
} from '$lib/server/constants';
import { db, sqlite } from '$lib/server/db/client';
import { dayExercises, exerciseSets, exercises, trainingDays } from '$lib/server/db/schema';

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export type SetInput = {
	weight: number;
	reps: number;
	note: string;
};

export type DayExerciseRecord = {
	id: number;
	exerciseId: number;
	name: string;
	bodyPart: string;
	bodyPartLabel: string;
	equipment: string;
	equipmentLabel: string;
	icon: string;
	note: string;
	sets: Array<{
		id: number;
		setIndex: number;
		weight: number;
		reps: number;
		note: string;
	}>;
};

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const validateDateKey = (date: string) => {
	const parsed = dateSchema.safeParse(date);
	if (!parsed.success) return null;

	const candidate = new Date(`${date}T00:00:00.000Z`);
	return Number.isNaN(candidate.getTime()) ? null : date;
};

export const getOptions = () => ({
	bodyParts: bodyPartOptions,
	equipment: equipmentOptions
});

export const ensureTrainingDay = (date: string) => {
	const validDate = validateDateKey(date);
	if (!validDate) throw new Error('Invalid date');

	const existing = db.select().from(trainingDays).where(eq(trainingDays.date, validDate)).get();
	if (existing) return existing;

	db.insert(trainingDays).values({ date: validDate }).run();
	return db.select().from(trainingDays).where(eq(trainingDays.date, validDate)).get();
};

export const getRecentDays = () => {
	return sqlite
		.prepare(
			`
			SELECT
				td.id,
				td.date,
				COUNT(DISTINCT de.id) AS exerciseCount,
				COUNT(es.id) AS setCount,
				COALESCE(SUM(es.weight * es.reps), 0) AS volume
			FROM training_days td
			LEFT JOIN day_exercises de ON de.training_day_id = td.id
			LEFT JOIN exercise_sets es ON es.day_exercise_id = de.id
			GROUP BY td.id
			ORDER BY td.date DESC
			LIMIT 12
			`
		)
		.all() as Array<{
		id: number;
		date: string;
		exerciseCount: number;
		setCount: number;
		volume: number;
	}>;
};

export const getDayRecord = (date: string) => {
	const day = ensureTrainingDay(date);
	if (!day) throw new Error('Could not create training day');

	const rows = sqlite
		.prepare(
			`
			SELECT
				de.id,
				de.exercise_id AS exerciseId,
				de.note,
				e.name,
				e.body_part AS bodyPart,
				e.equipment,
				e.icon
			FROM day_exercises de
			INNER JOIN exercises e ON e.id = de.exercise_id
			WHERE de.training_day_id = ?
			ORDER BY de.order_index ASC, de.id ASC
			`
		)
		.all(day.id) as Array<Omit<DayExerciseRecord, 'bodyPartLabel' | 'equipmentLabel' | 'sets'>>;

	const setRows = sqlite
		.prepare(
			`
			SELECT
				id,
				day_exercise_id AS dayExerciseId,
				set_index AS setIndex,
				weight,
				reps,
				note
			FROM exercise_sets
			WHERE day_exercise_id IN (${rows.map(() => '?').join(',') || 'NULL'})
			ORDER BY set_index ASC, id ASC
			`
		)
		.all(...rows.map((row) => row.id)) as Array<{
		id: number;
		dayExerciseId: number;
		setIndex: number;
		weight: number;
		reps: number;
		note: string;
	}>;

	const setsByExercise = new Map<number, typeof setRows>();
	for (const set of setRows) {
		const existing = setsByExercise.get(set.dayExerciseId) ?? [];
		existing.push(set);
		setsByExercise.set(set.dayExerciseId, existing);
	}

	const workoutExercises: DayExerciseRecord[] = rows.map((row) => ({
		...row,
		bodyPartLabel: bodyPartLabels[row.bodyPart] ?? row.bodyPart,
		equipmentLabel: equipmentLabels[row.equipment] ?? row.equipment,
		sets: setsByExercise.get(row.id) ?? []
	}));

	return {
		day,
		exercises: workoutExercises,
		summary: {
			exerciseCount: workoutExercises.length,
			setCount: workoutExercises.reduce((total, exercise) => total + exercise.sets.length, 0),
			volume: workoutExercises.reduce(
				(total, exercise) =>
					total + exercise.sets.reduce((setTotal, set) => setTotal + set.weight * set.reps, 0),
				0
			)
		}
	};
};

export const parseSets = (formData: FormData): SetInput[] => {
	const weights = formData.getAll('weight');
	const reps = formData.getAll('reps');
	const notes = formData.getAll('setNote');

	return weights
		.map((weight, index) => ({
			weight: Number(weight),
			reps: Number(reps[index]),
			note: String(notes[index] ?? '').trim()
		}))
		.filter((set) => Number.isFinite(set.weight) && Number.isFinite(set.reps));
};

export const addExerciseToDay = (date: string, formData: FormData) => {
	const validDate = validateDateKey(date);
	if (!validDate) return fail(400, { message: '日期格式不正确' });

	const name = String(formData.get('name') ?? '').trim();
	const bodyPart = String(formData.get('bodyPart') ?? '');
	const equipment = String(formData.get('equipment') ?? '');
	const note = String(formData.get('note') ?? '').trim();
	const sets = parseSets(formData);

	if (!name) return fail(400, { message: '动作名不能为空' });
	if (!validBodyParts.has(bodyPart)) return fail(400, { message: '请选择训练部位' });
	if (!validEquipment.has(equipment)) return fail(400, { message: '请选择器械类型' });
	if (sets.length === 0) return fail(400, { message: '至少添加一组训练数据' });

	for (const set of sets) {
		if (set.weight < 0) return fail(400, { message: '重量不能小于 0' });
		if (!Number.isInteger(set.reps) || set.reps <= 0) {
			return fail(400, { message: '次数必须是正整数' });
		}
	}

	const transaction = sqlite.transaction(() => {
		const day = ensureTrainingDay(validDate);
		if (!day) throw new Error('Could not create training day');

		let exercise = db.select().from(exercises).where(eq(exercises.name, name)).get();

		if (!exercise) {
			db.insert(exercises)
				.values({ name, bodyPart, equipment, icon: equipment })
				.run();
			exercise = db.select().from(exercises).where(eq(exercises.name, name)).get();
		}

		if (!exercise) throw new Error('Could not create exercise');

		const nextOrder = sqlite
			.prepare(
				'SELECT COALESCE(MAX(order_index), 0) + 1 AS nextOrder FROM day_exercises WHERE training_day_id = ?'
			)
			.get(day.id) as { nextOrder: number };

		db.insert(dayExercises)
			.values({
				trainingDayId: day.id,
				exerciseId: exercise.id,
				orderIndex: nextOrder.nextOrder,
				note
			})
			.run();

		const dayExercise = db
			.select()
			.from(dayExercises)
			.where(and(eq(dayExercises.trainingDayId, day.id), eq(dayExercises.orderIndex, nextOrder.nextOrder)))
			.get();

		if (!dayExercise) throw new Error('Could not create day exercise');

		db.insert(exerciseSets)
			.values(
				sets.map((set, index) => ({
					dayExerciseId: dayExercise.id,
					setIndex: index + 1,
					weight: set.weight,
					reps: set.reps,
					note: set.note
				}))
			)
			.run();
	});

	transaction();
	return { success: true };
};

export const deleteDayExercise = (date: string, formData: FormData) => {
	const id = Number(formData.get('dayExerciseId'));
	const validDate = validateDateKey(date);

	if (!validDate || !Number.isInteger(id)) return fail(400, { message: '删除参数不正确' });

	const day = ensureTrainingDay(validDate);
	if (!day) return fail(404, { message: '没有找到训练日期' });

	db.delete(dayExercises)
		.where(and(eq(dayExercises.id, id), eq(dayExercises.trainingDayId, day.id)))
		.run();

	return { success: true };
};

export const getExerciseLibrary = () => {
	return sqlite
		.prepare(
			`
			SELECT
				e.id,
				e.name,
				e.body_part AS bodyPart,
				e.equipment,
				e.icon,
				COUNT(DISTINCT de.id) AS workoutCount,
				COUNT(es.id) AS setCount,
				MAX(es.weight) AS bestWeight
			FROM exercises e
			LEFT JOIN day_exercises de ON de.exercise_id = e.id
			LEFT JOIN exercise_sets es ON es.day_exercise_id = de.id
			GROUP BY e.id
			ORDER BY e.name ASC
			`
		)
		.all()
		.map((row) => {
			const exercise = row as {
				id: number;
				name: string;
				bodyPart: string;
				equipment: string;
				icon: string;
				workoutCount: number;
				setCount: number;
				bestWeight: number | null;
			};

			return {
				...exercise,
				bodyPartLabel: bodyPartLabels[exercise.bodyPart] ?? exercise.bodyPart,
				equipmentLabel: equipmentLabels[exercise.equipment] ?? exercise.equipment
			};
		});
};

export const getStats = () => {
	const totals = sqlite
		.prepare(
			`
			SELECT
				COUNT(DISTINCT td.id) AS trainingDays,
				COUNT(DISTINCT de.id) AS exercisesLogged,
				COUNT(es.id) AS setsLogged,
				COALESCE(SUM(es.weight * es.reps), 0) AS totalVolume
			FROM training_days td
			LEFT JOIN day_exercises de ON de.training_day_id = td.id
			LEFT JOIN exercise_sets es ON es.day_exercise_id = de.id
			`
		)
		.get() as {
		trainingDays: number;
		exercisesLogged: number;
		setsLogged: number;
		totalVolume: number;
	};

	const bodyParts = sqlite
		.prepare(
			`
			SELECT e.body_part AS bodyPart, COUNT(DISTINCT de.id) AS count
			FROM day_exercises de
			INNER JOIN exercises e ON e.id = de.exercise_id
			GROUP BY e.body_part
			ORDER BY count DESC
			`
		)
		.all()
		.map((row) => {
			const item = row as { bodyPart: string; count: number };
			return {
				...item,
				label: bodyPartLabels[item.bodyPart] ?? item.bodyPart
			};
		});

	const bestExercises = db
		.select({
			id: exercises.id,
			name: exercises.name,
			bodyPart: exercises.bodyPart,
			equipment: exercises.equipment,
			bestWeight: sql<number>`max(${exerciseSets.weight})`,
			bestReps: sql<number>`max(${exerciseSets.reps})`
		})
		.from(exercises)
		.leftJoin(dayExercises, eq(dayExercises.exerciseId, exercises.id))
		.leftJoin(exerciseSets, eq(exerciseSets.dayExerciseId, dayExercises.id))
		.groupBy(exercises.id)
		.orderBy(desc(sql`max(${exerciseSets.weight})`))
		.limit(8)
		.all();

	return {
		totals,
		bodyParts,
		bestExercises: bestExercises.map((exercise) => ({
			...exercise,
			bodyPartLabel: bodyPartLabels[exercise.bodyPart] ?? exercise.bodyPart,
			equipmentLabel: equipmentLabels[exercise.equipment] ?? exercise.equipment
		}))
	};
};

export const exportData = () => {
	return {
		exportedAt: new Date().toISOString(),
		trainingDays: db.select().from(trainingDays).orderBy(desc(trainingDays.date)).all(),
		exercises: db.select().from(exercises).orderBy(exercises.name).all(),
		dayExercises: db.select().from(dayExercises).all(),
		exerciseSets: db.select().from(exerciseSets).all()
	};
};
