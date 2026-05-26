import { getStats } from '$lib/server/workouts';

export const load = () => {
	return getStats();
};

