import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const ImageAspectRatio = dynamic(() => import('./ImageAspectRatio'), {
	ssr: false,
});

type EmbedVideoProps = {
  url: string;
  platform: VideoPlatformTypes;
  imageSrc?: string;
};

const platformAspectRatios = {
	youtube: 16 / 9,
	vimeo: 16 / 9,
	tiktok: 10 / 16,
	facebook: 16 / 9,
	twitch: 16 / 9,
	instagram: 1 / 1,
	dailymotion: 16 / 9,
};

const EmbedVideo: React.FC<EmbedVideoProps> = ({ url, platform, imageSrc }) => {
	const [embedError, setEmbedError] = useState<boolean>(false);

	const aspectRatio = platformAspectRatios[platform] || 16 / 9;
	const iframeRef = useRef<HTMLIFrameElement>(null);

	if (embedError && imageSrc) {
		return <ImageAspectRatio src={ imageSrc } />;
	}

	if (embedError) {
		return (
			<div>
				<p>
          Video ini bersifat privat atau tidak bisa di-embed. Klik di bawah
          untuk melihat di platform aslinya:
				</p>
				<Link
					href={ url }
					target='_blank'
					rel='noopener noreferrer'>
          Buka Video di Tab Baru
				</Link>
			</div>
		);
	}

	if (url) {
		return (
			<div
				style={ { aspectRatio } }
				className='relative w-full overflow-hidden rounded-lg group'
			>
				<iframe
					ref={ iframeRef }
					src={ url }
					className='absolute top-0 left-0 w-full h-full'
					allow='autoplay; encrypted-media'
					onError={ () => setEmbedError(true) }
					allowFullScreen
				 />
			</div>
		);
	}

	return null;
};

export default EmbedVideo;
