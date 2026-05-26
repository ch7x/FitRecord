import { fail, redirect } from '@sveltejs/kit';
import { isAuthEnabled, setSession, verifyPassword } from '$lib/server/auth';

export const load = ({ url }) => {
	if (!isAuthEnabled()) throw redirect(303, '/');

	return {
		redirectTo: url.searchParams.get('redirectTo') ?? '/'
	};
};

export const actions = {
	default: async ({ cookies, request, url }) => {
		const formData = await request.formData();
		const password = String(formData.get('password') ?? '');
		const redirectTo = url.searchParams.get('redirectTo') ?? '/';

		if (!verifyPassword(password)) {
			return fail(400, { message: '密码不正确' });
		}

		setSession(cookies);
		throw redirect(303, redirectTo);
	}
};

