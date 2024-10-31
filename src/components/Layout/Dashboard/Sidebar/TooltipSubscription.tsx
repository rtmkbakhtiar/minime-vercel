import React from 'react';
import dynamic from 'next/dynamic';

import {
	Tooltip,
	TooltipArrow,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/Tooltip';
import useRemaining from '@/hooks/useRemaining';
import { cn } from '@/lib/utils';

const Countdown = dynamic(() => import('../../../Countdown'), {
	ssr: false,
});

type TooltipSubscriptionProps = {
  remainingDate: string;
};

const TooltipSubscription: React.FC<TooltipSubscriptionProps> = ({
	remainingDate,
}) => {
	const { formattedRemaining, showCountdown, hasExpired } =
    useRemaining(remainingDate);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span
						className={ cn(
							'text-xxs lg:text-xs font-medium',
							hasExpired ? 'text-red-600' : 'text-blue-600'
						) }
					>
						{ hasExpired ? (
							'Expired'
						) : (
							<>
								{ showCountdown ? (
									<Countdown time={ remainingDate } />
								) : (
									formattedRemaining
								) }
							</>
						) }
					</span>
				</TooltipTrigger>
				<TooltipContent side='right'>
					<TooltipArrow
						fill='#1d2939'
						width={ 12 } />
					<p className='text-white'>Your Package Status</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TooltipSubscription;
