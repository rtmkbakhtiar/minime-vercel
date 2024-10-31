import { useEffect, useState } from 'react';

// import isIphone from './utils/isIphone';

const isKeyboardInput = (elem: HTMLElement) =>
	(elem.tagName === 'INPUT' &&
		['text', 'email', 'tel'].includes((elem as HTMLInputElement).type)) ||
	elem.hasAttribute('contenteditable')
	|| elem.tagName === 'TEXTAREA';

const useIsOnScreenKeyboardOpen = () => {
	const [isOpen, setOpen] = useState(false);
	useEffect(() => {
		// if (!isIphone()) {
		// 	return;
		// }

		const handleFocusIn = (e: FocusEvent) => {
			if (!e.target) {
				return;
			}
			const target = e.target as HTMLElement;
			if (isKeyboardInput(target)) {
				setOpen(true);
			}
		};
		document.addEventListener('focusin', handleFocusIn);
		const handleFocusOut = (e: FocusEvent) => {
			if (!e.target) {
				return;
			}
			const target = e.target as HTMLElement;
			if (isKeyboardInput(target)) {
				setOpen(false);
			}
		};
		document.addEventListener('focusout', handleFocusOut);

		return () => {
			document.removeEventListener('focusin', handleFocusIn);
			document.removeEventListener('focusout', handleFocusOut);
		};
	}, []);

	return isOpen;
};

export default useIsOnScreenKeyboardOpen;