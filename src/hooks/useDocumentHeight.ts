import { useEffect, useState } from 'react';

const useDocumentHeight = () => {
	const getHeight = () => {
		const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
		return viewportHeight;
	};

	const [height, setHeight] = useState<number>(0);

	useEffect(() => {
		if (window) {
			const handleResize = () => {
				setHeight(getHeight());
			};
			handleResize();

			window.addEventListener('resize', handleResize);
			// From the top of my head this used to be required for older browsers since
			// this didn't trigger a resize event. Keeping it in to be safe.
			window.addEventListener('orientationchange', handleResize);
			// This is needed on iOS to resize the viewport when the Virtual/OnScreen
			// Keyboard opens. This does not trigger any other event, or the standard
			// resize event.
			// window.visualViewport?.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);
				window.removeEventListener('orientationchange', handleResize);
				// window.visualViewport?.removeEventListener('resize', handleResize);
			};
		}
	}, [getHeight]);

	return height;
};

export default useDocumentHeight;