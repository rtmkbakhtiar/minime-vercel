'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={ cn('grid', className) }
			{ ...props }
			ref={ ref }
		/>
	);
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ ref }
			className={ cn(
				'aspect-square h-4 w-4 rounded-full border border-gray-300 text-gray-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
				className
			) }
			{ ...props }
		>
			<RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
				<Circle className='h-1.5 w-1.5 fill-current text-current' />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

const Circle = (props: React.SVGAttributes<SVGSVGElement>) => (
	<svg
		width='6'
		height='7'
		viewBox='0 0 6 7'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		{ ...props }
	>
		<circle
			cx='3'
			cy='3.5'
			r='3'
			fill='url(#paint0_linear_2575_3615)' />
		<defs>
			<linearGradient
				id='paint0_linear_2575_3615'
				x1='3'
				y1='0.5'
				x2='3'
				y2='6.5'
				gradientUnits='userSpaceOnUse'
			>
				<stop stopColor='#232526' />
				<stop
					offset='1'
					stopColor='#434343' />
			</linearGradient>
		</defs>
	</svg>
);
