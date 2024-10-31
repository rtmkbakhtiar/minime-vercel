import React from 'react';
import { TypeOptions } from 'react-toastify';
import Image from 'next/image';

export type CustomToastContentProps = {
	type: TypeOptions;
	content?: string;
};

const CustomToastContent = ({ type, content }: Partial<CustomToastContentProps>) => {
	const renderContent = () => {
		if (type === 'error') {
			return (
				<div className='flex items-start gap-[10px] select-none'>
					<div className='mt-[2px] sm:mt-1 flex-shrink-0 flex w-4 h-4'>
						<Image
							src='/images/icons/emoji_error.svg'
							alt={ type }
							width={ 16 }
							height={ 16 }
						/>
					</div>

					{ content
						? <div>{ content }</div>
						: <div dangerouslySetInnerHTML={ { __html: '<span style="color: #E63946;">Sorry</span>, it seems something wrong has happened. Please try again in a few minutes.' } } /> }
				</div>
			);
		}

		return (
			<>
				{ content }
			</>
		);
	};

	return renderContent();
};

export default CustomToastContent;
