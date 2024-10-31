import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ColumnDef } from '@tanstack/react-table';
import { AnimatePresence, motion } from 'framer-motion';
import https from 'https';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import ChevronDown from 'public/images/icons/chevron-down.svg';
import X from 'public/images/icons/x.svg';

import BadgeStatus from '@/components/BadgeStatus';
import DataTable from '@/components/DataTable';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTrigger,
} from '@/components/Dialog';
import LayoutDashboardPage from '@/components/Layout/Dashboard/Page';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from '@/components/Sheet';
import Switch from '@/components/Switch';
import Tab from '@/components/Tab';
import images from '@/constant/data/images';
import groupingMessages from '@/helpers/groupingMessages';
import { handleCatchError } from '@/helpers/handleError';
import {
	formatCurrency,
	getUrlParamAsObject,
	scrollToElement,
	showDefaultFormattedDate,
} from '@/helpers/misc';
import screens from '@/helpers/screens';
import { toastify } from '@/helpers/toast';
import useApiClient from '@/hooks/useApiClient';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { PaginationState } from '@/interfaces';
import { Api } from '@/lib/api';
import { ROOT_PREFIX } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { BotResp, ConvResp, MsgResp, SubscribePlanResp } from '@/openapi';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const BarLoader = dynamic(() => import('../../../../components/Loader/Bar'), {
	ssr: false,
});
const InitialAvatar = dynamic(
	() => import('../../../../components/InitialAvatar'),
	{ ssr: false }
);
const Bubble = dynamic(() => import('../../../../components/Bubble'), {
	ssr: false,
});

const apiInstance = new Api();

type ChannelItem = ConvResp & {
  subRows?: ConvResp[];
};

const tabs = [
	{
		title: 'About',
		id: 'detail_information',
	},
	{
		title: 'Chat History',
		id: 'channels',
	},
	{
		title: 'Paid Subscribers',
		id: 'paid_subscribers',
	},
];

const detailInfoList = [
	{
		title: 'Tags',
		id: 'tags',
	},
	{
		title: 'Short Description',
		id: 'short_description',
	},
	{
		title: 'Description',
		id: 'description',
	},
	{
		title: 'Welcome Message',
		id: 'welcome_msg',
	},
];

type SheetPreviewChatProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void; // eslint-disable-line no-unused-vars
  mobile?: boolean;
};

const SheetPreviewChat: React.FC<SheetPreviewChatProps> = ({
	children,
	open,
	onOpenChange,
	mobile,
}) => {
	return (
		<Sheet
			open={ open }
			onOpenChange={ onOpenChange }>
			<SheetTrigger className='hidden'>view</SheetTrigger>

			<SheetContent
				side={ mobile ? 'bottom' : 'right' }
				overlay={ mobile }
				className='flex grow flex-col gap-y-2 !px-0 pt-8 shadow-general-m w-full lg:!max-w-[600px] max-lg:!max-h-[80vh] max-lg:rounded-t-[24px] bg-neutral-white'
			>
				<div className='flex justify-end px-6'>
					<SheetClose className='focus:ring-0 focus:outline-none'>
						<X className='w-6 h-6 text-gray-300' />
					</SheetClose>
				</div>
				{ children }
			</SheetContent>
		</Sheet>
	);
};

type BotDetailPageProps = {
  data: BotResp;
};

const initPagination: PaginationState = {
	prev: '',
	next: '',
	type: 'next',
	pageIndex: 0,
};

const BotDetailPage: NextPage<BotDetailPageProps> = ({ data: botData }) => {
	const apiClient = useApiClient();

	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const { ref: firstElementChatRef, inView: firstElementChatInView } =
    useInView({ threshold: 1 });

	const [selectedTabId, setSelectedTabId] = useState<string>(tabs[0].id);

	const [openSheet, setOpenSheet] = useState<boolean>(false);

	const [loadingGetChannels, setLoadingGetChannels] = useState<boolean>(false);
	const [loadingGetChats, setLoadingGetChats] = useState<boolean>(false);
	const [openModalUpdatePrice, setOpenModalUpdatePrice] =
    useState<boolean>(false);
	const [paginationChannels, setPaginationChannels] =
    useState<PaginationState>(initPagination);
	const [paginationChats, setPaginationChats] =
    useState<PaginationState>(initPagination);

	const [dataChannels, setDataChannels] = useState<ChannelItem[]>([]);
	const [dataSubscribePlan, setDataSubscribePlan] = useState<
    SubscribePlanResp[]
  >([]);
	const [packageSelected, setPackageSelected] = useState<SubscribePlanResp[]>(
		[]
	);
	const [allDataChannels, setAllDataChannels] = useState<ChannelItem[]>([]);
	const [dataChats, setDataChats] = useState<MsgResp[]>([]);

	const [activeConvData, setActiveConvData] = useState<ConvResp | null>(null);

	const [hasMoreDataChats, setHasMoreDataChats] = useState<boolean>(false);

	const [disabledNextPagination, setDisabledNextPagination] =
    useState<boolean>(false);
	const [activationPaid, setActivationPaid] = useState<boolean>(false);
	const [changePriceValue, setChangePriceValue] = useState<string>(''); // State to hold the input value

	const windowDimensions = useWindowDimensions();
	const isMobile = windowDimensions.width < screens.lg;

	const getSubscribePlan = async() => {
		try {
			const response = await (
				await apiClient.subscribeApi()
			).getSubscribePlanDetail(botData?.code ?? '');

			const responseDataSubscribePlan = response?.data?.data ?? [];
			setDataSubscribePlan(responseDataSubscribePlan);

			// Set activation paid subs from data subs list
			setActivationPaid(responseDataSubscribePlan[0]?.is_active ?? false);
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoadingGetChannels(false);
		}
	};

	const getChannelsData = async() => {
		try {
			setLoadingGetChannels(true);

			const nextParam = getUrlParamAsObject(
				paginationChannels.next ?? ''
			)?.next;
			const prevParam = getUrlParamAsObject(
				paginationChannels.prev ?? ''
			)?.prev;
			const response = await (
				await apiClient.conversationApi()
			).getConversation(
				botData?.code ?? '',
				10,
				'desc',
				paginationChannels.type === 'next' ? nextParam : undefined,
				paginationChannels.type === 'prev' ? prevParam : undefined
			);
			const responseDataConversations = response?.data?.data?.conversations;
			const totalConv =
        responseDataConversations?.pagination?.total_messages || 0;
			const currentDataChannels = (responseDataConversations?.data ?? [])?.map(
				conv => ({
					...conv,
					subRows: [conv],
				})
			);
			let updatedAllDataChannels = [...allDataChannels];

			if (paginationChannels?.type === 'next') {
				updatedAllDataChannels = [...allDataChannels, ...currentDataChannels];
				setAllDataChannels(prev => [...prev, ...currentDataChannels]);
			}

			if (
				!currentDataChannels?.length ||
        updatedAllDataChannels?.length >= totalConv
			) {
				setDisabledNextPagination(true);
			} else {
				setPaginationChannels(prevPagination => ({
					...prevPagination,
					prev: responseDataConversations?.pagination?.prev,
					next: responseDataConversations?.pagination?.next,
				}));
				setDisabledNextPagination(false);
			}

			setDataChannels(currentDataChannels);
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoadingGetChannels(false);
		}
	};

	const getListChat = async() => {
		try {
			setLoadingGetChats(true);

			const nextUrl = paginationChats.next;
			const nextParam = getUrlParamAsObject(nextUrl ?? '')?.next;
			const response = await (
				await apiClient.conversationApi()
			).getConversationDetail(
				botData?.code ?? '',
				activeConvData?.conv_code ?? '',
				6,
				nextParam
			);

			if (paginationChats.pageIndex > 0 && dataChats[0]?.msg_code) {
				// scroll to the current first message
				scrollToElement(dataChats[0]?.msg_code);
			}

			const responseDataMessages = response?.data?.data?.messages;
			const currentDataMessages = [
				...(responseDataMessages?.data || []),
			].reverse();
			const updatedDataChats =
        paginationChats.pageIndex > 0
        	? [...currentDataMessages, ...dataChats]
        	: currentDataMessages;
			const totalMessages =
        responseDataMessages?.pagination?.total_messages || 0;
			const hasNextPage =
        !!currentDataMessages.length &&
        updatedDataChats?.length < totalMessages;

			if (!hasNextPage) {
				setDataChats([
					{
						sender_type: 'bot',
						content: botData?.welcome_msg || 'Tell me, how can I help?',
					},
					...updatedDataChats,
				]);
			} else {
				setDataChats(updatedDataChats);
			}

			setTimeout(() => {
				if (scrollAreaRef.current && paginationChats.pageIndex === 0) {
					scrollAreaRef.current.scrollTo({
						top: scrollAreaRef.current.scrollHeight,
						behavior: 'instant',
					});
				}

				setPaginationChats(prevPagination => ({
					...prevPagination,
					prev: responseDataMessages?.pagination?.prev,
					next: responseDataMessages?.pagination?.next,
				}));
				setHasMoreDataChats(hasNextPage);
			}, 500);
		} catch (error) {
			handleCatchError(error);
		} finally {
			setTimeout(() => {
				// use settimeout to make sure everything is done
				setLoadingGetChats(false);
			}, 1000);
		}
	};

	useEffect(() => {
		getChannelsData();
	}, [paginationChannels.pageIndex, paginationChannels.type]);

	useEffect(() => {
		getSubscribePlan();
	}, [activationPaid]);

	useEffect(() => {
		if (activeConvData?.conv_code && openSheet) {
			getListChat();
		}
	}, [activeConvData?.conv_code, paginationChats.pageIndex, openSheet]);

	// useEffect(() => {
	// 	if (dataChats?.length > 0 && scrollAreaRef.current && paginationChats?.pageIndex === 0) {
	// 		scrollAreaRef.current.scrollTo({
	// 			top: scrollAreaRef.current.scrollHeight,
	// 			behavior: 'smooth',
	// 		});
	// 	}
	// }, [paginationChats?.pageIndex, dataChats, activeConvData?.conv_code]);

	useEffect(() => {
		const handleFirstElementChatInView = () => {
			if (loadingGetChats) return;

			if (firstElementChatInView && hasMoreDataChats) {
				setPaginationChats(prevPagination => ({
					...prevPagination,
					pageIndex: prevPagination.pageIndex + 1,
				}));
			}
		};

		handleFirstElementChatInView();
	}, [loadingGetChats, hasMoreDataChats, firstElementChatInView]);

	const resetOpenConvData = () => {
		setPaginationChats(initPagination);
		setDataChats([]);
		setLoadingGetChats(true);
	};

	const renderEmptyChatHistory = () => {
		return (
			<div className='flex flex-col justify-center items-center w-full h-full gap-2.5'>
				<Image
					src={ images.icons.emptyInbox }
					width={ 110 }
					height={ 80 }
					alt='' />
				<div className='text-xs sm:text-sm font-normal leading-[18px] text-gray-500'>
          No results
				</div>
			</div>
		);
	};

	const renderChatHistory = () => {
		if (!loadingGetChats && !dataChats.length) {
			return renderEmptyChatHistory();
		}

		const messages = dataChats.map(chat => ({
			content: chat.content,
			role: chat.sender_type === 'bot' ? 'bot' : 'user',
		}));
		const groupedMessages = groupingMessages(messages);

		return (
			<>
				{ groupedMessages.map((chat, chatIdx) => {
					const bubbleProps = {
						index: chatIdx,
						chat: chat,
						botData: {
							name: botData?.name,
							image: botData?.avatar,
						},
						userData: {
							name: activeConvData?.creator_name,
							image: activeConvData?.creator_img,
						},
						rateBotChat: false,
					};

					if (chatIdx === 0) {
						return (
							<div key={ `chat-${chatIdx}` }>
								<div
									className='w-full h-4 mb-4'
									ref={ firstElementChatRef } />
								<div>
									<Bubble { ...bubbleProps } />
								</div>
							</div>
						);
					}

					return (
						<div key={ `chat-${chatIdx}` }>
							<Bubble { ...bubbleProps } />
						</div>
					);
				}) }
			</>
		);
	};

	const renderContentSheet = () => {
		return (
			<div
				ref={ scrollAreaRef }
				className='overflow-y-auto w-full h-full custom-scrollbar px-4 lg:px-6 pb-8'
			>
				{ loadingGetChats && (
					<div className='flex items-center justify-center py-2.5'>
						<BarLoader barClassName='w-[3px] h-3 bg-gray-500' />
					</div>
				) }

				{ renderChatHistory() }
			</div>
		);
	};

	const columns: ColumnDef<ChannelItem>[] = useMemo(() => {
		const defaultColumns: ColumnDef<ChannelItem>[] = [
			{
				id: 'creator_img',
				accessorKey: 'creator_img',
			},
			{
				accessorKey: 'creator_name',
				header: 'User',
				cell: ({ row }) => {
					const creatorName: string = row.getValue('creator_name');
					const image: string = row.getValue('creator_img');

					return (
						<div className='flex items-center gap-3 lg:gap-2 min-w-[200px]'>
							{ image ? (
								<div className='relative overflow-hidden w-8 h-8 rounded-full flex-shrink-0'>
									<Image
										src={ image }
										alt=''
										fill
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										className='w-full h-full object-cover'
									/>
								</div>
							) : (
								<InitialAvatar
									name={ creatorName }
									className='w-8 h-8 flex-shrink-0'
								/>
							) }
							<span className='text-xs lg:text-sm text-gray-500'>
								{ creatorName }
							</span>
						</div>
					);
				},
			},
		];

		if (isMobile) {
			return [
				{
					id: 'actions_expand',
					enableHiding: false,
					cell: ({ row }) => {
						return (
							<div className='flex justify-start'>
								<ChevronDown
									className={ cn(
										'w-5 h-5 text-gray-500 flex-shrink-0 duration-300 ease-out transition-all animate-in',
										row.getIsExpanded() ? 'rotate-180' : 'rotate-0'
									) }
								/>
							</div>
						);
					},
				},
				...defaultColumns,
			];
		}

		return [
			...defaultColumns,
			{
				accessorKey: 'latest_msg',
				header: 'Last Message',
				cell: ({ row }) => {
					return (
						<span className='text-xs lg:text-sm text-gray-500 line-clamp-3'>
							{ row.getValue('latest_msg') }
						</span>
					);
				},
			},
			{
				accessorKey: 'created_at',
				header: 'Start Date',
				cell: ({ row }) => {
					return (
						<span className='whitespace-nowrap'>
							{ showDefaultFormattedDate(row.getValue('created_at')) }
						</span>
					);
				},
			},
			{
				id: 'actions_view',
				enableHiding: false,
				cell: ({ row }) => {
					return (
						<div className='flex justify-end'>
							<button
								className='focus:ring-0 focus:outline-none text-sm font-semibold text-purple-600'
								onClick={ () => {
									setActiveConvData(row.original);
									resetOpenConvData();
									setOpenSheet(true);
								} }
							>
                View
							</button>
						</div>
					);
				},
			},
		];
	}, [isMobile]);

	const renderExpandableRow = (subRow?: ConvResp[]) => {
		if (subRow) {
			return (
				<div className='-my-4'>
					<div>
						{ subRow?.map((el, elIdx) => {
							return (
								<div
									key={ elIdx }
									className='text-xs'>
									<div className='py-4'>
										<span className='line-clamp-1'>
											<span className='font-medium'>Last Message: </span>{ ' ' }
											{ el.latest_msg }
										</span>
									</div>
									<div className='grid grid-cols-2 py-4'>
										<span className='whitespace-normal'>
											<span className='font-medium'>Start Date: </span>{ ' ' }
											{ showDefaultFormattedDate(el.created_at) }
										</span>
										<div className='flex items-center justify-center'>
											<button
												className='focus:ring-0 focus:outline-none font-bold text-purple-600'
												onClick={ () => {
													setActiveConvData(el);
													resetOpenConvData();
													setOpenSheet(true);
												} }
											>
                        View
											</button>
										</div>
									</div>
								</div>
							);
						}) }
					</div>
				</div>
			);
		}

		return null;
	};

	const renderTabTitle = (title: string, tabId: string) => {
		if (selectedTabId === 'channels' && tabId === 'channels') {
			return (
				<span className='inline-flex items-center gap-2'>
					{ title }
					{ /* <span className='rounded-full overflow-hidden text-sm font-medium text-purple-700 bg-purple-50 py-0.5 px-2'>
						86
					</span> */ }
				</span>
			);
		}

		return <span>{ title }</span>;
	};

	const renderTab = () => {
		return (
			<div className='flex gap-4'>
				{ tabs.map((tab, index) => {
					return (
						<Tab
							key={ index }
							onClick={ () => setSelectedTabId(tab.id) }
							selected={ selectedTabId === tab.id }
							title={ renderTabTitle(tab.title, tab.id) }
							layoutId='tab-bot-detail-page'
						/>
					);
				}) }
			</div>
		);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const renderAboutBotValue = (value: any) => {
		if (!value) {
			return (
				<div className='flex gap-1.5 items-center'>
					<div className='flex-shrink-0'>
						<Image
							src={ images.icons.database }
							width={ 20 }
							height={ 20 }
							className='w-auto h-auto'
							alt=''
						/>
					</div>
					<span className='text-sm text-gray-500'>Empty</span>
				</div>
			);
		}

		if (Array.isArray(value)) {
			return (
				<span className='flex flex-wrap items-center gap-1'>
					{ value.map((tag, tagIdx) => {
						return (
							<span
								key={ `tag-${tagIdx}` }
								className='py-1 px-3 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium'
							>
								{ tag }
							</span>
						);
					}) }
				</span>
			);
		}

		return (
			<span
				className='text-sm lg:text-base whitespace-pre-line'
				dangerouslySetInnerHTML={ { __html: value } }
			/>
		);
	};

	const handleModalChangePrice = (item: SubscribePlanResp) => {
		setPackageSelected([item]);
		setChangePriceValue(item.price !== undefined ? item.price.toString() : '0');
		setOpenModalUpdatePrice(true);
	};

	const handleInputChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;
		// Allow digits and at most one decimal point
		const numericValue = rawValue.replace(/[^\d.]/g, '');
		
		// Ensure only one decimal point
		const parts = numericValue.split('.');
		const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
		
		if (sanitizedValue === '') {
			setChangePriceValue('');
			return;
		}
		
		// Limit to two decimal places
		if (parts.length > 1 && parts[1].length > 2) {
			return;
		}
		
		setChangePriceValue(sanitizedValue);
	};

	const handleSubmitChangePrice = async(data: SubscribePlanResp) => {
		try {
			const payloads = {
				price: Number(changePriceValue.replace('$', '').trim()),
			};

			const response = await (
				await apiClient.subscriptionApi()
			).updatePriceSubscribePlan(data?.id ?? 0, payloads);
			if (response.status === 200) {
				toastify(
					'success',
					'Change price to $' + changePriceValue + ' Succcessfully'
				);
				setPackageSelected([]);
				setOpenModalUpdatePrice(false);
				getSubscribePlan();
			}
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoadingGetChannels(false);
		}
	};

	const handleChangeActivateSubscriptions = async(e: boolean) => {
		try {
			const payloads = {
				is_active: e,
			};

			const response = await (
				await apiClient.subscriptionApi()
			).updateIsActiveSubscribePlan(botData?.code ?? '', payloads);
			if (response.status === 200) {
				setActivationPaid(e);
				toastify(
					'success',
					e ? 'Activated Succcessfully' : 'Inactivated Succcessfully'
				);
			}
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoadingGetChannels(false);
		}
	};

	const renderContentByTab = () => {
		if (selectedTabId === 'detail_information') {
			return (
				<div className='w-full bg-neutral-white max-lg:px-4 p-42px rounded-3xl'>
					<dl className='flex flex-col gap-y-6'>
						{ detailInfoList.map((item, itemIdx) => {
							const value = botData[item.id as keyof BotResp];

							if (
								Array.isArray(value) &&
                !value?.length &&
                item.id === 'tags'
							) {
								return null;
							}

							return (
								<div
									key={ item.id }
									className={ cn(
										'grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4 text-base text-gray-800',
										itemIdx < detailInfoList.length - 1 &&
                      'pb-6 border-b border-gray-200'
									) }
								>
									<dt className='font-medium'>{ item.title }</dt>
									<dd className='sm:col-span-2'>
										{ renderAboutBotValue(value) }
									</dd>
								</div>
							);
						}) }
					</dl>
				</div>
			);
		}

		if (selectedTabId === 'channels') {
			return (
				<div className='w-full'>
					<DataTable
						columns={ columns }
						data={ dataChannels?.slice(0, 10) }
						defaultColumnVisibility={ { creator_img: false } }
						renderExpandableRow={ isMobile ? renderExpandableRow : undefined }
						rowCount={ dataChannels.length }
						onPaginationChange={ props => {
							setPaginationChannels(prevPagination => ({
								...prevPagination,
								pageIndex: props.pageIndex,
								type: props.type,
							}));
						} }
						loading={ loadingGetChannels }
						disabledNextPagination={ disabledNextPagination }
					/>
				</div>
			);
		}

		if (selectedTabId === 'paid_subscribers') {
			return (
				<div className='w-full flex flex-col gap-8'>
					<div className='flex gap-4 mt-2'>
						<div>
							<Switch
								checked={ activationPaid }
								onChange={ e => handleChangeActivateSubscriptions(e) }
								size='w-11 h-6'
							/>
						</div>
						<div className='flex gap-y-2 flex-col'>
							<h3 className='text-base text-gray-800 font-medium leading-[20.4px]'>
                Activate Paid Subscriptions
							</h3>
							<p className='text-sm font-normal text-gray-500'>
                Monetize your MiniMe with paid subscriptions
							</p>
						</div>
					</div>

					<div className='flex flex-col w-full gap-8'>
						{ dataSubscribePlan[0]?.is_active ? (
							dataSubscribePlan.map((items, index) => {
								return (
									<div
										className='flex flex-col w-full bg-white rounded-[24px] p-[42px] rounded-xl justify-stretch gap-6'
										key={ `list-${index}` }
									>
										<div className='flex flex-row border-b border-gray-200 pb-6'>
											<div className='flex flex-col w-full justify-between items-start gap-3'>
												<label className='text-sm text-gray-500 font-medium leading-5'>
                          Package
												</label>
												<h4 className='font-bold text-lg text-gray-800 leading-7'>
													{ items.plan_names }
												</h4>
											</div>
											<div className='flex flex-col w-full justify-between items-start gap-3'>
												<label className='text-sm text-gray-500 font-medium leading-5'>
                          Price
												</label>
												<h4 className='font-bold text-lg text-gray-800 leading-7'>
                          ${ items.price }
												</h4>
											</div>
											<div className='flex flex-col w-full items-start justify-end'>
												<p
													className='cursor-pointer text-sm font-bold leading-5 text-left text-purple-600'
													onClick={ () => handleModalChangePrice(items) }
												>
                          Change price
												</p>
											</div>
										</div>
										<div className='flex flex-row max-sm:flex-col gap-4'>
											<div className='flex flex-col w-full justify-between items-start gap-3'>
												<label className='text-sm text-gray-500 font-bold leading-5'>
                          Total Subscribers
												</label>
												<div className='flex w-full justify-between items-center'>
													<div className='flex w-2/3 items-center gap-2'>
														<Image
															src={ images.icons.subscribers }
															width={ 14.67 }
															height={ 12 }
															alt='users-icon-total-subscriber'
															className='text-gray-500'
														/>
														<h4 className='font-medium text-sm text-gray-800 leading-5'>
															{ formatCurrency('', '0') } users
														</h4>{ ' ' }
														{ /* TO DO change to field total user */ }
													</div>
													<div className='flex flex-col items-end pr-6 max-sm:pr-0 w-1/3 gap-1'>
														<div className='flex'>
															{ /* TO DO Change items.bot_code to indicator field */ }
															<Image
																src={
																	items.bot_code === 'up'
																		? images.icons.arrowUpGreen
																		: images.icons.arrowDownRed
																}
																alt='indicator-icon-total-subscriber'
																width={ 16 }
																height={ 16 }
															/>
															{ /* TO DO Change items.id to total user */ }
															<p className='font-medium text-sm text-gray-800 leading-5'>
																{ items.id }
															</p>
														</div>
														<div>
															<p className='font-normal text-xs text-gray-400 leading-[18px]'>
                                vs last week
															</p>
														</div>
													</div>
												</div>
											</div>
											<div className='flex flex-col w-full justify-between items-start gap-3'>
												<label className='text-sm text-gray-500 font-bold leading-5'>
                          Active Subscriptions
												</label>
												<div className='flex w-full justify-between items-center'>
													<div className='flex w-2/3 items-center gap-2'>
														<Image
															src={ images.icons.subscribers }
															width={ 14.67 }
															height={ 12 }
															alt='users-icon-total-subscriber'
														/>
														<h4 className='font-medium text-sm text-gray-800 leading-5'>
															{ formatCurrency('', '0') } users
														</h4>{ ' ' }
														{ /* To DO Changes to total active subs */ }
													</div>
													<div className='flex flex-col items-end pr-6 max-sm:pr-0 w-1/3 gap-1'>
														<div className='flex'>
															{ /* TO DO Change items.bot_code to indicator field */ }
															<Image
																src={
																	items.bot_code === 'up'
																		? images.icons.arrowUpGreen
																		: images.icons.arrowDownRed
																}
																alt='indicator-icon-total-subscriber'
																width={ 16 }
																height={ 16 }
															/>
															{ /* TO DO Change items.id to active subs field */ }
															<p className='font-medium text-sm text-gray-800 leading-5'>
																{ items.id }
															</p>
														</div>
														<div>
															<p className='font-normal text-xs text-gray-400 leading-[18px]'>
                                vs last week
															</p>
														</div>
													</div>
												</div>
											</div>
											<div className='flex flex-col w-full justify-between items-start gap-3'>
												<label className='text-sm text-gray-500 font-bold leading-5'>
                          Expired Subscriptions
												</label>
												<div className='flex w-full justify-between items-center'>
													<div className='flex w-2/3 items-center gap-2'>
														<Image
															src={ images.icons.subscribers }
															width={ 14.67 }
															height={ 12 }
															alt='users-icon-total-subscriber'
														/>
														<h4 className='font-medium text-sm text-gray-800 leading-5'>
															{ formatCurrency('', '0') } users
														</h4>{ ' ' }
														{ /* To DO Changes to total exp subs */ }
													</div>
													<div className='flex flex-col items-end pr-6 max-sm:pr-0 w-1/3 gap-1'>
														<div className='flex'>
															{ /* TO DO Change items.bot_code to indicator field */ }
															<Image
																src={
																	items.bot_code === 'up'
																		? images.icons.arrowUpGreen
																		: images.icons.arrowDownRed
																}
																alt='indicator-icon-total-subscriber'
																width={ 16 }
																height={ 16 }
															/>
															{ /* TO DO Change items.id to Expired subs field */ }
															<p className='font-medium text-sm text-gray-800 leading-5'>
																{ items.id }
															</p>
														</div>
														<div>
															<p className='font-normal text-xs text-gray-400 leading-[18px]'>
                                vs last week
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})
						) : (
							<></>
						) }
					</div>

					{ /* Modal Change Price */ }
					<Dialog
						open={ openModalUpdatePrice }
						onOpenChange={ setOpenModalUpdatePrice }
					>
						<DialogTrigger className='hidden'>Open</DialogTrigger>
						<DialogContent
							aria-description='sign-in-dialog'
							className='flex flex-col gap-y-6 max-w-[91%] sm:max-w-[343px] lg:max-w-[500px] p-6 lg:p-8 focus:ring-0 focus:outline-none'
						>
							<DialogDescription asChild>
								<div className='flex flex-col gap-y-6'>
									<div className='flex flex-col w-full justify-between items-start gap-[6px]'>
										<label className='text-sm text-gray-500 font-medium leading-5'>
                      						Package
										</label>
										<h4 className='font-bold text-lg text-gray-800 leading-7'>
											{ packageSelected[0]?.plan_names }
										</h4>
									</div>
									<div className='flex flex-col w-full justify-between items-start gap-[6px]'>
										<label className='text-sm text-gray-500 font-medium leading-5'>
											Price
										</label>
										<div className='flex items-center space-x-2 w-full relative'>
											<span className='absolute left-5'>$</span>
											<input
												type='text'
												value={ changePriceValue }
												onChange={ handleInputChangePrice }
												className='w-full border border-gray-300 rounded-md py-2.5 pl-8 pr-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base'
												placeholder='Enter amount'
											/>
										</div>
									</div>
								</div>
							</DialogDescription>
							<button
								onClick={ () => handleSubmitChangePrice(packageSelected[0]) }
								className='mt-3 focus:ring-0 focus:outline-none font-bold text-base w-full rounded-32px btn-primary-midnight-black border-primary-midnight-black px-5 py-3 '
							>
                Update Price
							</button>
						</DialogContent>
					</Dialog>
					{ /* End Modal Change Price */ }
				</div>
			);
		}

		return null;
	};

	return (
		<>
			<LayoutDashboardPage backNavigation>
				<div className='flex items-center gap-4'>
					{ botData?.avatar ? (
						<div className='relative overflow-hidden w-[92px] h-[92px] rounded-10px'>
							<Image
								src={ botData?.avatar }
								alt={ botData?.name ?? '' }
								fill
								className='w-full h-full object-cover'
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							/>
						</div>
					) : (
						<InitialAvatar
							name={ botData?.name ?? 'Bot' }
							className='w-[92px] h-[92px] rounded-10px'
							defaultColor={ 0 }
						/>
					) }

					<div>
						<div className='flex items-baseline gap-2'>
							<h1 className='text-gray-800 text-base lg:text-2xl font-bold'>
								{ botData?.name }
							</h1>
							<Link
								href={ ROOT_PREFIX + `/${botData?.bot_alias}` }
								target='_blank'
								rel='noopener noreferrer'
							>
								<div className='relative overflow-hidden w-4 h-4 lg:w-5 lg:h-5'>
									<Image
										src={ images.icons.externalLink }
										alt=''
										fill
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									/>
								</div>
							</Link>
						</div>
						<div className='flex items-center gap-4 mt-4'>
							<BadgeStatus
								className='gap-[6px] py-0.5 lg:py-1 pl-1.5 lg:pl-2.5 pr-2 lg:pr-3 rounded-2xl text-xs lg:text-sm'
								status={ botData?.req_status }
								dotClassName='w-2 h-2'
							/>

							<span className='text-xs lg:text-sm text-gray-500'>
                Created on { showDefaultFormattedDate(botData?.created_at) }
							</span>
						</div>
					</div>
				</div>
				<div className='border-b border-gray-200 w-full mt-8'>
					{ renderTab() }
				</div>
				<div className='pt-6 overflow-hidden'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={ `bot-detail-content-tab-${selectedTabId}` }
							initial={ { y: 10, opacity: 0 } }
							animate={ { y: 0, opacity: 1 } }
							exit={ { y: -10, opacity: 0 } }
							transition={ { duration: 0.375, ease: 'easeInOut' } }
						>
							{ renderContentByTab() }
						</motion.div>
					</AnimatePresence>
				</div>
			</LayoutDashboardPage>

			<SheetPreviewChat
				open={ openSheet }
				onOpenChange={ setOpenSheet }
				mobile={ isMobile }
			>
				{ renderContentSheet() }
			</SheetPreviewChat>
		</>
	);
};

export default BotDetailPage;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const codeAlias = (ctx.params?.code ?? '') as string;

	try {
		const session = await getServerSession(ctx.req, ctx.res, authOptions);
		const botDetailResponse = await (
			await apiInstance.botsApi()
		).getBotDetail(codeAlias, {
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			headers: {
				Authorization: `${session?.token ? 'Bearer ' + session?.token : ''}`,
			},
		});

		return {
			props: {
				data: botDetailResponse?.data?.data,
			},
		};
	} catch (error) {
		return {
			props: {
				data: {
					creator_name: '',
					code: '',
					bot_alias: codeAlias,
					name: '',
					avatar: '',
					api_url: '',
					is_online: false,
					req_status: 0,
					welcome_msg: '',
					created_at: '',
				} as BotResp,
			},
		};
	}
};
