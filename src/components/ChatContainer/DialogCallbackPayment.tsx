import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { handleCatchError } from '@/helpers/handleError';
import useApiClient from '@/hooks/useApiClient';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../Dialog';
import SpinnerLoader from '../Loader/Spinner';

const DialogCallbackPayment: React.FC = () => {
	const router = useRouter();
	const apiClient = useApiClient();

	const [open, setOpen] = useState<boolean>(false);
	const [status, setStatus] = useState<'success' | 'failed' | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const planName = router?.query?.plan_name ?? '';
	const botName = router?.query?.bot_names ?? '';

	const updateStatusSubscription = async() => {
		try {
			setLoading(true);

			const stripePaymentId = (router?.query?.token ?? '') as string;
			await (
				await apiClient.subscriptionApi()
			).updateUserSubscription(stripePaymentId, { status: 'success' });

			setStatus('success');
		} catch (error) {
			handleCatchError(error);
			setStatus('failed');
		} finally {
			setLoading(false);

			if (!open) {
				setOpen(true);
			}
		}
	};

	useEffect(() => {
		if (router?.query && !!router?.query?.token) {
			updateStatusSubscription();
		}
	}, [router?.query]);

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (open && !nextOpen) {
				router.replace(router.asPath?.split('?')?.[0]);
			}

			setOpen(nextOpen);
		},
		[open]
	);

	const handleCtaDialog = () => {
		if (status === 'success') {
			return handleOpenChange(false);
		}

		return updateStatusSubscription();
	};

	if (loading) {
		return (
			<div className='fixed z-[100] w-full h-full inset-0 bg-black/20 flex items-center justify-center'>
				<div className='bg-white/75 w-[85px] sm:w-[100px] h-[85px] sm:h-[100px] flex items-center justify-center rounded-lg'>
					<SpinnerLoader className='w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0' />
				</div>
			</div>
		);
	}

	return (
		<Dialog
			open={ open }
			onOpenChange={ handleOpenChange }>
			<DialogTrigger className='hidden'>
				<span>Open Subscription</span>
			</DialogTrigger>
			<DialogContent className='max-w-[calc(100vw-32px)] lg:max-w-[600px] p-6 lg:p-8 text-center'>
				<DialogHeader className='flex flex-col items-center gap-y-6'>
					<Image
						src={
							status === 'success'
								? '/images/illu/illu_success.webp'
								: '/images/illu/illu_failed.webp'
						}
						width={ 82 }
						height={ 82 }
						className='w-[62px] lg:w-[82px] h-[62px] lg:h-[82px]'
						alt={ status ?? '' }
					/>
					<DialogTitle className='text-base lg:text-3xl font-bold text-gray-800 capitalize'>
            Payment { status }
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className='text-sm lg:text-lg text-gray-500 mb-8 mt-3 lg:mt-4'>
					{ status === 'success'
						? `You've successfully purchased the ${planName} package for ${botName}.`
						: 'An error occurred in updating the subscription status. Please try again by clicking the button below.' }
				</DialogDescription>
				<button
					onClick={ handleCtaDialog }
					disabled={ loading }
					className='focus:ring-0 focus:outline-none btn-primary-midnight-black py-2.5 lg:py-3 w-full text-sm lg:text-base font-bold rounded-full'
				>
					{ status === 'success' ? 'Continue' : 'Retry' }
				</button>
			</DialogContent>
		</Dialog>
	);
};

export default DialogCallbackPayment;
