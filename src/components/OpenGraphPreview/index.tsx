import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { getEmbedURL } from '@/helpers/getEmbedUrl';
import { cn } from '@/lib/utils';

const Skeleton = dynamic(() => import('../Skeleton'), { ssr: false });
const EmbedVideo = dynamic(() => import('./EmbedVideo'), { ssr: false });
const ImageAspectRatio = dynamic(() => import('./ImageAspectRatio'), {
	ssr: false,
});

type OpenGraphPreviewProps = {
  image?: string;
  title?: string;
  description?: string;
  url?: string;
  closeButton?: boolean;
  onClose?: () => void;
  loading?: boolean;
  className?: string;
  isChatPreview?: boolean;
};

const OpenGraphPreview: React.FC<OpenGraphPreviewProps> = ({
	image,
	title,
	description,
	url,
	closeButton,
	onClose,
	loading,
	className,
	isChatPreview,
}) => {
	const embedVideoProps = getEmbedURL(url);

	const [isImageError, setIsImageError] = useState<boolean>(false);

	const handleImageError = () => setIsImageError(true);

	const renderImage = () => {
		const imageSize =
      'flex-shrink-0 relative overflow-hidden rounded-lg lg:h-[90px] lg:w-[90px] w-[60px] h-[60px]';

		if (loading) {
			return <Skeleton className={ imageSize } />;
		}

		if (image && isChatPreview) {
			return <ImageAspectRatio src={ image } />;
		}

		if (image && !isImageError) {
			return (
				<div className={ imageSize }>
					<Image
						src={ image }
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						alt=''
						className='object-cover'
						fill
						unoptimized
						onError={ handleImageError }
					/>
				</div>
			);
		}

		return null;
	};

	const renderMedia = () => {
		if (embedVideoProps && isChatPreview) {
			return (
				<EmbedVideo
					url={ embedVideoProps.url }
					platform={ embedVideoProps.platform }
					imageSrc={ image }
				/>
			);
		}

		return renderImage();
	};

	return (
		<div className={ cn('flex gap-3 relative w-full', className) }>
			{ closeButton && (
				<button
					onClick={ onClose }
					className='absolute top-3 right-2 text-xl sm:text-2xl flex items-center justify-center rounded-full w-5 h-5 sm:w-6 sm:h-6 border border-gray-100 hover:bg-gray-100'
				>
          &times;
				</button>
			) }
			{ renderMedia() }
			<div className='flex flex-col gap-1 w-full'>
				{ loading ? (
					<>
						<Skeleton className='h-2 sm:h-4 w-full' />
						<Skeleton className='h-2 sm:h-4 w-full' />
						<Skeleton className='h-2 sm:h-4 w-full' />
					</>
				) : (
					<>
						<h6 className='text-gray-800 text-xs sm:text-base font-semibold line-clamp-4'>
							{ title }
						</h6>
						{ description && (
							<p className='text-gray-600 !leading-normal text-xxs sm:text-sm line-clamp-2'>
								{ description }
							</p>
						) }
						{ url && (
							<p className='text-gray-400 !leading-normal text-[8px] sm:text-xs line-clamp-1'>
								{ url }
							</p>
						) }
					</>
				) }
			</div>
		</div>
	);
};

export default OpenGraphPreview;
