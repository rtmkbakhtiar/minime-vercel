import { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';

import BadgeStatus from '@/components/BadgeStatus';
import BotCard from '@/components/Card/BotCard';
import { Dialog, DialogContent, DialogTrigger } from '@/components/Dialog';
import LayoutDashboardPage from '@/components/Layout/Dashboard/Page';
import BarLoader from '@/components/Loader/Bar';
import images from '@/constant/data/images';
import { handleCatchError } from '@/helpers/handleError';
import { displayUserName, getUrlParamAsObject } from '@/helpers/misc';
import useApiClient from '@/hooks/useApiClient';
import { BotStatus } from '@/interfaces';
import { ROOT_PREFIX, USER_DASHBOARD_ROUTE } from '@/lib/routes';
import { BotResp } from '@/openapi';

import { authOptions } from '../../api/auth/[...nextauth]';

type BotMinimeProps = {
  title: string;
  status: number;
};

type DataState = {
  data: BotResp[];
  page: number;
  prev: string;
  next: string;
  firstNext: string;
  count: number;
};

type AdminDashboardPageProps = {
  userName: string;
};

const LIMIT_PAGINATION = 6;

const AdminDashboardPage: NextPage<AdminDashboardPageProps> = ({
	userName,
}) => {
	const apiClient = useApiClient();

	const [loading, setLoading] = useState<Record<string, boolean>>({
		'0': true,
		'1': true,
		'2': true,
	});
	const [data, setData] = useState<Record<string, DataState>>({
		'0': {
			data: [],
			page: 1,
			prev: '',
			next: '',
			firstNext: '',
			count: 0,
		},
		'1': {
			data: [],
			page: 1,
			prev: '',
			next: '',
			firstNext: '',
			count: 0,
		},
		'2': {
			data: [],
			page: 1,
			prev: '',
			next: '',
			firstNext: '',
			count: 0,
		},
	});

	const getBotList = async(status: number) => {
		if (data[status].page === 1 && data[status].data?.length > 0) {
			return setData(prevData => ({
				...prevData,
				[status]: {
					...prevData[status],
					data: prevData[status].data.slice(0, LIMIT_PAGINATION),
					prev: '',
					next: prevData.firstNext,
				},
			}));
		}

		try {
			setLoading(prevLoading => ({
				...prevLoading,
				[status]: true,
			}));
			const nextUrl = data[status]?.next ?? '';
			const prevUrl = data[status]?.prev ?? '';
			const nextParam = getUrlParamAsObject(nextUrl)?.next;
			const prevParam = getUrlParamAsObject(prevUrl)?.prev;
			const response = await (
				await apiClient.botsApi()
			).getBot(LIMIT_PAGINATION, 'desc', `${status}`, nextParam, prevParam);
			const responseData = response?.data;

			setData(prevData => ({
				...prevData,
				[status]: {
					...prevData[status],
					data: [...prevData[status].data, ...(responseData?.data || [])],
					count: responseData?.pagination?.total_bots || 0,
					prev: responseData?.pagination?.prev || '',
					next: responseData?.pagination?.next || '',
					firstNext:
            prevData[status].page === 1
            	? responseData?.pagination?.next || ''
            	: prevData[status].firstNext,
				},
			}));
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoading(prevLoading => ({
				...prevLoading,
				[status]: false,
			}));
		}
	};

	useEffect(() => {
		getBotList(BotStatus.ACTIVE);
	}, [data[BotStatus.ACTIVE].page]);

	useEffect(() => {
		getBotList(BotStatus.PENDING);
	}, [data[BotStatus.PENDING].page]);

	useEffect(() => {
		getBotList(BotStatus.INACTIVE);
	}, [data[BotStatus.INACTIVE].page]);

	const renderSectionTitle = (title: string) => {
		return (
			<h2 className='font-bold text-base lg:text-xl text-gray-800 !leading-5 lg:!leading-[25px]'>
				{ title }
			</h2>
		);
	};

	const renderBadgeStatus = (status?: number) => {
		if (typeof status === 'number') {
			return (
				<BadgeStatus
					status={ status }
					className='gap-[6px] p-0.5 pr-2 lg:pr-2.5 pl-1.5 lg:pl-2 rounded-xl font-medium text-xs lg:text-sm'
					dotClassName='w-1.5 h-1.5'
				/>
			);
		}

		return null;
	};

	const renderContentDialogBotPending = () => {
		return (
			<div className='mt-3 flex items-center text-center'>
				<h5 className='text-gray-800 text-base lg:text-lg leading-5 lg:leading-[23px] font-bold'>
          This MiniMe is still under construction
				</h5>
			</div>
		);
	};

	const renderButtonExpandMinimeList = (
		status: number,
		state: DataState,
		currentData: BotResp[]
	) => {
		const isExpandMore = currentData?.length < (state?.count ?? 0);
		const isExpandLess =
      currentData?.length === state?.count && state?.count > LIMIT_PAGINATION;

		if (isExpandLess) {
			return (
				<div className='flex justify-center mt-2.5'>
					<button
						onClick={ () => {
							setData(prevData => ({
								...prevData,
								[`${status}`]: {
									...prevData[status],
									page: 1,
								},
							}));
						} }
						className='focus:ring-0 focus:outline-none text-xs font-bold text-gray-500 text-center'
					>
            Expand Less
					</button>
				</div>
			);
		}

		if (isExpandMore) {
			return (
				<div className='flex justify-center mt-2.5'>
					<button
						onClick={ () => {
							setData(prevData => ({
								...prevData,
								[`${status}`]: {
									...prevData[status],
									page: prevData[status].page + 1,
								},
							}));
						} }
						className='focus:ring-0 focus:outline-none text-xs font-bold text-gray-500 text-center'
					>
            Expand More
					</button>
				</div>
			);
		}

		return null;
	};

	const renderBotList = (status: number, currentData: BotResp[]) => {
		if (!currentData.length && !loading[status]) {
			return (
				<div className='flex flex-col justify-center items-center gap-2.5'>
					<Image
						src={ images.icons.emptyInbox }
						width={ 110 }
						height={ 80 }
						alt='' />
					<div className='text-xs lg:text-sm font-normal leading-[18px] text-gray-500'>
            There is no data exist
					</div>
				</div>
			);
		}

		return (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'>
				{ currentData?.map((item, index) => {
					if (status !== BotStatus.PENDING) {
						return (
							<Link
								key={ index }
								className='w-full h-full'
								href={ ROOT_PREFIX + `/bot/${item.bot_alias ?? ''}` }
							>
								<BotCard data={ item } />
							</Link>
						);
					}

					return (
						<Dialog key={ index }>
							<DialogTrigger>
								<BotCard data={ item } />
							</DialogTrigger>
							<DialogContent className='max-w-[91%] sm:max-w-[500px] p-8'>
								<div className='flex flex-col items-center justify-center w-full'>
									<Image
										src={ images.icons.emptyInbox2 }
										alt='empty-data'
										width={ 180 }
										height={ 130.91 }
										className='w-[11.25rem] h-auto object-contain'
									/>
									{ renderContentDialogBotPending() }
								</div>
							</DialogContent>
						</Dialog>
					);
				}) }
			</div>
		);
	};

	const renderBotMinime = ({ title, status }: BotMinimeProps) => {
		const item = data[status];
		const currentData = item.data.slice(0, (item.page ?? 1) * LIMIT_PAGINATION);
		const isLoading = loading[status] === true;

		return (
			<div className='flex flex-col gap-4 lg:gap-6 w-full'>
				<div className='flex items-center gap-4'>
					<span className='flex items-center gap-2'>
						{ renderSectionTitle(title) }

						<span className='py-0.5 px-2 bg-purple-50 rounded-2xl text-xs text-purple-700 text-center font-medium'>
							{ item.count }
						</span>
					</span>
					{ renderBadgeStatus(status) }
				</div>

				{ renderBotList(status, currentData) }
				{ isLoading ? (
					<div className='flex justify-center w-full'>
						<BarLoader barClassName='w-1 h-5 bg-gray-500' />
					</div>
				) : (
					renderButtonExpandMinimeList(status, item, currentData)
				) }
			</div>
		);
	};

	const renderGreetings = () => {
		return (
			<div className='flex flex-col gap-2 lg:gap-4'>
				<h1 className='text-gray-800 text-xl lg:text-3xl font-bold'>
          Dashboard
				</h1>
				<span className='inline-flex items-center gap-2 text-xs lg:text-base font-medium'>
          Welcome back, { displayUserName(userName || '', 1) }
					<span className='relative w-3.5 h-3.5 lg:w-18px lg:h-18px'>
						<Image
							src={ images.icons.handWave }
							alt='welcome'
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							fill
						/>
					</span>
				</span>
			</div>
		);
	};

	const renderContentDashboard = () => {
		const list = [
			{
				title: 'Requested',
				status: 0,
			},
			{
				title: 'Published MiniMe',
				status: 1,
			},
			{
				title: 'Inactive',
				status: 2,
			},
		];

		return (
			<div className='pb-20 w-full'>
				{ renderGreetings() }

				<div className='flex flex-col gap-y-42px lg:gap-y-8 mt-42px'>
					{ list.map((item, itemIdx) => {
						return (
							<div key={ `list-${itemIdx}` }>
								{ renderBotMinime({
									title: item.title,
									status: item.status,
								}) }
							</div>
						);
					}) }
				</div>
			</div>
		);
	};

	return <LayoutDashboardPage>{ renderContentDashboard() }</LayoutDashboardPage>;
};

export default AdminDashboardPage;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await getServerSession(ctx.req, ctx.res, authOptions);

	if (!session?.token) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	if (session?.token && session?.user?.role === 'user') {
		return {
			redirect: {
				destination: USER_DASHBOARD_ROUTE,
				permanent: false,
			},
		};
	}

	const userName = session?.user?.name || '';

	return {
		props: {
			userName,
		},
	};
};
