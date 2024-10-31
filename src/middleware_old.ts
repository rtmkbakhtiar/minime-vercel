import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { getSession } from 'next-auth/react';

import jwtConfig from '@/lib/jwt';

import { ADMIN_PRIVATE_ROUTES, PRIVATE_ROUTES, ROOT, USER_DASHBOARD_ROUTE } from './lib/routes';

export default withAuth(
	async function middleware(req: NextRequestWithAuth) {
		const { nextUrl } = req;
		const requestForNextAuth = {
			headers: {
				cookie: req.headers.get('cookie') || undefined,
			},
		};

		const session = await getSession({ req: requestForNextAuth });
		const isAuthenticated = !!session?.token;
		const isPrivateRoute = PRIVATE_ROUTES.findIndex(privateRoute => nextUrl.pathname.includes(privateRoute)) > -1;

		if (!isAuthenticated && isPrivateRoute) {
			return Response.redirect(new URL(ROOT, nextUrl));
		}

		if (isAuthenticated && session?.user?.role === 'user' && ADMIN_PRIVATE_ROUTES.includes(nextUrl.pathname)) {
			return Response.redirect(new URL(USER_DASHBOARD_ROUTE, nextUrl));
		}
	},
	{
		jwt: {
			decode: jwtConfig.decode,
		},
		callbacks: {
			authorized: () => {
				// Notes: the middleware function will only be invoked if the authorized callback returns true.
				return true;
			},
		},
	}
);

export const config = {
	unstable_allowDynamic: [
		'/node_modules/@babel/runtime/regenerator/index.js',
		'/node_modules/next-auth/react/index.js'
	],
};