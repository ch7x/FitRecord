import { isAuthEnabled } from '$lib/server/auth';

export const load = () => {
	return {
		authEnabled: isAuthEnabled()
	};
};
