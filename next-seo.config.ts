import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
	title: 'MiniMe — Create Your Own Digital Twin',
	description: 'Platform for creating your own digital twin. Scale and automate your business with your own AI. Built for creators, influencers, experts and more',
	openGraph: {
		title: 'MiniMe — Create Your Own Digital Twin',
		description: 'Platform for creating your own digital twin. Scale and automate your business with your own AI. Built for creators, influencers, experts and more',
		images: [
			{
				url: process.env.NEXT_PUBLIC_BASE_URL_S3 + '/meta/minime_thumbnail.jpg'
			},
		],
	},
	twitter: {
		cardType: 'summary_large_image',
	}
};

export default config;