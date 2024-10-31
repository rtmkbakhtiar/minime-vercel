import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';
import { BotResp } from '@/openapi';

const DialogSubscription = dynamic(() => import('./DialogSubscription'), {
	ssr: false,
});

export type BannerTypes = 'expired' | 'start-subscription';

type BannerProps = {
  type?: BannerTypes;
  botData: BotResp;
};

const Banner: React.FC<BannerProps> = ({ type, botData }) => {
	const [openModalSubscription, setOpenModalSubscription] =
    useState<boolean>(false);

	const renderMessage = () => {
		if (type === 'expired')
			return 'Your subscription package has expired, please top up to continue chatting.';
		return 'To continue chatting, please top up.';
	};

	const renderDialogSubscription = () => {
		return (
			<DialogSubscription
				open={ openModalSubscription }
				setOpen={ setOpenModalSubscription }
				botData={ botData }
			/>
		);
	};

	const onClickButtonTopup = () => {
		setOpenModalSubscription(true);
	};

	return (
		<>
			<div
				className={ cn('w-full py-4 lg:py-3 mb-4 lg:mb-8', {
					['bg-orange-500']: type === 'expired',
					['bg-purple-500']: type === 'start-subscription',
				}) }
			>
				<div className='w-full container-center'>
					<div className='relative lg:px-5 2xl:px-[65px] w-full flex max-sm:flex-col sm:items-center justify-between gap-4'>
						<p className='text-sm lg:text-base text-gray-25'>
							{ renderMessage() }
						</p>
						<div className='flex'>
							<button
								onClick={ onClickButtonTopup }
								className='rounded-[32px] hover:bg-white hover:text-black-primary border border-white py-2.5 px-[31px] sm:px-4 text-sm font-bold text-white text-center flex-shrink-0'
							>
                Top Up
							</button>
						</div>
					</div>
				</div>
			</div>

			{ renderDialogSubscription() }
		</>
	);
};

export default Banner;
