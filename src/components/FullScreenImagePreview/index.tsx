import Close from 'public/images/icons/close.svg';

type FullScreenImagePreviewProps = { image: string | null; onClose?: () => void; };

export default function FullScreenImagePreview({ image, onClose }: FullScreenImagePreviewProps) {
	return (
		<div
			className='w-full h-full z-[999] absolute inset-0 backdrop-blur-xl bg-contain bg-no-repeat bg-center'
			style={ image ? { backgroundImage: `url(${ image })` } : {} }
		>
			<button
				className='flex-shrink-0 absolute top-3 right-3 sm:top-5 sm:right-5 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'
				onClick={ onClose }
			>
				<Close className='w-6 h-6 text-blue-medieval flex-shrink-0' />
			</button>
		</div>
	);
};