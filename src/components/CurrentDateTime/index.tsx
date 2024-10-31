import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function CurrentDateTime() {
	const [time, setTime] = useState(new Date());
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);

		const timer = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	if (isMounted) {
		return (
			<time>{ format(time, 'MMM dd HH:mm') }</time>
		);
	}

	return null;
}