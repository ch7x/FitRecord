import { isAuthEnabled, isValidSession } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

const publicPrefixes = ['/login'];
const assetPrefixes = ['/_app', '/favicon', '/robots.txt'];

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const isPublic =
		publicPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
		assetPrefixes.some((prefix) => pathname.startsWith(prefix));

	if (isAuthEnabled() && !isPublic && !isValidSession(event.cookies)) {
		throw redirect(303, `/login?redirectTo=${encodeURIComponent(pathname)}`);
	}

	return resolve(event);
};

