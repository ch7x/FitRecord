import { getExerciseLibrary } from '$lib/server/workouts';

export const load = () => {
	return {
		exercises: getExerciseLibrary()
	};
};

