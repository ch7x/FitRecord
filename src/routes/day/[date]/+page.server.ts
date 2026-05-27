import { error } from '@sveltejs/kit';
import { exerciseCatalog } from '$lib/exercise-catalog';
import {
	addExerciseToDay,
	deleteDayExercise,
	getDayRecord,
	getExerciseLibrary,
	getOptions,
	validateDateKey
} from '$lib/server/workouts';

export const load = ({ params }) => {
	const date = validateDateKey(params.date);
	if (!date) error(400, '日期格式不正确');

	return {
		date,
		options: getOptions(),
		catalog: exerciseCatalog,
		exerciseLibrary: getExerciseLibrary(),
		record: getDayRecord(date)
	};
};

export const actions = {
	addExercise: async ({ params, request }) => {
		const formData = await request.formData();
		return addExerciseToDay(params.date, formData);
	},
	deleteExercise: async ({ params, request }) => {
		const formData = await request.formData();
		return deleteDayExercise(params.date, formData);
	}
};
