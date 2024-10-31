import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import useRemaining from '@/hooks/useRemaining';
import { BotResp, UserSubscriptionResp } from '@/openapi';

const Countdown = dynamic(() => import('../Countdown'), { ssr: false });
const InitialAvatar = dynamic(() => import('../InitialAvatar'), { ssr: false });

type JumbotronProps = {
  botData: BotResp;
  activeSubscription?: UserSubscriptionResp | null;
};

const Jumbotron: React.FC<JumbotronProps> = ({
	botData,
	activeSubscription,
}) => {
	const isSubscriptionExists = !!activeSubscription;
	const { formattedRemaining, formattedEndTime, showCountdown, hasExpired } =
    useRemaining(activeSubscription?.end_time);

	const renderPackage = () => {
		if (
			activeSubscription?.end_time &&
      (formattedEndTime || formattedRemaining || showCountdown)
		) {
			return (
				<>
					<h6 className='uppercase text-gray-500 font-bold text-xxs lg:text-xs'>
            PACKAGE STATUS
					</h6>
					<div className='text-right'>
						<p className='lg:mt-4 mb-1 lg:mb-2 text-xs lg:text-sm font-medium'>
							<span className={ hasExpired ? 'text-red-600' : 'text-blue-600' }>
								{ hasExpired ? 'Expired' : formattedRemaining }
							</span>
						</p>
						{ hasExpired ? (
							<p className='text-xxs lg:text-xs text-gray-500'>
                Last use at { formattedEndTime }
							</p>
						) : (
							<>
								{ showCountdown ? (
									<Countdown time={ activeSubscription?.end_time } />
								) : (
									<p className='text-xxs lg:text-xs text-gray-500'>
                    Valid until { formattedEndTime }
									</p>
								) }
							</>
						) }
					</div>
				</>
			);
		}

		return null;
	};

	const renderJumbotron = () => {
		return (
			<div>
				{ isSubscriptionExists && (
					<div className='lg:hidden py-4 container-center w-full bg-gray-200 flex items-center justify-between'>
						{ renderPackage() }
					</div>
				) }

				<div className='py-6 lg:py-42px bg-neutral-background'>
					<div className='container-center w-full'>
						<div className='flex lg:justify-between'>
							<div className='flex gap-4 lg:gap-8'>
								<div className='flex'>
									{ botData.avatar ? (
										<div className='relative overflow-hidden w-42px h-42px lg:w-[82px] lg:h-[82px] rounded-full'>
											<Image
												src={ botData.avatar }
												alt=''
												fill
												sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
												className='w-full h-full object-cover'
											/>
										</div>
									) : (
										<InitialAvatar
											name={ botData.name || 'MiniMe AI' }
											className='w-42px h-42px lg:w-[82px] lg:h-[82px] flex'
											defaultColor={ 0 }
										/>
									) }
								</div>
								<div className='flex flex-col gap-2'>
									<h1 className='text-sm lg:text-base font-bold text-gray-800'>
										{ botData.name }
									</h1>
									{ botData.short_description && (
										<h3
											className='text-xs lg:text-sm text-gray-800 max-w-[564px] whitespace-pre-line'
											dangerouslySetInnerHTML={ {
												__html: botData.short_description,
											} }
										/>
									) }
									{ botData.creator_name && (
										<span className='text-xxs lg:text-xs text-gray-500'>
                      By { botData.creator_name }
										</span>
									) }
								</div>
							</div>
							{ isSubscriptionExists && (
								<div className='max-lg:hidden text-right'>
									{ renderPackage() }
								</div>
							) }
						</div>
					</div>
				</div>
			</div>
		);
	};

	return renderJumbotron();
};

export default Jumbotron;
