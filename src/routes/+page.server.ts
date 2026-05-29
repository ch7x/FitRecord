import { getMonthCalendar, getWeekCalendar, monthKey, todayKey, validateDateKey } from '$lib/server/workouts';

export const load = ({ url }) => {
	const view = url.searchParams.get('view') === 'month' ? 'month' : 'week';
	const month = url.searchParams.get('month') ?? monthKey();
	const date = validateDateKey(url.searchParams.get('date') ?? todayKey()) ?? todayKey();

	return {
		today: todayKey(),
		calendar: view === 'month' ? getMonthCalendar(month) : getWeekCalendar(date)
	};
};
