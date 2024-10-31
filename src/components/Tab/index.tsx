import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type TabProps = {
	selected: boolean;
	title: string | React.ReactNode;
	onClick?: () => void;
	layoutId?: string;
};

const Tab: React.FC<TabProps> = ({ selected, title, onClick, layoutId }) => {
	return (
		<div className='relative'>
			<button
				onClick={ onClick }
				className='relative z-0 pb-18px px-1 border-b-2 border-transparent hover:border-purple-600/50'
			>
				<span
					className={ cn('text-base !leading-normal transition-colors', selected ? 'text-purple-600 font-medium' : 'text-gray-500') }
				>
					{ title }
				</span>
			</button>
			{ selected && (
				<motion.span
					layoutId={ layoutId }
					className='absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-purple-600'
				/>
			) }
		</div>
	);
};

export default Tab;