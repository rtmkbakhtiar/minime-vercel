import { useEffect } from 'react';

import { TextareaProps } from './index';

// Updates the height of a <textarea> when the value changes.
const useAutoSize = (
	autoSize: boolean,
	textAreaRef: HTMLTextAreaElement | null,
	value: TextareaProps['value'],
	defaultHeight?: string
) => {
	useEffect(() => {
		if (textAreaRef && autoSize) {
			textAreaRef.style.height = defaultHeight ?? '58px';
			const scrollHeight = textAreaRef.scrollHeight;

			textAreaRef.style.height = scrollHeight + 'px';
		}
	}, [autoSize, textAreaRef, value]);
};

export default useAutoSize;
