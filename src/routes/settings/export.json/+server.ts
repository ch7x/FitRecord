import { json } from '@sveltejs/kit';
import { exportData } from '$lib/server/workouts';

export const GET = () => {
	return json(exportData(), {
		headers: {
			'content-disposition': 'attachment; filename="fitrecord-export.json"'
		}
	});
};

