import React, { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import images from '@/constant/data/images';
import { displayUserName } from '@/helpers/misc';
import useApiClient from '@/hooks/useApiClient';
import { cn } from '@/lib/utils';

import SpinnerLoader from '../Loader/Spinner';

const InitialAvatar = dynamic(() => import('../InitialAvatar'), { ssr: false });

const OpenGraphPreview = dynamic(() => import('../OpenGraphPreview'), {
	ssr: false,
});

type BubbleProps = {
  index: number;
  chat: GroupingChatItem;
  botData: {
    code?: string;
    name?: string;
    image?: string;
  };
  userData?: {
    name?: string | null;
    image?: string | null;
  };
  rateBotChat?: boolean;
  convCode?: string;
  onOpenFeedbackFormChange?: (open: boolean, msgCode?: string[]) => void; // eslint-disable-line no-unused-vars
};

const Bubble: React.FC<BubbleProps> = ({
	index,
	chat,
	botData,
	userData,
	rateBotChat,
	onOpenFeedbackFormChange,
	convCode,
}) => {
	const apiClient = useApiClient();

	const [starIdx, setStarIdx] = useState<number>(
		(chat.contents?.[0]?.rating || 0) - 1
	);

	const handleRateStar = async(i: number) => {
		setStarIdx(i);

		for (const msg of chat.contents) {
			try {
				const rating = i + 1;

				await (
					await apiClient.conversationApi()
				).submitRating(
					botData?.code ?? '',
					convCode ?? '',
					msg?.msg_code ?? '',
					{ value: rating }
				);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(
					`Error sending rating for msg_code ${msg.msg_code}:`,
					error
				);
			}
		}
	};

	const renderChatContent = (msg: ChatContentItem) => {
		if (msg.loading && chat.role === 'bot') {
			return (
				<div className='flex'>
					<div className='relative rounded-md h-7 w-auto flex items-center justify-center text-center'>
						<span className='inline-flex items-center'>
						typing
							<span className='dots ml-1 w-8 inline-block'>...</span>
						</span>
					</div>
				</div>
			);
		}

		return (
			<span
				className='text-sm lg:text-base whitespace-pre-line'
				style={ { wordWrap: 'break-word' } }
				dangerouslySetInnerHTML={ { __html: msg.content || '' } }
			/>
		);
	};

	const getAvatar = () => {
		if (chat.role === 'bot' && botData?.image) return botData.image;

		if (chat.role === 'user' && userData?.image) return userData?.image;

		return null;
	};

	const resolveDisplayName = () => {
		if (chat.role === 'bot') return botData.name || 'MiniMe AI';

		if (chat.role === 'user' && userData?.name)
			return displayUserName(userData?.name ?? 'You');

		return '';
	};

	const renderAvatar = () => {
		const avatar = getAvatar();

		if (avatar) {
			return (
				<div className='relative overflow-hidden w-8 h-8 rounded-full'>
					<Image
						src={ avatar }
						alt=''
						fill
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						className='w-full h-full object-cover'
					/>
				</div>
			);
		}

		return (
			<InitialAvatar
				name={ resolveDisplayName() }
				className='w-8 h-8'
				defaultColor={ chat.role === 'bot' ? 0 : 2 }
			/>
		);
	};

	const renderRatingBotChat = (msg: ChatContentItem, msgIdx: number) => {
		if (
			rateBotChat &&
      chat.role === 'bot' &&
      index !== 0 &&
      !msg.loading &&
      msgIdx === chat.contents?.length - 1 &&
      convCode
		) {
			return (
				<div className='col-start-2'>
					<div className='flex items-center gap-x-[12px]'>
						<button
							className='focus:ring-0 focus:outline-none w-8 h-8 relative overflow-hidden cursor-pointer'
							onClick={ () => handleRateStar(-1) }
						>
							<Image
								src={ images.icons.regenerate }
								alt=''
								fill
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							/>
						</button>
						<div className='flex gap-x-[6px]'>
							{ Array.from(Array(4).keys()).map(i => {
								return (
									<button
										className='w-4 h-4 relative overflow-hidden focus:ring-0 focus:outline-none'
										key={ i }
										onClick={ () => handleRateStar(i) }
									>
										<Image
											src={
												i <= starIdx ? images.icons.rated : images.icons.rate
											}
											alt=''
											fill
											sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										/>
									</button>
								);
							}) }
						</div>
						{ starIdx > -1 && (
							<button
								onClick={ () => {
									if (onOpenFeedbackFormChange) {
										onOpenFeedbackFormChange(
											true,
											chat.contents?.map(content => content.msg_code ?? '')
										);
									}
								} }
								className='bg-gray-200 py-0.5 px-2 lg:px-2.5 rounded-2xl text-xs lg:text-sm font-medium text-center text-gray-700'
							>
                Tell us more
							</button>
						) }
					</div>
				</div>
			);
		}

		return null;
	};

	const renderBubbleContent = (msg: ChatContentItem) => {
		if (msg.openGraph && msg.url) {
			return (
				<span className='flex flex-col max-w-[512px] animate-fade-in'>
					<Link
						href={ msg.url }
						target='_blank'
						rel='noopener noreferrer'
						className='mb-3 p-4 w-full bg-neutral-background shadow-general-xs border border-gray-200 rounded-2xl'
					>
						<OpenGraphPreview
							description={ msg.openGraph?.ogDescription }
							url={ msg.openGraph?.ogUrl || msg.url }
							title={ msg.openGraph?.ogTitle ?? msg.openGraph?.ogUrl ?? msg.url }
							image={ msg.openGraph?.ogImage?.[0]?.url }
							className='flex-col'
							isChatPreview
						/>
					</Link>
					<div className='animate-fade-in-up'>
						{ renderChatContent(msg) }
					</div>
				</span>
			);
		}

		return <span>{ renderChatContent(msg) }</span>;
	};

	return (
		<div
			className={ cn(
				'grid gap-3 py-2 flex-1',
				chat.role === 'bot'
					? 'place-items-start grid-cols-[auto_1fr] col-start-1'
					: 'place-items-end grid-cols-[1fr_auto] col-start-2'
			) }
		>
			<div
				className={ cn(
					'relative inline-flex row-span-2 self-start',
					chat.role === 'bot' ? 'col-start-1' : 'col-start-2'
				) }
			>
				{ renderAvatar() }
			</div>
			<span
				className={ cn(
					'row-start-1 font-medium text-sm pt-1.5',
					chat.role === 'user' ? 'col-start-1' : 'col-start-2'
				) }
			>
				{ resolveDisplayName() }
			</span>

			{ chat.contents?.map((msg, msgIdx) => {
				return (
					<Fragment key={ msgIdx }>
						<div
							className={ cn(
								'bubble text-gray-800 mt-2 relative block max-w-[90%] min-h-11 min-w-11 bg-white border border-gray-100 rounded-2xl !shadow-general-xs',
								chat.role === 'bot' ? 'bubble-left ml-2' : 'bubble-right mr-2',
								chat.role === 'user' ? 'col-start-1' : 'col-start-2'
							) }
						>
							{ msg.loading === true && chat.role === 'user' ? (
								<div className='absolute bottom-0 -left-5'>
									<SpinnerLoader className='text-black-primary w-3 h-3 sm:w-3.5 sm:h-3.5' />
								</div>
							) : null }
							<span className='relative z-[1] p-4 block bg-white rounded-2xl'>
								{ renderBubbleContent(msg) }
							</span>
						</div>
						{ renderRatingBotChat(msg, msgIdx) }
					</Fragment>
				);
			}) }
		</div>
	);
};

export default Bubble;
