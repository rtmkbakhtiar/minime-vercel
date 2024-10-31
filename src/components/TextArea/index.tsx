import React, { useRef } from 'react';

import { cn } from '@/lib/utils';

import useAutoSize from './useAutoSize';

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	autoSize?: boolean;
	defaultHeight?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, autoSize = true, defaultHeight, ...props }, ref) => {
		const textAreaRef = useRef<HTMLTextAreaElement>(null);

		useAutoSize(autoSize, textAreaRef.current, props.value, defaultHeight);

		return (
			<textarea
				className={ cn(
					'focus:ring-0 focus:outline-none flex w-full no-scrollbar appearance-none resize-none',
					className
				) }
				ref={ autoSize ? textAreaRef : ref }
				{ ...props }
			/>
		);
	}
);
Textarea.displayName = 'Textarea';

export { Textarea };