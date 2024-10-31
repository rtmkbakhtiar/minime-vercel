import axios from 'axios';
import { isPast } from 'date-fns';

import { extractFirstUrlFromString, linkify } from '@/lib/utils';
import { CheckUserSubscriptionResp } from '@/openapi';

export const handleCheckUserMessages = (messages: ChatItem[]) => {
	const maxFreeChat = Number(process.env.NEXT_PUBLIC_MAX_FREE_CHAT);

	if (messages?.length && maxFreeChat) {
		const userMessages = messages.filter(msg => msg.role === 'user');

		return userMessages?.length >= maxFreeChat;
	}
};

export const getCheckSubscription = (
	activeSubscriptionPackage: CheckUserSubscriptionResp | null,
	messages: ChatItem[]
) => {
	if (activeSubscriptionPackage?.subscribe_plan_status) {
		if (activeSubscriptionPackage?.end_time) {
			const hasExpired = isPast(activeSubscriptionPackage.end_time);
			if (hasExpired) {
				return 'expired';
			}
		} else {
			const isUserExceedFreeChat = handleCheckUserMessages(messages);
			if (isUserExceedFreeChat) {
				return 'start-subscription';
			}
		}
	}
};

export const handleOpenGraphScrapping = async(url?: string) => {
	if (!url) return null;

	try {
		const ogResponse = await axios.post<OgObject>('/api/metadata-url', {
			url: url,
		});

		return ogResponse?.data;
	} catch (error) {
		return null;
	}
};

export const handleConvertChatHistory = async(chatItem: ChatItem) => {
	const responseAnswer = (chatItem.content ?? '') as string;
	const splitAnswer = responseAnswer?.split('\n\n');
	const botAnswer = splitAnswer?.filter(answer => !!answer);

	const newMessages: ChatItem[] = [];
	for (let i = 0; i < botAnswer?.length; i++) {
		const answer = botAnswer[i];
		const updatedAnswer = linkify(answer);
		const firstUrl = extractFirstUrlFromString(answer);
		const openGraphResult = await handleOpenGraphScrapping(firstUrl);

		newMessages.push({
			...chatItem,
			content: updatedAnswer,
			openGraph: openGraphResult,
			url: firstUrl,
		});
	}

	return newMessages;
};

export const handleConvertNewAnswer = async(
	setMessages: React.Dispatch<React.SetStateAction<ChatItem[]>>,
	newMessage: ChatItem,
	scrollToBottomOfPage: () => void
) => {
	const responseAnswer = (newMessage.content ?? '') as string;
	const splitAnswer = responseAnswer.split('\n\n');
	const botAnswer = splitAnswer.filter(answer => !!answer);

	// Hapus semua pesan loading yang ada
	setMessages(prevMessages => prevMessages.filter(msg => !msg.loading));

	const convertedMessages: ChatItem[] = [];

	for (let i = 0; i < botAnswer.length; i++) {
		setMessages(prevMessages => [
			...prevMessages,
			{ role: 'bot', content: '', loading: true },
		]);

		// Delay setelah menampilkan loading
		await new Promise(resolve => setTimeout(resolve, 500));

		const answer = botAnswer[i];
		const updatedAnswer = linkify(answer);
		const firstUrl = extractFirstUrlFromString(answer);

		// Lakukan operasi asynchronous
		const openGraphResult = await handleOpenGraphScrapping(firstUrl);

		const processedMessage: ChatItem = {
			...newMessage,
			content: updatedAnswer,
			openGraph: openGraphResult,
			url: firstUrl,
		};

		convertedMessages.push(processedMessage);

		// Perbarui pesan: ganti loading dengan chat yang sudah diproses
		setMessages(prevMessages => [
			...prevMessages.filter(msg => !msg.loading),
			processedMessage,
		]);

		// Delay setelah menampilkan chat
		await new Promise(resolve => setTimeout(resolve, 500));

		scrollToBottomOfPage();
	}

	return convertedMessages;
};
