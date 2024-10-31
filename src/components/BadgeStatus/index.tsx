import React from 'react';

import { BotStatus } from '@/interfaces';
import { cn } from '@/lib/utils';

type BadgeStatusProps = {
	status?: number;
	className?: string;
	dotClassName?: string;
};

export const convertedStatus: Record<number, string> = {
	0: 'Pending',
	1: 'Active',
	2: 'Inactive'
};

const BadgeStatus: React.FC<BadgeStatusProps> = ({
	status,
	className,
	dotClassName
}) => {
	const renderBadgeStatus = () => {
		return (
			<div className={ cn(
				'capitalize flex items-center justify-center text-center',
				className,
				{
					['bg-orange-100 text-orange-700']: status === BotStatus.PENDING,
					['bg-green-100 text-green-700']: status === BotStatus.ACTIVE,
					['bg-red-100 text-red-700']: status === BotStatus.INACTIVE,
				}
			) }>
				<div className={ cn(
					'rounded-full',
					dotClassName,
					{
						[' bg-orange-500']: status === BotStatus.PENDING,
						[' bg-green-500']: status === BotStatus.ACTIVE,
						[' bg-red-500']: status === BotStatus.INACTIVE,
					}
				) } />
				{ typeof status === 'number' ? convertedStatus[status] : '-' }
			</div>
		);
	};

	return renderBadgeStatus();
};

export default BadgeStatus;