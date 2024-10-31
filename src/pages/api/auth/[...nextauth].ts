/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
import axios from 'axios';
import https from 'https';
import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import endpoints from '@/lib/endpoints';
import jwtConfig from '@/lib/jwt';
import { Register200Response } from '@/openapi';

export const jwt = async({
	token,
	user
}: any) => {
	return { ...token, ...user };
};

export const session = ({ session, token }: { session: Session; token: JWT; }): Promise<Session> => {
	session.user = token.user;
	session.token = token.token;

	return Promise.resolve(session);
};

const useSecureCookies = !!(process.env.NEXT_PUBLIC_BASE_URL || '')?.includes('https');

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'login_admin',
			id: 'login_admin',
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'text' },
			},
			async authorize(credentials) {
				try {
					const response = await axios.post<Register200Response>(endpoints.authAdmin,
						{
							email: credentials?.email,
							password: credentials?.password
						},
						{
							httpsAgent: new https.Agent({ rejectUnauthorized: false })
						}
					);

					return {
						token: response?.data?.data?.token,
						user: {
							f_name: response?.data?.data?.profile?.f_name ?? 'Super',
							l_name: response?.data?.data?.profile?.l_name ?? 'Admin',
							email: response?.data?.data?.profile?.email ?? credentials?.email,
							image: null,
							role: 'admin'
						}
					} as any;
				} catch (error) {
					if (axios.isAxiosError(error)) {
						if (error && error?.response) {
							const message = error?.response?.data?.stat_msg ?? error?.message;

							return Promise.reject(new Error(message));
						} else {
							return Promise.reject(new Error(error?.message));
						}
					} else {
						return Promise.reject(new Error('It seems something wrong has happened. Please try again in a few minutes.'));
					}
				}
			}
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		})
	],
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	cookies: {
		sessionToken: {
			name: `${ useSecureCookies ? '__Secure-' : '' }next-auth.session-token`,
			options: {
				httpOnly: false,
				sameSite: 'lax',
				path: '/',
				// domain: !useSecureCookies ? 'localhost' : '.' + process.env.NEXT_PUBLIC_BASE_URL,
				secure: useSecureCookies,
			},
		},
	},
	callbacks: {
		async signIn({ account, profile, user }: any) {
			if (account.provider === 'google') {
				const firstName = profile.given_name || '';
				const lastName = profile.family_name || '';

				try {
					const response = await axios.post<Register200Response>(
						endpoints.authUser,
						{
							f_name: firstName,
							l_name: lastName,
							email: profile.email
						},
						{ httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
					);

					user.token = response?.data?.data?.token;
					user.user = {
						name: profile.name || '',
						f_name: firstName,
						l_name: lastName,
						email: profile.email,
						image: profile.picture,
						role: 'user'
					};

					return true;
				} catch (error: any) {
					const message = error?.response?.data?.stat_msg ?? error?.message;
					throw new Error(message);
				}
			}

			return true;
		},
		session,
		jwt
	},
	jwt: {
		encode: jwtConfig.encode,
		decode: jwtConfig.decode
	},
	pages: {
		error: '/auth-error'
	}
};

export default NextAuth(authOptions);