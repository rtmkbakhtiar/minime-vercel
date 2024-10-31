import React from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { OpenGraph } from 'next-seo/lib/types';

import DefaultSEOConfig from '../../../next-seo.config';

export type SEOProps = {
	title?: string;
	description?: string;
	image?: string;
	baseUrl?: string;
	canonicalUrl?: string;
	openGraph?: OpenGraph;
};

const SEO: React.FC<SEOProps> = ({
	title,
	description,
	image,
	baseUrl = process.env.NEXT_PUBLIC_BASE_URL,
	canonicalUrl: canonicalUrlProps,
	openGraph
}) => {
	const router = useRouter();
	const urlPath = router.asPath;
	const canonicalUrl = canonicalUrlProps || (baseUrl + (urlPath === '/' ? '' : urlPath)).split('?')[0];

	return (
		<NextSeo
			title={ title || DefaultSEOConfig.title }
			description={ description || DefaultSEOConfig.description }
			canonical={ canonicalUrl + '/' }
			openGraph={ {
				...DefaultSEOConfig.openGraph,
				title: title || DefaultSEOConfig.openGraph?.title,
				description,
				images: [
					{
						url: image || '/meta/networky_thumbnail.jpg'
					},
				],
				url: canonicalUrl,
				...openGraph,
			} }
			twitter={ DefaultSEOConfig.twitter }
		/>
	);
};

export default SEO;