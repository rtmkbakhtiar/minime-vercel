import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import ChevronDown from 'public/images/icons/chevron-down.svg';
import LogOut from 'public/images/icons/log-out.svg';

import images from '@/constant/data/images';
import { displayUserName } from '@/helpers/misc';
import { toastify } from '@/helpers/toast';
import { ADMIN_DASHBOARD_ROUTE, USER_DASHBOARD_ROUTE } from '@/lib/routes';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../DropdownMenu';

const InitialAvatar = dynamic(() => import('../InitialAvatar'), { ssr: false });

export type NavbarProps = {
  withDropdownProfile?: boolean;
  withGoogleSignIn?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({
	withDropdownProfile = true,
	withGoogleSignIn = true,
}) => {
	const session = useSession();
	const router = useRouter();

	const isAuth = session?.status === 'authenticated';

	const onClickLogout = () => {
		signOut({ redirect: false }).then(() => {
			toastify('success', 'You are successfully logged out');
		});
	};

	const handleSignInGoogle = async() => {
		signIn('google', { callbackUrl: router.asPath });
	};

	const renderDropdownProfileUser = () => {
		const dropdownMenuItemClassName =
      'p-2 lg:p-2.5 rounded-md text-sm lg:text-base max-lg:font-medium';

		return (
			<DropdownMenu>
				<DropdownMenuTrigger
					disabled={ !withDropdownProfile }
					className='focus:ring-0 focus:outline-none'
				>
					<div className='flex items-center gap-x-2'>
						{ session?.data?.user?.image ? (
							<div className='relative w-6 h-6 lg:w-8 lg:h-8 rounded-full overflow-hidden'>
								<Image
									src={ session?.data?.user?.image }
									alt=''
									fill
									className='w-full h-full'
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								/>
							</div>
						) : (
							<InitialAvatar
								name={ session?.data?.user?.name ?? 'You' }
								className='w-6 h-6 lg:w-8 lg:h-8'
								defaultColor={ 2 }
							/>
						) }
						<span className='max-lg:hidden text-sm font-medium text-gray-800'>
							{ displayUserName(session?.data?.user?.name ?? '') }
						</span>
						{ withDropdownProfile && (
							<span className='flex-shrink-0 max-lg:hidden'>
								<ChevronDown className='w-5 h-5 text-gray-400' />
							</span>
						) }
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					sideOffset={ 24 }
					align='end'
					className='w-[160px] lg:w-[180px] p-2 lg:p-2.5 rounded-lg'
				>
					<DropdownMenuItem
						asChild
						className={ dropdownMenuItemClassName }>
						<Link
							href={
								session?.data?.user?.role === 'admin'
									? ADMIN_DASHBOARD_ROUTE
									: USER_DASHBOARD_ROUTE
							}
						>
							<span>Dashboard</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						className={ dropdownMenuItemClassName }
						onClick={ onClickLogout }
					>
						<LogOut className='mr-2 w-4 h-4 lg:h-5 lg:w-5 flex-shrink-0' />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	};

	const renderButtonGoogleSignIn = () => {
		if (!withGoogleSignIn) return null;

		return (
			<div className='flex items-center gap-x-2 justify-end'>
				<div>
					{ !isAuth ? (
						<button
							onClick={ handleSignInGoogle }
							className='px-4 py-[10px] rounded-full btn-secondary-gray transition delay-50 '
						>
							<span className='flex h-full gap-x-2 justify-center'>
								<div className='relative h-5 w-5'>
									<Image
										src={ images.logo.google }
										alt='MiniMe Sign In with Google'
										fill
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									/>
								</div>
								<span className='text-gray-700 text-sm font-bold leading-5'>
                  Sign In with Google
								</span>
							</span>
						</button>
					) : (
						renderDropdownProfileUser()
					) }
				</div>
			</div>
		);
	};

	return (
		<header className='bg-neutral-white sticky inset-x-0 top-0 z-[60] h-[70px] lg:h-20 border border-b-gray-300'>
			<nav
				className='w-full h-full'
				aria-label='Global'>
				<div className='flex container-center justify-between items-center h-full w-full'>
					<div className='flex'>
						<button
							onClick={ () => router.push('/').then(() => router.reload()) }
							className='focus:ring-0 focus:outline-none relative overflow-hidden w-[62px] h-[10.66px] lg:w-[82px] lg:h-[14.09px]'
						>
							<Image
								src={ images.logo.minime || '' }
								alt='logo'
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								fill
							/>
						</button>
					</div>
					{ renderButtonGoogleSignIn() }
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
