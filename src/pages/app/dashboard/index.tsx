import https from 'https';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';

import BadgeStatus from '@/components/BadgeStatus';
import BotCard from '@/components/Card/BotCard';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@/components/Dialog';
import LayoutDashboardPage from '@/components/Layout/Dashboard/Page';
import images from '@/constant/data/images';
import { groupBy } from '@/helpers/groupBy';
import { displayUserName } from '@/helpers/misc';
import { BotStatus } from '@/interfaces';
import { Api } from '@/lib/api';
import { ROOT_PREFIX } from '@/lib/routes';
import { BotResp } from '@/openapi';

import { authOptions } from '../../api/auth/[...nextauth]';

const apiInstance = new Api();

const CopyToClipboard = dynamic(
	() => import('../../../components/CopyToClipboard'),
	{ ssr: false }
);
const EmptyStateDashboard = dynamic(
	() => import('../../../components/EmptyStateDashboard'),
	{ ssr: false }
);

type BotMinimeProps = {
  data: BotResp[];
  title: string;
  status?: number;
};

type DashboardPageProps = {
  userName: string;
  myMinime: BotResp[];
};

const DashboardPage: NextPage<DashboardPageProps> = ({
	userName,
	myMinime,
}) => {
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
			<>
				<div className='flex flex-col text-center gap-3 mt-3'>
					<h5 className='text-gray-800 text-base lg:text-lg leading-5 lg:leading-[23px] font-bold'>
            			You&apos;re on the waitlist
					</h5>
					<p className='text-sm text-gray-500'>
						We&apos;ll email you once you&apos;re off the waitlist. Please contact us if
						you have any questions or requests at{ ' ' }
						<span className='font-bold'>hello@myminime.ai</span>
					</p>
				</div>
				<div className='mt-8 w-full'>
					<DialogClose className='w-full flex'>
						<span className='focus:ring-0 focus:outline-none btn-primary-midnight-black rounded-32px py-2.5 lg:py-3 px-5 w-full text-sm lg:text-base font-bold text-center'>
              				Close
						</span>
					</DialogClose>
				</div>
			</>
		);
	};

	const renderBotMinime = ({
		data,
		title,
		status
	}: BotMinimeProps) => {
		return (
			<div className='flex flex-col gap-4 lg:gap-6 w-full'>
				<div className='flex items-center gap-3'>
					<span className='flex items-center gap-2'>
						{ renderSectionTitle(title) }
					</span>
					{ renderBadgeStatus(status) }
				</div>
				<div className='flex flex-col gap-y-4 w-full'>
					{ data?.map((item, index) => {
						if (item.req_status !== BotStatus.PENDING) {
							return (
								<Link
									key={ index }
									className='w-full h-full'
									href={ ROOT_PREFIX + `/bot/${item.bot_alias}` }
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
			</div>
		);
	};

	const renderContentEmptyBot = () => {
		return (
			<div className='flex flex-col gap-[62px] pb-8'>
				<EmptyStateDashboard />
			</div>
		);
	};

	const renderCurrentBot = () => {
		const groupedByStatus = groupBy(myMinime, v => `${v.req_status}`);

		return (
			<div className='flex max-lg:flex-col gap-y-42px lg:grid lg:grid-cols-2 lg:gap-8 w-full'>
				<div className='sm:max-w-[360px] flex flex-col gap-6'>
					{ Object.keys(groupedByStatus).map(key => {
						return (
							<div key={ `myminime-${key}` }>
								{ renderBotMinime({
									data: groupedByStatus[key],
									title: 'My MiniMe',
									status: Number(key),
								}) }
							</div>
						);
					}) }
				</div>
			</div>
		);
	};

	const renderContactUs = () => {
		return (
			<div className='flex flex-col gap-4 lg:gap-6'>
				<div className='flex gap-2 flex-col'>
					{ renderSectionTitle('Contact Us') }
					<p className='text-gray-800 text-left text-xs lg:text-sm font-normal'>
            For any questions or requests regarding your MiniMe, please email us
					</p>
				</div>

				<CopyToClipboard
					text='hello@myminime.ai'
					className='flex w-full sm:w-fit'
				>
					<div className='w-full flex items-center rounded-lg border p-3 gap-3 bg-neutral-white border-gray-100 shadow-general-xs'>
						<div>
							<Image
								src={ images.icons.envelopeRounded }
								alt=''
								width={ 32 }
								height={ 32 }
								className='w-8 h-8 object-contain flex-shrink-0'
							/>
						</div>
						<span className='text-sm font-normal text-gray-800'>
              hello@myminime.ai
						</span>
					</div>
				</CopyToClipboard>
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
		return (
			<div className='flex flex-col gap-8'>
				{ renderGreetings() }
				{ myMinime?.length > 0 ? (
					<>
						{ renderCurrentBot() }
						{ renderContactUs() }
					</>
				) : (
					renderContentEmptyBot()
				) }
			</div>
		);
	};

	return <LayoutDashboardPage>{ renderContentDashboard() }</LayoutDashboardPage>;
};

export default DashboardPage;

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

	const userName = session?.user?.name || '';
	try {
		const headers = {
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			headers: {
				Authorization: `${session?.token ? 'Bearer ' + session?.token : ''}`,
			},
		};

		const botListResponse = await (
			await apiInstance.botsApi()
		).getBot(10, undefined, undefined, undefined, undefined, headers);

		const allBotData = botListResponse?.data?.data ?? [];

		return {
			props: {
				userName,
				myMinime: allBotData,
			},
		};
	} catch (error) {
		return {
			props: {
				userName,
				myMinime: [],
			},
		};
	}
};
