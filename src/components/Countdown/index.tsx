import { useEffect, useRef, useState } from 'react'; // Import React hooks and types
import { differenceInSeconds } from 'date-fns';

type CountdownProps = {
  time: string | Date;
};

const Countdown: React.FC<CountdownProps> = ({ time }) => {
	const [timeLeft, setTimeLeft] = useState<number>(0);
	const [isActive, setIsActive] = useState<boolean>(false);

	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const handleSetDuration = (duration: number): void => {
		if (typeof duration === 'number' && duration > 0) {
			setTimeLeft(duration);

			if (duration > 0) setIsActive(true);
			// Clear any existing timer
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		}
	};

	useEffect(() => {
		const handleCountdown = () => {
			const secondsDiff = differenceInSeconds(new Date(time), new Date());
			const oneDaySeconds = 86400;
			if (secondsDiff <= oneDaySeconds) {
				handleSetDuration(secondsDiff);
			}
		};

		handleCountdown();
	}, [time]);

	// useEffect hook to manage the countdown interval
	useEffect(() => {
		// If the timer is active
		if (isActive) {
			// Set an interval to decrease the time left
			timerRef.current = setInterval(() => {
				setTimeLeft(prevTime => {
					// If time is up, clear the interval
					if (prevTime <= 1) {
						clearInterval(timerRef.current!);
						return 0;
					}
					// Decrease the time left by one second
					return prevTime - 1;
				});
			}, 1000); // Interval of 1 second
		}

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [isActive]);

	const formatTime = (): string => {
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;
		// Return the formatted string
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
			2,
			'0'
		)}`;
	};

	return <span>{ formatTime() }</span>;
};

export default Countdown;
