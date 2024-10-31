import axios from 'axios';
import * as cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';

interface OgObject {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: any;
  ogUrl?: string;
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
		// Add proper headers
		const response = await axios.get(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Language': 'en-US,en;q=0.5',
				'Connection': 'keep-alive',
				'Upgrade-Insecure-Requests': '1'
			}
		});

		const html = response.data;
		const $ = cheerio.load(html);

		// Extract metadata
		const ogData: OgObject = {
			ogTitle: $('meta[property="og:title"]').attr('content') || $('title').text(),
			ogDescription: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
			ogImage: $('meta[property="og:image"]').attr('content'),
			ogUrl: url
		};
        
		// // For YouTube specifically
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			// Get video ID
			const videoId = url.includes('youtu.be')
				? url.split('/').pop()
				: new URL(url).searchParams.get('v');

			// Use YouTube oEmbed API as backup
			try {
				const oembedResponse = await axios.get(
					`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
				);
        
				ogData.ogTitle = ogData.ogTitle || oembedResponse.data.title;
				ogData.ogImage = ogData.ogImage || [{ url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` }];
			} catch (oembedError) {
				console.error('oEmbed fallback failed:', oembedError);
			}
		}
        
		return res.status(200).json(ogData);
    
	} catch (err) {
		console.error('Error fetching metadata:', err);
    
		// If it's a YouTube URL, try fallback method
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			try {
				const videoId = url.includes('youtu.be')
					? url.split('/').pop()
					: new URL(url).searchParams.get('v');

				const fallbackData: OgObject = {
					ogTitle: 'YouTube Video',
					ogImage: [{ url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` }],
					ogUrl: url
				};

				return res.status(200).json(fallbackData);
			} catch (fallbackErr) {
				console.error('Fallback method failed:', fallbackErr);
			}
		}

		return res.status(500).json({
			errorMessage: 'Failed to fetch URL metadata'
		});
	}
}