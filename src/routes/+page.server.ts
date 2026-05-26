import { redirect } from '@sveltejs/kit';
import { getRecentDays, todayKey, validateDateKey } from '$lib/server/workouts';

export const load = () => {
	return {
		today: todayKey(),
		recentDays: getRecentDays()
	};
};

export const actions = {
	openDate: async ({ request }) => {
		const formData = await request.formData();
		const date = String(formData.get('date') ?? '');
		const validDate = validateDateKey(date);

		if (!validDate) {
			throw redirect(303, `/day/${todayKey()}`);
		}

		throw redirect(303, `/day/${validDate}`);
	}
};

