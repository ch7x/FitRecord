import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';

const cookieName = 'fitrecord_session';
const sessionPayload = 'fitrecord-authenticated';

export const isAuthEnabled = () => Boolean(process.env.FITRECORD_PASSWORD);

const secret = () =>
	process.env.FITRECORD_SESSION_SECRET ?? process.env.FITRECORD_PASSWORD ?? 'fitrecord-dev-secret';

const sign = (value: string) => createHmac('sha256', secret()).update(value).digest('hex');

const safeEqual = (left: string, right: string) => {
	const leftBuffer = Buffer.from(left);
	const rightBuffer = Buffer.from(right);

	return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

export const verifyPassword = (password: string) => {
	const expected = process.env.FITRECORD_PASSWORD;

	if (!expected) return true;
	return safeEqual(password, expected);
};

export const createSessionValue = () => `${sessionPayload}.${sign(sessionPayload)}`;

export const isValidSession = (cookies: Cookies) => {
	if (!isAuthEnabled()) return true;

	const value = cookies.get(cookieName);
	if (!value) return false;

	const [payload, signature] = value.split('.');
	return payload === sessionPayload && Boolean(signature) && safeEqual(signature, sign(payload));
};

export const setSession = (cookies: Cookies) => {
	cookies.set(cookieName, createSessionValue(), {
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 30
	});
};

export const clearSession = (cookies: Cookies) => {
	cookies.delete(cookieName, { path: '/' });
};

