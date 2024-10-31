import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import SpinnerLoader from '@/components/Loader/Spinner';

const ErrorPage: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		if (router?.query?.error) {
			const msgError = (router?.query?.error as string) ?? '';

			Sentry.captureException(new Error(msgError));

			setTimeout(() => {
				router.replace('/').then(() => router.reload());
			}, 3000);
		}
	}, [router?.query?.error]);

	return (
		<div className='h-screen text-center flex flex-col items-center justify-center bg-base'>
			<div>
				<h1 className='border-r border-gray-800 text-gray-800 inline-block mr-5 pr-6 text-2xl font-medium align-top leading-[49px]'>500</h1>
				<div className='inline-block text-left h-[49px]'>
					<h2 className='text-sm font-normal text-gray-800 m-0'>Something went wrong.</h2>
					<span className='text-gray-500 text-sm inline-flex items-center gap-1'><SpinnerLoader className='w-3 h-3' /> Redirecting to homepage...</span>
				</div>
			</div>
		</div>
	);
};

export default ErrorPage;
