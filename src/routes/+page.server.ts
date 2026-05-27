import { redirect } from '@sveltejs/kit';
import { getMonthCalendar, monthKey, todayKey, validateDateKey } from '$lib/server/workouts';

export const load = ({ url }) => {
	const month = url.searchParams.get('month') ?? monthKey();

	return {
		today: todayKey(),
		calendar: getMonthCalendar(month)
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
