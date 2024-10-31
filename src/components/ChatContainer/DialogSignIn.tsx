import React from 'react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

import images from '@/constant/data/images';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../Dialog';

type DialogSignInProps = {
  sessionStatus?: 'authenticated' | 'loading' | 'unauthenticated';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DialogSignIn: React.FC<DialogSignInProps> = ({
	sessionStatus,
	open,
	setOpen,
}) => {
	const router = useRouter();

	const handleSignInGoogle = async() => {
		if (sessionStatus !== 'authenticated') {
			signIn('google', { callbackUrl: router.asPath });
		}
	};

	return (
		<Dialog
			open={ open }
			onOpenChange={ setOpen }>
			<DialogTrigger className='hidden'>Open</DialogTrigger>
			<DialogContent
				aria-description='sign-in-dialog'
				className='flex flex-col gap-y-6 max-w-[91%] sm:max-w-[343px] lg:max-w-[500px] p-6 lg:p-8 focus:ring-0 focus:outline-none'
			>
				<DialogHeader className='flex justify-center'>
					<VisuallyHidden.Root>
						<DialogTitle>Minime AI</DialogTitle>
					</VisuallyHidden.Root>
					<div className='relative overflow-hidden w-[82px] h-[14.09px]'>
						<Image
							src={ images.logo.minime }
							alt='Minime AI'
							fill
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						/>
					</div>
				</DialogHeader>

				<DialogDescription asChild>
					<p className='text-gray-800 text-sm lg:text-base text-center'>
            To continue chatting, please sign up or log in
					</p>
				</DialogDescription>
				<button
					onClick={ handleSignInGoogle }
					className='focus:ring-0 focus:outline-none w-full rounded-32px btn-primary-midnight-black py-2.5 lg:py-3 px-5 flex items-center justify-center gap-2'
				>
					<div className='relative h-5 w-5'>
						<Image
							src={ images.logo.google }
							alt='MiniMe Sign In with Google'
							fill
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						/>
					</div>
					<span className='text-white text-sm lg:text-base font-bold'>
            Sign In with Google
					</span>
				</button>
			</DialogContent>
		</Dialog>
	);
};

export default DialogSignIn;
