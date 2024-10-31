import React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface PrivacyTermsNotesProps {
	containerClassName?: string;
	subClassName?: string;
}

const PrivacyTermsNotes: React.FC<PrivacyTermsNotesProps> = ({ containerClassName, subClassName }) => {
	return (
		<div className={ cn(
			'flex items-center justify-center',
			containerClassName
		) }>
			<p className={ cn(
				'text-xs leading-[126%] text-center text-black-kuretake-manga font-medium font-barlow',
				subClassName
			) }>
				By using Minime, you agree to our
				<Link
					href='https://networky.events/terms'
					target='_blank'
					rel='noopener noreferrer'
					className='underline'
				> Terms</Link> and
				<Link
					href='https://networky.events/privacy'
					target='_blank'
					rel='noopener noreferrer'
					className='underline'
				> Privacy Policy</Link>.
			</p>
		</div>
	);
};

export default PrivacyTermsNotes;