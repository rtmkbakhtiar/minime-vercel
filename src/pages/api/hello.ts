// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ResponseSendMsg } from '@/interfaces';
import endpoints from '@/lib/endpoints';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseSendMsg | { errorMessage?: string; }>
) {
	try {
		const agent = req.query.agent as string;
		const url = endpoints[agent] ?? `${ process.env.NEXT_PUBLIC_BASE_URL_API }/hello`;

		const response = await axios.post<ResponseSendMsg>(
			url,
			req.body,
			{ timeout: 300000 }
		);

		res.status(response.status).json(response.data);
	} catch (error: any) {
		res.status(500).send({ errorMessage: error?.response?.data?.errorMessage ?? error?.message });
	}
}