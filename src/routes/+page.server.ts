import { getMonthCalendar, monthKey, todayKey } from '$lib/server/workouts';

export const load = ({ url }) => {
	const month = url.searchParams.get('month') ?? monthKey();

	return {
		today: todayKey(),
		calendar: getMonthCalendar(month)
	};
};
