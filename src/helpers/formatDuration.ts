import { Duration } from 'date-fns';

const formatDuration = (duration: Duration): string => {
	const parts: string[] = [];

	if (duration.years) {
		parts.push(`${duration.years} year${duration.years > 1 ? 's' : ''}`);
	}
	if (duration.months) {
		parts.push(`${duration.months} month${duration.months > 1 ? 's' : ''}`);
	}
	if (duration.weeks) {
		parts.push(`${duration.weeks} week${duration.weeks > 1 ? 's' : ''}`);
	}
	if (duration.days) {
		parts.push(`${duration.days} day${duration.days > 1 ? 's' : ''}`);
	}

	return parts.length > 0 ? `${parts.join(' ')} remaining` : 'No duration provided';
};

export default formatDuration;