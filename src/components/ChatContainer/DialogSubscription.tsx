import React, { useCallback, useEffect, useState } from 'react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import dynamic from 'next/dynamic';
import X from 'public/images/icons/x.svg';

import { handleCatchError } from '@/helpers/handleError';
import screens from '@/helpers/screens';
import useApiClient from '@/hooks/useApiClient';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { cn, createDummyArray } from '@/lib/utils';
import { BotResp, SubscribePlanResp } from '@/openapi';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../Dialog';
import { RadioGroup, RadioGroupItem } from '../RadioGroup';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from '../Sheet';

const Skeleton = dynamic(() => import('../Skeleton'), { ssr: false });

type DialogSubscriptionProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  botData: BotResp;
};

const DialogSubscription: React.FC<DialogSubscriptionProps> = ({
	open,
	setOpen,
	botData,
}) => {
	const apiClient = useApiClient();

	const windowDimensions = useWindowDimensions();

	const [loadingGetSubscription, setLoadingGetSubscription] =
    useState<boolean>(false);
	const [subscriptionList, setSubscriptionList] = useState<SubscribePlanResp[]>(
		[]
	);
	const [selectedId, setSelectedId] = useState<number>(-1);

	useEffect(() => {
		const getListSubscription = async() => {
			try {
				setLoadingGetSubscription(true);

				const response = await (
					await apiClient.subscribeApi()
				).getSubscribePlanDetail(botData?.code ?? '');
				const data = response?.data?.data;

				if (data) {
					setSubscriptionList(data);
				}
				setLoadingGetSubscription(false);
			} catch (error) {
				handleCatchError(error);
			} finally {
				setLoadingGetSubscription(false);
			}
		};

		if (botData?.code) {
			getListSubscription();
		}
	}, [botData?.code]);

	const onValueSubscriptionChange = useCallback((value: string) => {
		setSelectedId(+ value);
	}, []);

	const handleContinueToPayment = useCallback(async() => {
		try {
			const planDetail = subscriptionList.find(
				subscription => subscription.plan === selectedId
			);

			const requestCreateSubscription = {
				amount: planDetail?.price,
				bot_code: planDetail?.bot_code,
				plan: planDetail?.plan ?? selectedId,
				plan_names: planDetail?.plan_names,
			};
			const responseCreateSubscription = await (
				await apiClient.subscriptionApi()
			).createUserSubscription(requestCreateSubscription);

			const data = responseCreateSubscription?.data?.data;
			const stripeUrl = data?.url;

			if (window) {
				window.open(stripeUrl, '_self');
			}
		} catch (error) {
			handleCatchError(error);
		}
	}, [selectedId]);

	const renderSubscriptionList = () => {
		const options: SubscribePlanResp[] = loadingGetSubscription
			? createDummyArray(3, {
				id: 0,
				plan: 0,
				price: 0,
				plan_names: '',
			})
			: subscriptionList;

		return (
			<div className='flex flex-col gap-y-6 mt-6 pointer-events-auto'>
				<span className='text-base lg:text-xl font-bold text-gray-800'>
					<span>Select Your Package</span>
					<span className='text-xs lg:text-sm font-light text-gray-500 ml-2'>
            (one-time payments)
					</span>
				</span>

				<div>
					<RadioGroup
						value={ `${selectedId}` }
						onValueChange={ onValueSubscriptionChange }
						className='gap-y-4 lg:gap-y-6'
					>
						{ options.map((opt, optidx) => {
							const selected = selectedId === opt.plan;
							return (
								<label
									htmlFor={ `${opt.plan}` }
									key={ optidx }
									className={ cn(
										'cursor-pointer flex items-center justify-between rounded-lg py-2.5 lg:py-3 px-4 lg:px-5 border text-sm lg:text-lg font-bold text-gray-800',
										{
											['shadow-[0px_1px_2px_rgba(16,24,40,0.05),_0px_0px_0px_4px_#F0EFEF] border-black-primary']:
                        selected,
											['shadow-xs border-gray-300']: !selected,
										}
									) }
								>
									<div className='flex items-center gap-2 lg:gap-3'>
										<RadioGroupItem
											value={ `${opt.plan}` }
											id={ `${opt.plan}` }
											className={
												selected ? 'bg-gray-100 border-black-primary' : ''
											}
										/>
										{ loadingGetSubscription ? (
											<Skeleton className='h-5 lg:h-6 w-[129px]' />
										) : (
											opt.plan_names
										) }
									</div>
									<span className='py-3 px-5 rounded-xl bg-neutral-white'>
										{ loadingGetSubscription ? (
											<Skeleton className='h-5 lg:h-6 w-[35px]' />
										) : (
											`$${opt.price}`
										) }
									</span>
								</label>
							);
						}) }
					</RadioGroup>

					<button
						disabled={ loadingGetSubscription }
						onClick={ handleContinueToPayment }
						className='mt-8 btn-primary-midnight-black w-full py-2.5 lg:py-3 rounded-full text-sm lg:text-base font-bold'
					>
            Continue to Payment
					</button>
				</div>
			</div>
		);
	};

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
	};

	const renderTitle = () => {
		return (
			<span>
        To continue your conversation with { botData?.name },<br />
        please select one of the options below
			</span>
		);
	};

	const renderDialog = () => {
		return (
			<Dialog
				open={ open }
				onOpenChange={ handleOpenChange }>
				<DialogTrigger className='hidden'>
					<span>Open Subscription</span>
				</DialogTrigger>
				<DialogContent className='lg:max-w-[600px] p-8'>
					<DialogHeader className='flex items-center justify-between'>
						<DialogTitle className='text-lg text-gray-800'>
							{ renderTitle() }
						</DialogTitle>

						<DialogClose className='absolute top-8 right-8 focus:ring-0 focus:outline-none'>
							<X className='w-6 h-6 text-gray-300 hover:text-gray-400' />
						</DialogClose>
					</DialogHeader>
					<VisuallyHidden.Root>
						<DialogDescription>Subscription List</DialogDescription>
					</VisuallyHidden.Root>
					{ renderSubscriptionList() }
				</DialogContent>
			</Dialog>
		);
	};

	const renderBottomSheet = () => {
		return (
			<Sheet
				open={ open }
				onOpenChange={ handleOpenChange }>
				<SheetTrigger className='hidden'>Open</SheetTrigger>
				<SheetContent
					side='bottom'
					className='w-full h-auto shadow-general-m rounded-t-[24px]'
				>
					<VisuallyHidden.Root>
						<SheetDescription>Subscription List</SheetDescription>
					</VisuallyHidden.Root>
					<div className='w-full h-full flex flex-col'>
						<div className='pb-3 pt-6 px-6 flex justify-end'>
							<button
								onClick={ () => handleOpenChange(false) }
								className='focus:ring-0 focus:outline-none'
							>
								<X className='w-6 h-6 text-gray-300 hover:text-gray-400' />
							</button>
						</div>
						<div className='px-6 pb-6 overflow-y-auto custom-scrollbar'>
							<SheetTitle className='text-sm text-gray-800'>
								{ renderTitle() }
							</SheetTitle>
							{ renderSubscriptionList() }
						</div>
					</div>
				</SheetContent>
			</Sheet>
		);
	};

	const render = () => {
		if (windowDimensions.width < screens.lg) {
			return renderBottomSheet();
		}

		return renderDialog();
	};

	return render();
};

export default DialogSubscription;
