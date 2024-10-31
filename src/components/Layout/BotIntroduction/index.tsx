import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import InitialAvatar from '@/components/InitialAvatar';
import images from '@/constant/data/images';
import { BotResp } from '@/openapi';

type LayoutBotIntroductionProps = {
  botData: BotResp;
};

const LayoutBotIntroduction: React.FC<LayoutBotIntroductionProps> = ({
	botData: data,
}) => {
	const router = useRouter();

	return (
		<main className='w-full pb-5 min-h-[calc(100svh)] flex flex-grow flex-col justify-between mt-[35px] lg:mt-[62px]'>
			<div className='relative flex-1 h-full'>
				<div className='container-center flex flex-col gap-8 lg:gap-[62px]'>
					<div className='flex flex-col items-center text-center bg-neutral-background rounded-3xl max-lg:px-4 p-6 gap-6'>
						<div className='flex flex-col items-center gap-6'>
							<div className='relative'>
								{ data.avatar ? (
									<div className='flex-shrink-0 relative overflow-hidden w-[82px] h-[82px] lg:w-[100px] lg:h-[100px] rounded-lg'>
										<Image
											src={ data.avatar || images.icons.noPhoto }
											alt={ data.name || 'ai' }
											className='w-full h-full object-cover'
											sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
											fill
										/>
									</div>
								) : (
									<InitialAvatar
										name={ data.name || 'MiniMe AI' }
										className='w-[82px] h-[82px] lg:w-[100px] lg:h-[100px] rounded-lg flex-shrink-0 flex'
									/>
								) }
								<div className='absolute -bottom-2 -left-1 w-4 h-4'>
									<Image
										src={ images.icons.handWave }
										alt=''
										fill
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									/>
								</div>
							</div>
						</div>
						<div className='flex flex-col gap-2'>
							<h1 className='text-base font-bold leading-5 text-gray-800'>
								{ data.name }
							</h1>
							{ data.short_description && (
								<h3 className='text-sm leading-5 text-gray-800 max-w-[486px] mx-auto whitespace-pre-line'>
									<span
										dangerouslySetInnerHTML={ {
											__html: data.short_description,
										} }
									/>
								</h3>
							) }
							{ data.creator_name && (
								<span className='text-xs text-gray-500'>
                  By { data.creator_name }
								</span>
							) }
						</div>
					</div>

					<div className='w-full lg:max-w-[80%] mx-auto text-left'>
						{ data.description && (
							<span
								className='text-sm lg:text-base font-normal text-gray-800 whitespace-pre-line text-left'
								dangerouslySetInnerHTML={ { __html: data.description } }
							/>
						) }
						<div className='flex pb-14 mt-8 lg:mt-[62px]'>
							<Link
								href={ (router.asPath === '/' ? '' : router.asPath) + '/chat' }
								className='btn-primary-midnight-black px-5 py-3 rounded-32px'
							>
								<span className='relative z-10 flex h-full justify-center'>
									<span className='text-white text-base font-bold leading-6 tracking-wide'>
                    Let’s chat now
									</span>
								</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default LayoutBotIntroduction;
