import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import X from 'public/images/icons/x.svg';

import Notification from '../Notification';

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type NotifState = {
	type: string;
	message: string;
} | null;

const CopyToClipboard: React.FC<ButtonProps & { text: string; onSuccess?: () => void; }> = ({
	children,
	text,
	onSuccess,
	...buttonProps
}) => {
	const [notification, setNotification] = useState<NotifState>(null);

	const handleSuccess = () => {
		if (onSuccess) return onSuccess();

		setNotification({
			type: 'success',
			message: 'Successfully copied'
		});
	};

	const handleError = () => {
		setNotification({
			type: 'error',
			message: 'Sorry, unable to copy'
		});
	};

	const removeNotif = () => setNotification(null);

	const fallbackCopyTextToClipboard = () => {
		const textArea = document.createElement('textarea');
		textArea.value = text;

		// Avoid scrolling to bottom
		textArea.style.top = '0';
		textArea.style.left = '0';
		textArea.style.position = 'fixed';

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			const successful = document.execCommand('copy');

			if (successful) {
				handleSuccess();
			} else {
				handleError();
			}
		} catch (err) {
			handleError();
		}

		document.body.removeChild(textArea);
	};

	const handleCopyLink = () => {
		if (!navigator.clipboard) {
			fallbackCopyTextToClipboard();
			return;
		}

		navigator.clipboard.writeText(text).then(handleSuccess, handleError);
	};

	return (
		<div className='relative'>
			<AnimatePresence>
				{ notification && (
					<Notification
						removeNotif={ removeNotif }
						key={ notification.type }
						className='bottom-full py-2 px-3 rounded-lg text-sm font-medium text-gray-800 bg-purple-50'
					>
						<span className='flex gap-6'>
							{ notification.message }

							<button
								onClick={ removeNotif }
								className='focus:ring-0 focus:outline-none'>
								<X className='w-4 h-4 text-gray-400' />
							</button>
						</span>
					</Notification>
				) }
			</AnimatePresence>
			<button
				{ ...buttonProps }
				onClick={ handleCopyLink }
			>
				{ children }
			</button>
		</div>
	);
};

export default CopyToClipboard;
