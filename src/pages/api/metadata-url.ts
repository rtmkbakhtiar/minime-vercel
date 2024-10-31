import type { NextApiRequest, NextApiResponse } from 'next';
import urlMetadata from 'url-metadata';

interface OgObject {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: any;
  ogUrl?: string;
  // Add other metadata properties you need
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<OgObject | { errorMessage: string }>
) {
	const url = (req.body?.url ?? '') as string;

	if (!url) {
		return res.status(400).json({ errorMessage: 'URL is required' });
	}

	try {
		const metadata = await urlMetadata(url);
    
		// Extract and format the metadata you want to return
		const ogData: OgObject = {
			ogTitle: metadata['og:title'] || metadata.title,
			ogDescription: metadata['og:description'] || metadata.description,
			ogImage: [{ url: metadata['og:image'] }],
			ogUrl: metadata['og:url'] || url
		};

		return res.status(200).json(ogData);
    
	} catch (err) {
		console.error('Error fetching metadata:', err);
		return res.status(500).json({
			errorMessage: 'Failed to fetch URL metadata'
		});
	}
}