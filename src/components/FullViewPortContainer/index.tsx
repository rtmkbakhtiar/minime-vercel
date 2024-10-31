import { ElementType, HTMLAttributes } from 'react';

import useDocumentHeight from '@/hooks/useDocumentHeight';
// import usePreventOverScrolling from '@/hooks/usePreventOverScrolling';

interface Props extends HTMLAttributes<HTMLDivElement> {
	element?: ElementType;
}

const FullViewportContainer = ({
	element: Element = 'div',
	children,
	...others
}: Props) => {
	const viewportHeight = useDocumentHeight();
	// useOnScreenKeyboardScrollFix();

	// const isOnScreenKeyboardOpen = useIsOnScreenKeyboardOpen();

	// const ref = usePreventOverScrolling(); // gist readers note: this solves a different problem and can be omitted

	return (
		<Element
			{ ...others }
			// ref={ ref }
			style={ {
				height: viewportHeight,
				// padding: isOnScreenKeyboardOpen
				// 	? 'env(safe-area-inset-top) env(safe-area-inset-right) 0 env(safe-area-inset-left)'
				// 	: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
				// transition: 'padding 100ms, height 100ms',
			} }
		>
			{ children }
		</Element>
	);
};

export default FullViewportContainer;
