import React from 'react';

import { cn, getRandomIntInclusive } from '@/lib/utils';

type InitialAvatarProps = {
	name: string;
	className?: string;
	defaultColor?: number;
};

const colorOptions = [
	'bg-blue-50 text-blue-600',
	'bg-warning-50 text-warning-600',
	'bg-pink-50 text-pink-600',
	'bg-orange-50 text-orange-600'
];

const InitialAvatar: React.FC<InitialAvatarProps> = ({ name, className, defaultColor = 0 }) => {
	const nameParts = name.split(' ');
	const idx = typeof defaultColor !== 'undefined' ? defaultColor : getRandomIntInclusive(1, colorOptions.length);
	const firstNameInitial = (nameParts[0] ? nameParts[0][0] : '').toUpperCase();
	const lastNameInitial = (nameParts[1] ? nameParts[1][0] : '').toUpperCase();

	return (
		<span className={ cn('rounded-full relative', colorOptions[idx], className) }>
			<span className='absolute-center'>
				{ firstNameInitial }
				{ lastNameInitial }
			</span>
		</span>
	);
};

export default InitialAvatar;