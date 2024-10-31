import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={ type }
				className={ cn(
					'flex w-full focus:ring-0 focus:outline-none focus:border-gray-800 disabled:cursor-not-allowed disabled:opacity-50',
					className
				) }
				ref={ ref }
				{ ...props }
			/>
		);
	}
);
Input.displayName = 'Input';

export { Input };