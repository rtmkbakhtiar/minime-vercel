import React from 'react';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';
import { Onest } from 'next/font/google';
import Head from 'next/head';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import FaviconApple from 'public/favicon/apple-touch-icon.png';
import FaviconIco from 'public/favicon/favicon.ico';
import Favicon16 from 'public/favicon/favicon-16x16.png';
import Favicon32 from 'public/favicon/favicon-32x32.png';

import SEOConfig from '../../next-seo.config';
import { ApiContext } from '../contexts/api';
import { Api } from '../lib/api';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-spring-bottom-sheet/dist/style.css';

const apiClient = new Api();

const onest = Onest({
	subsets: ['latin'],
	variable: '--font-Onest',
	display: 'swap',
	adjustFontFallback: false
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<React.Fragment>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'
				/>
				<link
					rel='shortcut icon'
					href={ FaviconIco.src } />
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href={ FaviconApple.src } />
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href={ Favicon32.src } />
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href={ Favicon16.src } />

			</Head>
			<Script
				async
				id='google-analytics-gtm'
				src={ `https://www.googletagmanager.com/gtag/js?id=${ process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string }` }
			/>
			<Script
				id='google-analytics'
				strategy='afterInteractive'
			>
				{ `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${ process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string }');
				` }
			</Script>
			<SessionProvider session={ session }>
				<ApiContext.Provider value={ apiClient }>
					<DefaultSeo { ...SEOConfig } />
					<div className={ onest.className }>
						<Component { ...pageProps } />

						<ToastContainer
							toastClassName={ () => 'relative overflow-hidden flex justify-between p-4 sm:p-5 rounded-[20px] mb-3 bg-white border border-[#EFF0F6] cursor-pointer shadow-[0px_2px_16px_rgba(16,12,65,0.08)]' }
							bodyClassName={ () => 'text-sm sm:text-base text-gray-800 p-0 flex flex-1 items-center font-Onest' }
							newestOnTop
						/>
					</div>
				</ApiContext.Provider>
			</SessionProvider>
		</React.Fragment>
	);
}
