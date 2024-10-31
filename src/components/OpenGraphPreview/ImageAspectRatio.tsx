import { useState } from 'react';
import Image from 'next/image';

type ImageAspectRatioProps = {
  src: string;
};

const ImageAspectRatio: React.FC<ImageAspectRatioProps> = ({ src }) => {
	const [aspectRatio, setAspectRatio] = useState<number>(1); // Default aspect ratio (1:1)
	const [isImageError, setIsImageError] = useState<boolean>(false);

	const handleImageLoad = (
		event: React.SyntheticEvent<HTMLImageElement, Event>
	) => {
		const { naturalWidth, naturalHeight } = event.currentTarget;
		setAspectRatio(naturalWidth / naturalHeight);
	};

	const handleImageError = () => setIsImageError(true);

	if (isImageError) return null;

	return (
		<div
			style={ { paddingBottom: `${100 / aspectRatio}%` } }
			className='relative w-full overflow-hidden rounded-lg group'
		>
			<Image
				src={ src }
				sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
				alt=''
				className='object-cover'
				fill
				unoptimized
				onLoad={ handleImageLoad }
				onError={ handleImageError }
			/>
		</div>
	);
};

export default ImageAspectRatio;
