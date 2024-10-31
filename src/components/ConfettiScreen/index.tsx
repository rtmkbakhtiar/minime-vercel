import React from 'react';

import useWindowDimensions from '@/hooks/useWindowDimensions';

import ConfettiInternal, { Props } from './ConfettiInternal';

const ConfettiScreen = React.forwardRef<HTMLCanvasElement, Props>((passedProps, ref) => {
	const { width, height } = useWindowDimensions();

	return (
		<ConfettiInternal
			width={ width }
			height={ height }
			style={ { pointerEvents: 'none' } }
			{ ...passedProps }
			ref={ ref }
		/>
	);
});

ConfettiScreen.displayName = 'ConfettiScreen';

export default ConfettiScreen;