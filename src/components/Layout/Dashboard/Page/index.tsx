import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import ChevronDown from 'public/images/icons/chevron-down.svg';

import { cn } from '@/lib/utils';

import Sidebar from '../Sidebar';

type LayoutDashboardPageProps = {
	children: ReactNode;
	backNavigation?: boolean;
};

const LayoutDashboardPage: React.FC<LayoutDashboardPageProps> = ({ children, backNavigation }) => {
	const router = useRouter();

	const [toggleCollapse, setToggleCollapse] = useState<boolean>(false);

	const handleToggleSidebar = () => {
		setToggleCollapse(!toggleCollapse);
	};

	return (
		<div className='bg-white h-full flex flex-col lg:flex-row justify-start gap-4 lg:pl-[22px]'>
			<Sidebar
				toggleCollapse={ toggleCollapse }
				handleToggleSidebar={ handleToggleSidebar }
			/>
			<motion.div
				layout
				className={ cn(
					'min-h-screen max-lg:mt-[142px] h-full bg-neutral-background flex-1 max-lg:pb-8 p-4 lg:p-8 lg:rounded-l-3xl rounded-r-none rounded-t-3xl rounded-b-none',
					{
						['lg:ml-[270px]']: !toggleCollapse,
						['lg:ml-[95px]']: toggleCollapse,
					}) }>
				<div className='h-full w-full'>
					{ backNavigation && (
						<button
							className='inline-flex items-center gap-2 mb-8 text-xs lg:text-sm font-bold text-gray-800'
							onClick={ () => router.back() }>
							<ChevronDown className='text-gray-800 flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 rotate-90' />
							Back to Dashboard
						</button>
					) }
					{ children }
				</div>
			</motion.div>
		</div>
	);
};

export default LayoutDashboardPage;