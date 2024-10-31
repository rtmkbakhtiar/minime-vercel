import * as jose from 'jose';
import { JWT, JWTDecodeParams, JWTEncodeParams } from 'next-auth/jwt';

export const encodedSecret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

const encode = async({ token, maxAge = 30 * 24 * 60 * 60 }: JWTEncodeParams): Promise<string> => {
	const iat = (Date.now() / 1000);
	const payload = {
		token: token?.token,
		user: {
			...token?.user
		},
		iat: iat,
		exp: Math.floor(iat) + maxAge
	};

	const signedToken = await new jose.SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.sign(encodedSecret);

	if (!signedToken) {
		throw new Error('Failed to sign token');
	}

	return signedToken;
};

const decode = async(params: JWTDecodeParams): Promise<JWT | null> => {
	if (!params.token) {
		throw new Error('Failed to verify token');
	}

	let token = params.token;

	if (params.token.startsWith('Bearer')) {
		token = params.token.replace('Bearer ', '');
	}

	try {
		const decoded = await jose.jwtVerify(token, encodedSecret);

		if (!decoded.payload) {
			throw new Error('Failed to verify token');
		}

		return decoded.payload as JWT;
	} catch (error) {
		throw new Error(`${ error }`);
	}
};

export const jwtConfig = {
	encode,
	decode,
	encodedSecret
};

export default jwtConfig;