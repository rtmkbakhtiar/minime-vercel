import React, { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import ChevronDown from 'public/images/icons/chevron-down.svg';
import ChevronsLeft from 'public/images/icons/chevrons-left.svg';
import LogOut from 'public/images/icons/log-out.svg';

import images from '@/constant/data/images';
import { handleCatchError } from '@/helpers/handleError';
import { displayUserName, getUrlParamAsObject } from '@/helpers/misc';
import useApiClient from '@/hooks/useApiClient';
import { PaginationState } from '@/interfaces';
import { ROOT_PREFIX, userNavigation } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { ChatHistoryBotResp } from '@/openapi';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../../DropdownMenu';

const InitialAvatar = dynamic(() => import('../../../InitialAvatar'), {
	ssr: false,
});
const BarLoader = dynamic(() => import('../../../Loader/Bar'), { ssr: false });
const TooltipSubscription = dynamic(() => import('./TooltipSubscription'), {
	ssr: false,
});

type MenuItem = {
  id: number;
  label: string;
  icon: { outline: string; filled: string };
  link: string;
};

type LayoutDashboardSidebarProps = {
  toggleCollapse: boolean;
  handleToggleSidebar: () => void;
};

const LayoutDashboardSidebar: React.FC<LayoutDashboardSidebarProps> = ({
	toggleCollapse,
	handleToggleSidebar,
}) => {
	const router = useRouter();
	const session = useSession();
	const apiClient = useApiClient();
	const { ref: lastElementChatRef, inView: lastElementChatInView } =
    useInView();

	const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
	const [hasMoreDataHistoryChats, setHasMoreDataHistoryChats] =
    useState<boolean>(false);
	const [historyChats, setHistoryChats] = useState<ChatHistoryBotResp[]>([]);
	const [paginationHistoryChats, setPaginationHistoryChats] =
    useState<PaginationState>({
    	prev: '',
    	next: '',
    	pageIndex: 0,
    });
	const [loadingGetHistoryChats, setLoadingGetHistoryChats] =
    useState<boolean>(false);

	const activeMenu = useMemo(
		() => userNavigation.find(menu => menu.link === router.pathname),
		[router.pathname]
	);

	useEffect(() => {
		const getHistoryChats = async() => {
			try {
				setLoadingGetHistoryChats(true);

				const nextUrl = paginationHistoryChats.next ?? '';
				const nextParam = getUrlParamAsObject(nextUrl)?.next;
				const response = await (
					await apiClient.botsApi()
				).getListChatHistory(20, 'desc', undefined, nextParam);

				const currentDataMessages = response?.data?.data ?? [];
				const updatedDataChats =
          paginationHistoryChats.pageIndex > 0
          	? [...currentDataMessages, ...historyChats]
          	: currentDataMessages;

				setHistoryChats(
					updatedDataChats?.filter(chat => !!chat.bot_alias && !!chat.name)
				);
				setPaginationHistoryChats(prevPagination => ({
					...prevPagination,
					prev: response?.data?.pagination?.prev || '',
					next: response?.data?.pagination?.next || '',
				}));
				setHasMoreDataHistoryChats(!!currentDataMessages?.length);
			} catch (error) {
				handleCatchError(error);
			} finally {
				setTimeout(() => {
					// use settimeout to make sure everything is done
					setLoadingGetHistoryChats(false);
				}, 1000);
			}
		};

		if (session?.status === 'authenticated') {
			getHistoryChats();
		}
	}, [paginationHistoryChats.pageIndex, session?.status]);

	useEffect(() => {
		const handleLastElementChatInView = () => {
			if (loadingGetHistoryChats || session?.status !== 'authenticated') return;

			if (lastElementChatInView && hasMoreDataHistoryChats) {
				setPaginationHistoryChats(prevPagination => ({
					...prevPagination,
					pageIndex: prevPagination.pageIndex + 1,
				}));
			}
		};

		handleLastElementChatInView();
	}, [
		loadingGetHistoryChats,
		hasMoreDataHistoryChats,
		lastElementChatInView,
		session?.status,
	]);

	const getNavItemClasses = (menu: MenuItem) => {
		return cn(
			'flex items-center cursor-pointer overflow-hidden whitespace-nowrap lg:hover:bg-purple-50 lg:hover:rounded-10px',
			{
				['lg:bg-purple-50 lg:rounded-10px']: activeMenu?.id === menu.id,
				['w-full']: !toggleCollapse,
			}
		);
	};

	const handleSidebarToggle = () => {
		handleToggleSidebar();
	};

	const onClickLogout = () => {
		signOut({ callbackUrl: '/' });
	};

	const renderAvatar = () => {
		if (session?.status === 'authenticated') {
			const avatar = session?.data?.user?.image;

			if (avatar) {
				return (
					<div className='relative overflow-hidden w-6 h-6 lg:h-8 lg:w-8 rounded-full bg-gray-50'>
						<Image
							className='w-full h-full object-cover'
							fill
							src={ avatar }
							alt=''
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						/>
					</div>
				);
			}

			return (
				<InitialAvatar
					name={ session?.data?.user?.name ?? 'You' }
					className='w-6 h-6 lg:h-8 lg:w-8'
					defaultColor={ 2 }
				/>
			);
		}

		return null;
	};

	const renderDropdownProfileUser = (sideOffset?: number) => {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger className='focus:ring-0 focus:outline-none'>
					<div className='lg:px-3 lg:py-4 lg:border-t lg:border-gray-200 flex lg:items-center gap-x-2.5'>
						{ renderAvatar() }
						{ !toggleCollapse && (
							<>
								<span
									className={ cn(
										'text-base font-normal text-gray-800 max-lg:hidden'
									) }
								>
									{ displayUserName(session?.data?.user?.name ?? 'You') }
								</span>
								<span className='flex-shrink-0 max-lg:hidden'>
									<ChevronDown className='w-5 h-5 text-gray-400' />
								</span>
							</>
						) }
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					sideOffset={ sideOffset }
					align={ toggleCollapse ? 'start' : 'end' }
					className='w-[160px] lg:w-[var(--radix-dropdown-menu-trigger-width)] p-2 rounded-lg'
				>
					<DropdownMenuItem
						className='p-2 rounded-md text-sm lg:text-base max-lg:font-medium'
						onClick={ onClickLogout }
					>
						<LogOut className='mr-2 w-4 h-4 lg:h-5 lg:w-5 flex-shrink-0' />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	};

	const renderEmptyChatHistory = () => {
		return (
			<div className='flex flex-col justify-center items-center gap-2.5'>
				<Image
					src={ images.icons.emptyInbox }
					width={ 110 }
					height={ 80 }
					alt='' />
				<div className='text-xs font-normal leading-[18px] text-gray-500'>
          It’s empty! You can make a try.
				</div>
			</div>
		);
	};

	const renderDataChatHistoryList = () => {
		if (!loadingGetHistoryChats && !historyChats.length) {
			return (
				<div className='flex items-center justify-center w-full p-2.5'>
					{ renderEmptyChatHistory() }
				</div>
			);
		}

		return (
			<div className='flex flex-col gap-2 mt-2 lg:mt-2.5'>
				{ historyChats.map((item, index) => {
					return (
						<div
							key={ `chathistory-${index}` }
							{ ...(index === historyChats.length - 1
								? { ref: lastElementChatRef }
								: {}) }
						>
							<Link
								href={ ROOT_PREFIX + `/${item.bot_alias}/chat` }
								target='_blank'
								rel='noopener noreferrer'
								className='flex py-2 px-2.5 gap-2.5 w-full rounded-10px'
							>
								{ item.avatar ? (
									<div className='relative overflow-hidden rounded-full w-6 h-6 lg:w-8 lg:h-8'>
										<Image
											src={ item.avatar }
											alt=''
											fill
											sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
											className='w-full h-full object-cover'
										/>
									</div>
								) : (
									<InitialAvatar
										className='w-6 h-6 lg:w-8 lg:h-8'
										name={ item.name ?? 'bot' }
										defaultColor={ 0 }
									/>
								) }
								<div
									className={ cn('flex flex-col gap-y-1.5', {
										['hidden']: toggleCollapse,
									}) }
								>
									<span className='text-sm lg:text-base font-normal text-gray-800'>
										{ item.name }
									</span>
									{ item.remaining && (
										<TooltipSubscription remainingDate={ item.remaining } />
									) }
								</div>
							</Link>
						</div>
					);
				}) }
			</div>
		);
	};

	const renderChatHistory = () => {
		return (
			<div className='flex flex-col mt-6 lg:mt-9 w-full'>
				<div className='font-bold text-sm lg:text-base text-gray-800'>
					{ toggleCollapse ? 'Chats' : 'Chat History' }
				</div>
				{ renderDataChatHistoryList() }
				{ loadingGetHistoryChats && (
					<div className='flex items-center justify-center py-2.5'>
						<BarLoader barClassName='w-[3px] h-3 bg-gray-500' />
					</div>
				) }
			</div>
		);
	};

	const renderLogo = () => {
		return (
			<button
				onClick={ () => router.push('/').then(() => router.reload()) }
				className='focus:ring-0 focus:outline-none relative overflow-hidden w-[62px] lg:w-[82px] h-[10.66px] lg:h-[13.94px]'
			>
				<Image
					src={ images.logo.minime || '' }
					alt=''
					fill
					className='w-full h-full'
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
				/>
			</button>
		);
	};

	const renderMenuList = () => {
		return (
			<div className='flex flex-col'>
				<div className='flex flex-col gap-2.5 max-lg:border-b border-gray-100 max-lg:py-6'>
					{ userNavigation.map((menu, index) => {
						const classes = getNavItemClasses(menu);

						return (
							<div
								key={ index }
								className='overflow-hidden'>
								<Link
									key={ menu.id }
									className={ classes }
									href={ menu.link }>
									<div className='flex py-0 lg:py-2 lg:px-3 items-center h-full w-full gap-2.5'>
										<div className='relative overflow-hidden w-5 h-5 lg:w-8 lg:h-8 flex-shrink-0 max-lg:hidden'>
											<Image
												src={
													activeMenu?.id === menu?.id
														? menu.icon.filled
														: menu.icon.outline
												}
												alt={ menu.label ?? '' }
												fill
												sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
											/>
										</div>
										{ !toggleCollapse && (
											<span
												className={ cn(
													'text-sm lg:text-base font-normal text-gray-800',
													{
														['font-medium lg:font-bold']:
                              activeMenu?.id === menu.id,
													}
												) }
											>
												{ menu.label }
											</span>
										) }
									</div>
								</Link>
							</div>
						);
					}) }
				</div>

				{ !toggleCollapse &&
          session?.data?.user?.role === 'user' &&
          renderChatHistory() }
			</div>
		);
	};

	const renderMobileNavbar = () => {
		const activeMobileMenu = activeMenu ?? userNavigation[0];
		const wrapperVariants = {
			open: {
				scaleY: 1,
				transition: {
					when: 'beforeChildren',
					staggerChildren: 0.1,
				},
			},
			closed: {
				scaleY: 0,
				transition: {
					when: 'afterChildren',
					staggerChildren: 0.1,
				},
			},
		};

		const itemVariants = {
			open: {
				opacity: 1,
				y: 0,
				transition: {
					when: 'beforeChildren',
				},
			},
			closed: {
				opacity: 0,
				y: -15,
				transition: {
					when: 'afterChildren',
				},
			},
		};
		const opacityVariants = {
			initial: {
				opacity: 0,
				transition: {
					duration: 0.3,
					ease: [0.37, 0, 0.63, 1],
				},
			},
			open: {
				opacity: 1,
				transition: {
					ease: [0, 0.55, 0.45, 1],
					duration: 0.3,
				},
			},
		};

		return (
			<>
				<div className='fixed w-full top-0 left-0 origin-top z-[60] lg:hidden'>
					<div className='flex items-center justify-between h-[70px] bg-white px-4'>
						{ renderLogo() }

						{ renderDropdownProfileUser(23) }
					</div>
					<div className='flex flex-col'>
						<motion.div
							animate={ openMobileMenu ? 'open' : 'closed' }
							className='relative'
						>
							<button
								className='w-full flex items-center justify-between h-14 px-4 bg-purple-50'
								onClick={ () => setOpenMobileMenu(prev => !prev) }
							>
								<div className='flex items-center gap-2'>
									{ activeMobileMenu?.icon && (
										<div className='relative overflow-hidden w-5 h-5 flex-shrink-0'>
											<Image
												src={ activeMobileMenu?.icon?.filled }
												alt={ activeMobileMenu?.label ?? '' }
												fill
												sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
											/>
										</div>
									) }
									<span className='text-sm font-bold text-gray-800'>
										{ activeMobileMenu?.label }
									</span>
								</div>

								<ChevronDown
									className={ cn(
										'flex-shrink-0 w-6 h-6 text-gray-900 transition-transform ease-out duration-300',
										openMobileMenu ? 'rotate-180' : 'rotate-0'
									) }
								/>
							</button>

							<motion.ul
								initial={ wrapperVariants.closed }
								variants={ wrapperVariants }
								style={ { originY: 'top', translateX: '-50%' } }
								className='px-4 pb-4 bg-white rounded-b-2xl absolute top-[56px] left-[50%] w-full overflow-hidden'
							>
								<motion.li variants={ itemVariants }>
									{ renderMenuList() }
								</motion.li>
							</motion.ul>
						</motion.div>
					</div>
				</div>

				<AnimatePresence mode='wait'>
					{ openMobileMenu && (
						<motion.div
							variants={ opacityVariants }
							initial='initial'
							animate='open'
							exit='initial'
							className='fixed inset-0 z-50 bg-black/20'
						/>
					) }
				</AnimatePresence>
			</>
		);
	};

	const renderDesktopSidebar = () => {
		return (
			<motion.div
				className='fixed h-screen p-2.5 flex justify-between flex-col gap-2.5 bg-white max-lg:hidden'
				style={ { width: toggleCollapse ? 75 : 250 } }
			>
				<div className='flex flex-col gap-y-7'>
					<div className='flex items-center justify-between relative h-[48px]'>
						<div
							className={ cn('flex items-center pl-1 gap-4', {
								['block']: !toggleCollapse,
								['hidden']: toggleCollapse,
							}) }
						>
							{ renderLogo() }
						</div>

						<button
							className={ cn(
								'p-4 absolute hover:bg-purple-50 rounded-2.5 transition-transform duration-200 ease-out',
								!toggleCollapse && 'right-0',
								toggleCollapse ? 'rotate-180' : 'rotate-0'
							) }
							onClick={ handleSidebarToggle }
						>
							<ChevronsLeft className='w-8 h-8 text-gray-400' />
						</button>
					</div>

					{ renderMenuList() }
				</div>

				{ session?.status === 'authenticated' && renderDropdownProfileUser(10) }
			</motion.div>
		);
	};

	return (
		<>
			{ renderDesktopSidebar() }
			{ renderMobileNavbar() }
		</>
	);
};

export default LayoutDashboardSidebar;
