import type { NextApiRequest, NextApiResponse } from 'next';

{
	/* eslint-disable @typescript-eslint/no-explicit-any */
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<OgObject | { errorMessage?: string }>
) {
	const url = (req.body?.url ?? '') as string;
	const ogs = (await import('open-graph-scraper')).default;

	const options = {
		url: url,
	};

	ogs(options)
		.then((data: any) => {
			const { error, result } = data;
			// ('error:', error); // This returns true or false. True if there was an error. The error itself is inside the results object.
			// ('result:', result); // This contains all of the Open Graph results
			// ('response:', response); // This contains the HTML of page

			if (error) {
				res.status(500).send({
					errorMessage:
            error?.response?.data?.errorMessage ??
            error?.message ??
            'Error fetch metadata',
				});
			} else {
				res.status(200).json(result);
			}
		})
		.catch((error: any) => {
			res.status(500).send({
				errorMessage: error?.result?.error ?? 'Error fetch metadata',
			});
		});
}
