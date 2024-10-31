import React from 'react';
import { motion, Transition } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Waveform from 'public/images/icons/waveform.svg';

import images from '@/constant/data/images';
import { ROOT_PREFIX } from '@/lib/routes';
import { cn } from '@/lib/utils';

const transition: Transition = {
	ease: 'easeInOut',
	duration: 0.5,
	delay: 0.25
};

const initialVariants = {
	left: '50%',
	translateX: '-50%',
	bottom: '6%',
	scale: 0
};

const defaultAnimateVariants = {
	translateX: 0,
	scale: 1
};

type UserImageProps = {
	className?: string;
	imageClassName?: string;
	type?: 'square' | 'circle';
	blur?: boolean;
	src: string;
};

const UserImage: React.FC<UserImageProps> = ({
	className,
	imageClassName,
	type = 'square',
	blur = true,
	src
}) => {
	return (
		<div className={ cn(
			'relative overflow-hidden',
			{
				['rounded-full w-[16.63px] h-[16.63px] sm:w-8 sm:h-8']: type === 'circle',
				['rounded-lg w-[42.62px] h-[42.62px] sm:w-[82px] sm:h-[82px]']: type === 'square',
				['blur-[6px]']: !!blur
			},
			className
		) }>
			<Image
				src={ src }
				alt=''
				sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
				fill
				className={ cn('w-full h-full object-cover', imageClassName) }
			/>
		</div>
	);
};

type BlushProps = {
	className?: string;
};

const Blush: React.FC<BlushProps> = ({ className }) => {
	return (
		<motion.div
			initial={ { opacity: 0 } }
			animate={ { opacity: 1 } }
			transition={ transition }
			className={ cn(
				'rounded-full w-[62.36px] h-[62.36px] sm:w-[120px] sm:h-[120px] blur-[160px]',
				className
			) }
		/>
	);
};

type BadgeProps = {
	className?: string;
	text: string;
};

const Badge: React.FC<BadgeProps> = ({
	text,
	className
}) => {
	return (
		<div className={ cn('mix-blend-multiply', className) }>
			<div className='whitespace-nowrap rounded-2xl py-[1.04px] px-[5.2px] sm:py-0.5 sm:px-2.5 bg-gray-200 text-gray-700 text-center max-sm:leading-[10.39px] text-[7.28px] sm:text-sm font-medium'>
				{ text }
			</div>
		</div>
	);
};

const EmptyStateDashboard: React.FC = () => {
	const renderMainUserImage = () => {
		return (
			<div className='relative overflow-hidden w-[62.36px] h-[62.36px] sm:w-[120px] sm:h-[120px] rounded-lg shadow-[0px_7.28px_21.83px_0px_rgba(20,20,43,0.14)] lg:shadow-general-l'>
				<Image
					src={ images.emptyDashboard.square1 }
					alt=''
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					fill
					className='w-full h-full object-cover'
				/>
			</div>
		);
	};

	return (
		<div className='relative w-full h-full max-w-[343px] sm:max-w-[660px] mx-auto'>
			<div className='relative w-full h-[137.72px] sm:h-[265px]'>
				<Blush className='absolute top-[30.18%] right-[20.7%] bg-[#15D1FB]' />
				<Blush className='absolute bottom-[1.13%] left-[29%] bg-[#EE1872]' />

				<motion.div
					initial={ initialVariants }
					animate={ {
						...defaultAnimateVariants,
						left: '36.8%',
						bottom: 'auto',
						top: '43%'
					} }
					transition={ {
						...transition,
						duration: 0.5
					} }
					className='absolute'
				>
					<Waveform className='w-[12.47px] h-[12.47px] sm:w-6 sm:h-6 flex-shrink-0 text-gray-400' />
				</motion.div>
				<motion.div
					initial={ initialVariants }
					animate={ {
						...defaultAnimateVariants,
						left: 'auto',
						right: '26%',
						bottom: '17.35%'
					} }
					transition={ {
						...transition,
						duration: 0.5
					} }
					className='absolute'
				>
					<Waveform className='w-[12.47px] h-[12.47px] sm:w-6 sm:h-6 flex-shrink-0 text-black-primary' />
				</motion.div>

				<motion.div
					initial={ initialVariants }
					animate={ {
						...defaultAnimateVariants,
						right: '-1.96%',
						left: 'auto',
						top: '2.6%',
						bottom: 'auto'
					} }
					transition={ {
						...transition,
						duration: 1
					} }
					className='absolute z-10'
				>
					<Badge text='Your AI Digital Twin' />
				</motion.div>

				<motion.div
					initial={ initialVariants }
					animate={ {
						...defaultAnimateVariants,
						left: '4.8%',
						bottom: '45%'
					} }
					transition={ {
						...transition,
						duration: 1
					} }
					className='absolute z-10'
				>
					<Badge text='Mentor' />
				</motion.div>

				<motion.div
					initial={ initialVariants }
					animate={ {
						...defaultAnimateVariants,
						left: '30%',
					} }
					transition={ {
						...transition,
						duration: 0.25
					} }
					className='absolute bottom-[6%] z-10'
				>
					<UserImage
						src={ images.emptyDashboard.square2 }
						type='square'
						blur={ false }
					/>
				</motion.div>
				<motion.div
					initial={ initialVariants }
					animate={ {
						...defaultAnimateVariants,
						left: '45%',
					} }
					transition={ {
						...transition,
						duration: 0.75
					} }
					className='absolute bottom-[6%] z-10'
				>
					{ renderMainUserImage() }
				</motion.div>
				<motion.div
					initial={ initialVariants }
					animate={ {
						...defaultAnimateVariants,
						right: '8%',
						left: 'auto',
						bottom: '5.28%'
					} }
					transition={ {
						...transition,
						duration: 1
					} }
					className='absolute'
				>
					<UserImage
						src={ images.emptyDashboard.circle1 }
						type='circle'
						blur={ false }
					/>
				</motion.div>
				<motion.div
					initial={ initialVariants }
					animate={ {
						...defaultAnimateVariants,
						left: '12.5%',
						bottom: '11.3%'
					} }
					transition={ {
						...transition,
						duration: 0.5
					} }
					className='absolute'
				>
					<UserImage
						src={ images.emptyDashboard.circleBlur2 }
						type='circle'
					/>
				</motion.div>
				<motion.div
					initial={ initialVariants }
					animate={ {
						...defaultAnimateVariants,
						left: '49.5%',
						bottom: 'auto',
						top: '18.11%'
					} }
					transition={ {
						...transition,
						duration: 0.25
					} }
					className='absolute'
				>
					<UserImage
						src={ images.emptyDashboard.circleBlur1 }
						type='circle'
					/>
				</motion.div>
				<motion.div
					initial={ initialVariants }
					animate={ {
						...defaultAnimateVariants,
						left: '16%',
						bottom: 'auto',
						top: '2.6%'
					} }
					transition={ {
						...transition,
						duration: 0.1
					} }
					className='absolute'
				>
					<UserImage
						src={ images.emptyDashboard.squareBlur2 }
						type='square'
						className='rotate-[5deg]'
						imageClassName='object-top'
					/>
				</motion.div>
				<motion.div
					initial={ initialVariants }
					animate={ {
						...defaultAnimateVariants,
						left: 'auto',
						right: '12.9%',
						bottom: 'auto',
						top: '22.64%'
					} }
					transition={ {
						...transition,
						duration: 0.5
					} }
					className='absolute'
				>
					<UserImage
						src={ images.emptyDashboard.squareBlur1 }
						type='square'
						className='-rotate-[5deg]'
					/>
				</motion.div>
			</div>

			<div className='flex flex-col gap-6 items-center mt-8 sm:mt-[42px]'>
				<div className='flex flex-col gap-2 text-gray-800 text-center'>
					<h5 className='font-bold text-base lg:text-xl leading-5 lg:leading-[25px]'>
						You haven&apos;t created your MiniMe yet
					</h5>
					<h6 className='text-sm lg:text-base font-normal leading-[18px] lg:leading-5'>
						Let’s make your twin one
					</h6>
				</div>
				<div>
					<Link href={ ROOT_PREFIX + '/onboarding' }>
						<div className='btn-primary-midnight-black px-4 lg:px-5 py-2.5 lg:py-3 rounded-32px'>
							<span className='text-white text-sm lg:text-base font-bold flex items-center gap-2'>
								<span className='flex-shrink-0'>
									<Image
										src={ images.icons.sparkleWhite }
										alt=''
										width={ 20 }
										height={ 20 }
										className='w-5 h-5'
									/>
								</span>
								<span>Get Started for FREE</span>
							</span>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default EmptyStateDashboard;