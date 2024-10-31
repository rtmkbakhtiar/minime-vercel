import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user?: User;
		token?: string;
	}

	interface User {
		id?: string;
		name?: string | null;
		f_name?: string | null;
		l_name?: string | null;
		email?: string | null;
		image?: string | null;
		role?: 'admin' | 'user';
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		token: string;
		user?: User;
	}

	interface User {
		id?: string;
		name?: string | null;
		f_name?: string | null;
		l_name?: string | null;
		email?: string | null;
		image?: string | null;
		role?: 'admin' | 'user';
	}
}