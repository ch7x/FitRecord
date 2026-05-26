import { clearSession, isAuthEnabled } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const load = () => {
	return {
		authEnabled: isAuthEnabled(),
		dbPath: process.env.FITRECORD_DB_PATH ?? 'data/fitrecord.db'
	};
};

export const actions = {
	logout: async ({ cookies }) => {
		clearSession(cookies);
		throw redirect(303, '/login');
	}
};

