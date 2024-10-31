import React from 'react';
import Image from 'next/image';

import images from '@/constant/data/images';
import { showDefaultFormattedDate } from '@/helpers/misc';
import { BotResp } from '@/openapi';

type BotCardProps = {
  data: BotResp;
};

const BotCard = ({ data }: BotCardProps) => {
	return (
		<div className='bg-neutral-white w-full h-full group p-4 gap-3 flex items-start rounded-2xl shadow-general-xs border border-gray-100'>
			<div className='relative overflow-hidden w-[82px] h-[82px] bg-gray-200 rounded-lg'>
				<Image
					className='w-full h-full object-cover group-hover:scale-110 transition ease-in-out duration-200'
					src={ data?.avatar || images.icons.noPhoto }
					alt={ data?.name || 'MiniMe' }
					fill
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
				/>
			</div>
			<div className='flex flex-col gap-4 text-left'>
				<div className='flex flex-col gap-2.5'>
					<h4 className='font-medium text-sm lg:text-base text-gray-800'>
						{ data?.name || 'My First MiniMe' }
					</h4>
					{ data?.tags && data?.tags?.length > 0 && (
						<div className='flex items-center flex-wrap gap-2'>
							{ data?.tags?.map((tag, index) => {
								return (
									<div
										key={ index }
										className='px-2 py-0.5 rounded-2xl bg-gray-100 font-medium text-xxs lg:text-xs text-center text-gray-700'
									>
										{ tag }
									</div>
								);
							}) }
						</div>
					) }
					{ data?.creator_name && data?.created_at && (
						<span className='text-gray-500 max-lg:hidden lg:text-sm'>
              By { data?.creator_name }{ ' ' }
							{ data?.created_at
								? `on ${showDefaultFormattedDate(data?.created_at)}`
								: '' }
						</span>
					) }
				</div>
				{ /* <div className='flex items-center gap-3'>
					<div className='flex items-center gap-1'>
						<div className='relative w-4 h-4 overflow-hidden'>
							<Image
								src={ images.icons.comment }
								alt=''
								fill
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							/>
						</div>
						<div className='text-xs text-gray-500 font-normal'>
							{ data.comments }
						</div>
					</div>
					<div className='flex items-center gap-1'>
						<div className='relative w-4 h-4 overflow-hidden'>
							<Image
								src={ images.icons.comment }
								alt=''
								fill
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							/>
						</div>
						<div className='text-xs text-gray-500 font-normal'>
							{ data.likes }
						</div>
					</div>
				</div> */ }
			</div>
		</div>
	);
};

export default BotCard;
