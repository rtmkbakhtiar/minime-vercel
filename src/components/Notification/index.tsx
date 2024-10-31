import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

const NOTIFICATION_TTL = 5000;

type NotificationProps = {
	children: React.ReactNode;
	className?: string;
	removeNotif: () => void;
	duration?: number;
};

const Notification: React.FC<NotificationProps> = ({
	children,
	duration = NOTIFICATION_TTL,
	removeNotif,
	className
}) => {
	useEffect(() => {
		const timeoutRef = setTimeout(() => {
			removeNotif();
		}, duration);

		return () => clearTimeout(timeoutRef);
	}, []);

	return (
		<motion.div
			layout
			initial={ { y: 15, scale: 0.9, opacity: 0 } }
			animate={ { y: 0, scale: 1, opacity: 1 } }
			exit={ { y: -25, scale: 0.9, opacity: 0 } }
			transition={ { type: 'spring' } }
			className={ cn(
				'bg-white shadow-lg absolute z-50',
				className
			) }
		>
			{ children }
		</motion.div>
	);
};

export default Notification;