import { useEffect, useState } from 'react';
import {
	differenceInSeconds,
	format,
	intervalToDuration,
	isPast,
} from 'date-fns';

import formatDuration from '@/helpers/formatDuration';

const ONE_DAY_SECONDS = 86400;
const ONE_HOUR_SECONDS = 3600;

const useRemaing = (endTime?: string) => {
	const [formattedRemaining, setFormattedRemaining] = useState<string>('');
	const [formattedEndTime, setFormattedEndTime] = useState<string>('');
	const [showCountdown, setShowCountdown] = useState<boolean>(false);
	const [hasExpired, setHasExpired] = useState<boolean>(false);

	useEffect(() => {
		if (endTime) {
			const secondsDiff = differenceInSeconds(endTime, new Date());
			const intervalDate = intervalToDuration({
				start: new Date(),
				end: new Date(endTime),
			});
			let formatTime = 'dd MMMM, yyyy';

			if (secondsDiff <= ONE_DAY_SECONDS) {
				if (secondsDiff <= ONE_HOUR_SECONDS) {
					setShowCountdown(true);
					setFormattedRemaining('Less than 1 hour remaining');
				} else {
					formatTime = 'dd MMMM, yyyy, HH:mm';
					setFormattedRemaining(formatDuration(intervalDate));
				}
			} else {
				setFormattedRemaining(formatDuration(intervalDate));
			}

			if (formatTime) {
				setFormattedEndTime(format(new Date(endTime), formatTime));
			}

			setHasExpired(isPast(new Date(endTime)));
		}
	}, [endTime]);

	return { formattedRemaining, formattedEndTime, showCountdown, hasExpired };
};

export default useRemaing;
