import React from 'react';
import ChevronDown from 'public/images/icons/chevron-down.svg';

import { cn } from '@/lib/utils';

type ScrollToBottomProps = {
	show?: boolean;
	onClickScrollToBottom?: () => void;
	className?: string;
	children?: React.ReactNode;
};

const ScrollToBottom: React.FC<ScrollToBottomProps> = ({
	show,
	onClickScrollToBottom,
	className,
	children
}) => {
	return (
		<button
			className={ cn(
				'z-40 focus:ring-0 focus:outline-none',
				show
					? 'absolute bottom-[120px] lg:bottom-[130px] right-0 transition ease-linear duration-200'
					: 'hidden',
				className,
			) }
			onClick={ onClickScrollToBottom }>
			<div className='relative bg-white w-9 h-9 cursor-pointer items-center justify-center flex rounded-full shadow-lg border border-gray-200 hover:scale-110'>
				<ChevronDown className='text-black-primary w-5 h-5' />

				{ children }
			</div>
		</button>
	);
};

export default ScrollToBottom;