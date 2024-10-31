import React from 'react';
import { motion, Variants } from 'framer-motion';

import { cn } from '@/lib/utils';

const variants: Variants = {
	initial: {
		scaleY: 0.5,
		opacity: 0,
	},
	animate: {
		scaleY: 1,
		opacity: 1,
		transition: {
			repeat: Infinity,
			repeatType: 'mirror',
			duration: 1,
			ease: 'circIn',
		},
	},
};

type BarLoaderProps = {
	barClassName?: string;
};

const BarLoader: React.FC<BarLoaderProps> = ({ barClassName = 'h-10 w-2 bg-gray-500' }) => {
	return (
		<motion.div
			transition={ {
				staggerChildren: 0.25,
			} }
			initial='initial'
			animate='animate'
			className='flex gap-1'
		>
			<motion.div
				variants={ variants }
				className={ cn(barClassName) } />
			<motion.div
				variants={ variants }
				className={ cn(barClassName) } />
			<motion.div
				variants={ variants }
				className={ cn(barClassName) } />
			<motion.div
				variants={ variants }
				className={ cn(barClassName) } />
			<motion.div
				variants={ variants }
				className={ cn(barClassName) } />
		</motion.div>
	);
};

export default BarLoader;