import React, { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FormikErrors, FormikProps, useFormik } from 'formik';
import _debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

import groupingMessages from '@/helpers/groupingMessages';
import { handleCatchError } from '@/helpers/handleError';
import { getUrlParamAsObject, scrollToElement } from '@/helpers/misc';
import screens from '@/helpers/screens';
import { toastify } from '@/helpers/toast';
import useApiClient from '@/hooks/useApiClient';
import useCentrifugo from '@/hooks/useCentrifugo';
import usePreventOverScrolling from '@/hooks/usePreventOverScrolling';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { PaginationState } from '@/interfaces';
import { cn, extractFirstUrlFromString, linkify } from '@/lib/utils';
import {
	BotResp,
	CheckUserSubscriptionResp,
	InitConvResp,
	MsgResp,
} from '@/openapi';
import { ChatSchema } from '@/validator/chat';

import SendFilled from '../../../public/images/icons/send-filled.svg';
import Bubble from '../Bubble';
import { ScrollArea } from '../ScrollArea';
import { Textarea } from '../TextArea';

import type { BannerTypes } from './Banner';
import {
	getCheckSubscription,
	handleConvertChatHistory,
	handleConvertNewAnswer,
	handleOpenGraphScrapping,
} from './helpers';
import Jumbotron from './Jumbotron';

const BarLoader = dynamic(() => import('../Loader/Bar'), { ssr: false });
const ScrollToBottom = dynamic(() => import('../ScrollToBottom'), {
	ssr: false,
});
const Banner = dynamic(() => import('./Banner'), { ssr: false });
const DialogSignIn = dynamic(() => import('./DialogSignIn'), { ssr: false });
const DialogFeedbackForm = dynamic(() => import('./DialogFeedbackForm'), {
	ssr: false,
});
const DialogCallbackPayment = dynamic(() => import('./DialogCallbackPayment'), {
	ssr: false,
});
const OpenGraphPreview = dynamic(() => import('../OpenGraphPreview'), {
	ssr: false,
});

const setBotInitMessage = (welcomeMsg?: string) => ({
	role: 'bot',
	content: welcomeMsg || 'Tell me, how can I help?',
});

type TempOpenGraphInputState = OgObject & {
  show: boolean;
  url?: string;
};

type ChatContainerProps = {
  botData: BotResp;
  conversationConfig: InitConvResp;
};

const ChatContainer: React.FC<ChatContainerProps> = ({
	botData,
	conversationConfig,
}) => {
	const apiClient = useApiClient();

	const [messages, setMessages] = useState<ChatItem[]>(
		!conversationConfig?.conv_code
			? [setBotInitMessage(botData.welcome_msg)]
			: []
	);
	const [newMessage, setNewMessage] = useState<ChatItem | null>(null);

	const [openModalSignIn, setOpenModalSignIn] = useState<boolean>(false);
	const [openModalFeedbackForm, setOpenModalFeedbackForm] =
    useState<boolean>(false);
	const [showScrollToBottom, setShowScrollToBottom] = useState<boolean>(false);

	const [selectedFeedbackMsgCode, setSelectedFeedbackMsgCode] = useState<
    string[]
  >([]);

	const [loadingGetChats, setLoadingGetChats] = useState<boolean>(false);
	const [hasMoreDataChats, setHasMoreDataChats] = useState<boolean>(false);

	const [bannerType, setBannerType] = useState<BannerTypes | null>(null);
	const [activeSubscriptionPackage, setActiveSubscriptionPackage] =
    useState<CheckUserSubscriptionResp | null>(null);

	const [pagination, setPagination] = useState<PaginationState>({
		prev: '',
		next: '',
		pageIndex: 0,
	});

	const [tempOpenGraphInput, setTempOpenGraphInput] = useState<
    TempOpenGraphInputState | undefined
  >(undefined);
	const [loadingTempOpenGraphInput, setLoadingTempOpenGraphInput] =
    useState<boolean>(false);

	const { ref: firstElementChatRef, inView: firstElementChatInView } =
    useInView({ threshold: 1 });
	const scrollAreaRef = usePreventOverScrolling();
	const { width, height } = useWindowDimensions();
	const isMobile = width < screens.lg;
	const session = useSession();
	const isAuth = session?.status === 'authenticated';

	const handlePostMessage = async(
		form: FormChatData,
		formik: FormikProps<FormChatData>
	) => {
		const input = form.question;

		try {
			if (input) {
				if (!isAuth) {
					return setOpenModalSignIn(true);
				}

				const currentBannerType = await getCheckSubscription(
					activeSubscriptionPackage,
					messages
				);
				if (currentBannerType) {
					return setBannerType(currentBannerType);
				}

				const updatedInput = linkify(input);

				await setMessages(prevMessage => [
					...prevMessage.filter(msg => !(msg.role === 'user' && msg.loading)),
					{
						role: 'user',
						content: updatedInput,
						openGraph: tempOpenGraphInput,
						url: tempOpenGraphInput?.url,
					},
					{ role: 'bot', content: '', loading: true }, // loading fetch data
				]);

				scrollToBottomOfPage();
				formik.resetForm();
				setTempOpenGraphInput(undefined);

				const response = await (
					await apiClient.conversationApi()
				).submitChat(botData.code ?? '', conversationConfig.conv_code ?? '', {
					content: input,
					content_type: 'text',
				});

				if (response.status === 200) {
					setMessages(prevMessage => [
						...prevMessage
							.filter(msg => !(msg.role === 'bot' && msg.loading === true))
							.map(msg => {
								if (msg.role === 'user' && msg.loading === true) {
									return { ...msg, loading: false };
								}
								return msg;
							}),
						{
							role: 'bot',
							content: '',
							loading: true,
						},
					]);

					setTimeout(() => {
						scrollToBottomOfPage();
					}, 250);
				}
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setMessages(prevMessage => [
				...prevMessage.map(msg => {
					if (msg.role === 'user' && msg.loading) {
						return { ...msg, loading: false };
					}
					return msg;
				}),
				{
					role: 'bot',
					content:
            'Sorry, it seems something wrong has happened. Please try again in a few minutes.',
				},
			]);
			const errorMsg = error?.response?.data?.errorMessage ?? error?.message;
			return toastify('error', errorMsg);
		}
	};

	const formik: FormikProps<FormChatData> = useFormik<FormChatData>({
		validationSchema: ChatSchema,
		initialValues: {
			question: '',
		},
		enableReinitialize: true,
		onSubmit: async(values: FormChatData) => {
			handlePostMessage(values, formik);
		},
	});

	const scrollToBottomOfPage = (behavior?: ScrollBehavior) => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTo({
				top: scrollAreaRef.current.scrollHeight,
				behavior: behavior || 'smooth',
			});

			setNewMessage(null);
		}
	};

	useEffect(() => {
		// Scroll to the bottom when receive new message from centrifugo & not scrolling up
		if (!showScrollToBottom && newMessage) {
			scrollToBottomOfPage();
		}
	}, [newMessage?.msg_code, showScrollToBottom]);

	useEffect(() => {
		// Scroll to the bottom on the first load
		scrollToBottomOfPage();
	}, []);

	useEffect(() => {
		const element = scrollAreaRef?.current;

		if (element) {
			const handleVisible = () => {
				const scrolledToTop =
          Math.abs(
          	element.scrollHeight - (element.scrollTop + element.clientHeight)
          ) > 300;

				setShowScrollToBottom(scrolledToTop);
			};

			element.addEventListener('scroll', handleVisible);

			return () => {
				element.removeEventListener('scroll', handleVisible);
			};
		}
	}, [scrollAreaRef?.current]);

	useCentrifugo<MsgResp>(
		process.env.NEXT_PUBLIC_BASE_URL_SSE,
		{
			token: conversationConfig.cent_token || '',
			channel: conversationConfig.conv_code || '',
		},
		async message => {
			const currentNewMessage: ChatItem = {
				role: 'bot',
				content: message.content,
				msg_code: message.msg_code,
				rating: 0,
			};

			await handleConvertNewAnswer(
				setMessages,
				currentNewMessage,
				scrollToBottomOfPage
			);

			setNewMessage(currentNewMessage);
		}
	);

	const processMapDataMessages = async(mapDataMessages: ChatItem[]) => {
		const finalMessages: ChatItem[] = [];

		for (const chatItem of mapDataMessages) {
			const processedMessages = await handleConvertChatHistory(chatItem);

			finalMessages.push(...processedMessages);
		}

		return finalMessages;
	};

	const getListChatHistory = async() => {
		try {
			setLoadingGetChats(true);

			const nextUrl = pagination.next;
			const nextParam = getUrlParamAsObject(nextUrl ?? '')?.next;
			const response = await (
				await apiClient.conversationApi()
			).getConversationDetail(
				botData?.code ?? '',
				conversationConfig?.conv_code ?? '',
				20,
				nextParam,
				undefined,
				'desc'
			);

			if (pagination.pageIndex > 0 && messages[0]?.msg_code) {
				// scroll to the current first message
				scrollToElement(messages[0]?.msg_code);
			}

			const responseDataMessages = response?.data?.data?.messages;
			const mapDataMessages: ChatItem[] = (
				responseDataMessages?.data || []
			)?.map(conv => ({
				role: conv.sender_type === 'bot' ? 'bot' : 'user',
				content: conv.content,
				msg_code: conv.msg_code,
				rating: conv.rating,
			}));

			// process to get opengraph if link exists
			const finalMapDataMessages = await processMapDataMessages(
				mapDataMessages
			);

			const currentDataMessages = [...finalMapDataMessages].reverse();
			const updatedDataChats = [...currentDataMessages, ...messages];
			const totalMessages =
        responseDataMessages?.pagination?.total_messages || 0;

			const hasNextPage =
        !!currentDataMessages.length &&
        updatedDataChats?.length < totalMessages;

			if (
				pagination.pageIndex === 0 &&
        !currentDataMessages.length &&
        totalMessages === 0
			) {
				// If history conv is empty, init data with welcome message
				setMessages([setBotInitMessage(botData.welcome_msg)]);
			} else if (!hasNextPage) {
				setMessages([
					setBotInitMessage(botData.welcome_msg),
					...updatedDataChats,
				]);
			} else {
				setMessages(updatedDataChats);
			}

			setTimeout(() => {
				if (pagination.pageIndex === 0) {
					scrollToBottomOfPage('instant');
				}

				setHasMoreDataChats(hasNextPage);
				setPagination(prevPagination => ({
					...prevPagination,
					prev: responseDataMessages?.pagination?.prev,
					next: responseDataMessages?.pagination?.next,
				}));
			}, 500);
		} catch (error) {
			handleCatchError(error);
		} finally {
			setTimeout(() => {
				// use settimeout to make sure everything is done
				setLoadingGetChats(false);
			}, 1000);
		}
	};

	const getSubscriptionPackage = async() => {
		try {
			const response = await (
				await apiClient.subscriptionApi()
			).checkUserSubscriptionDetail(
				botData?.code ?? '',
				conversationConfig?.conv_code ?? ''
			);

			const data = response?.data?.data;

			if (data) {
				setActiveSubscriptionPackage(data);
			}
		} catch (error) {
			// handleCatchError(error)
		}
	};

	useEffect(() => {
		if (conversationConfig?.conv_code && session?.status === 'authenticated') {
			getListChatHistory();
		}
	}, [pagination.pageIndex, conversationConfig?.conv_code, session?.status]);

	useEffect(() => {
		if (conversationConfig?.conv_code && session?.status === 'authenticated') {
			getSubscriptionPackage();
		}
	}, [conversationConfig?.conv_code, session?.status]);

	useEffect(() => {
		setTimeout(() => {
			const currentBannerType = getCheckSubscription(
				activeSubscriptionPackage,
				messages
			);

			if (currentBannerType) {
				setBannerType(currentBannerType);
			}
		}, 1000);
	}, [messages?.length, activeSubscriptionPackage]);

	useEffect(() => {
		const handleFirstElementChatInView = () => {
			if (
				loadingGetChats ||
        !conversationConfig?.conv_code ||
        session?.status !== 'authenticated'
			)
				return;

			if (firstElementChatInView && hasMoreDataChats) {
				setPagination(prevPagination => ({
					...prevPagination,
					pageIndex: prevPagination.pageIndex + 1,
				}));
			}
		};

		handleFirstElementChatInView();
	}, [
		loadingGetChats,
		hasMoreDataChats,
		firstElementChatInView,
		conversationConfig?.conv_code,
		session?.status,
	]);

	const handleValidateFormAndSubmit = () => {
		formik.validateForm().then((errors: FormikErrors<FormChatData>) => {
			if (!Object.keys(errors).length) {
				formik.handleSubmit();
			} else if (errors.question) {
				toastify('error', errors.question);
			}
		});
	};

	const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key !== 'Enter' || e.shiftKey) return;
		
		e.preventDefault();
		if (!messages?.some(msg => msg.role === 'bot' && msg.loading)) {
		  handleValidateFormAndSubmit();
		}
	};

	const handleDebounceFn = async(currentValue: string) => {
		setLoadingTempOpenGraphInput(true);

		const firstUrl = extractFirstUrlFromString(currentValue);
		const openGraphResult = await handleOpenGraphScrapping(firstUrl);

		if (openGraphResult) {
			setTempOpenGraphInput({ ...openGraphResult, show: true, url: firstUrl });
		} else {
			setTempOpenGraphInput(undefined);
		}

		setLoadingTempOpenGraphInput(false);
	};

	const debounceFn = useCallback(_debounce(handleDebounceFn, 1000), []);

	const handleInputMessageChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		formik.handleChange(event);
		debounceFn(event.target.value);
	};

	const handleOpenFeedbackForm = (open: boolean, msgCode?: string[]) => {
		setOpenModalFeedbackForm(open);
		if (msgCode) {
			setSelectedFeedbackMsgCode(msgCode);
		}
	};

	const renderModalFeedbackForm = () => {
		return (
			<DialogFeedbackForm
				openModalFeedbackForm={ openModalFeedbackForm }
				setOpenModalFeedbackForm={ setOpenModalFeedbackForm }
				botCode={ botData?.code ?? '' }
				conversationCode={ conversationConfig?.conv_code ?? '' }
				selectedFeedbackMsgCode={ selectedFeedbackMsgCode }
				isMobile={ isMobile }
			/>
		);
	};

	const renderOpenGraphPreview = () => {
		
		if (tempOpenGraphInput?.show || loadingTempOpenGraphInput) {
			return (
				<div className='absolute bottom-full w-full -z-10 bg-neutral-background shadow-input-focus rounded-t-2xl pb-9 -mb-5'>
					<OpenGraphPreview
						className='pt-4 pl-4 pr-9'
						loading={ loadingTempOpenGraphInput }
						image={ tempOpenGraphInput?.ogImage?.[0]?.url }
						url={ tempOpenGraphInput?.ogUrl || tempOpenGraphInput?.url }
						title={
							tempOpenGraphInput?.ogTitle ??
              tempOpenGraphInput?.ogUrl ??
              tempOpenGraphInput?.url
						}
						description={ tempOpenGraphInput?.ogDescription }
						closeButton
						onClose={ () =>
							setTempOpenGraphInput(prev => ({
								...prev,
								show: false,
							})) }
					/>
				</div>
			);
		}

		return null;
	};

	const renderConversationList = () => {
		const convList = groupingMessages(messages);

		return (
			<>
				{ convList.map((chat, chatIdx) => {
					const bubbleProps = {
						index: chatIdx,
						chat: chat,
						userData: {
							name: session?.data?.user?.name ?? 'You',
							image: session?.data?.user?.image || null,
						},
						botData: {
							code: botData.code,
							name: botData.name,
							image: botData.avatar,
						},
						rateBotChat: isAuth,
						onOpenFeedbackFormChange: handleOpenFeedbackForm,
						convCode: conversationConfig.conv_code,
					};

					if (chatIdx === 0) {
						return (
							<div key={ `chat-${chatIdx}` }>
								<div
									className='w-full h-4'
									ref={ firstElementChatRef } />
								<div>
									<Bubble { ...bubbleProps } />
								</div>
							</div>
						);
					}

					return (
						<div key={ `chat-${chatIdx}` }>
							<Bubble { ...bubbleProps } />
						</div>
					);
				}) }
			</>
		);
	};

	const renderDialogSignIn = () => {
		return (
			<DialogSignIn
				open={ openModalSignIn }
				setOpen={ setOpenModalSignIn }
				sessionStatus={ session?.status }
			/>
		);
	};

	const setDisabledInput = () => {
		const isBotLoading =
      messages?.findIndex(msg => msg.role === 'bot' && !!msg.loading) > -1;
		return !formik.values.question || isBotLoading;
	};

	return (
		<>
			<div
				className='w-full relative'
				style={
					isMobile
						? { height: height ? height - 70 : 'calc(100vh - 70px)' }
						: { height: height ? height - 80 : 'calc(100vh - 80px)' }
				}
			>
				<ScrollArea
					ref={ scrollAreaRef }
					className='w-full h-full'>
					<Jumbotron
						botData={ botData }
						activeSubscription={ activeSubscriptionPackage }
					/>
					<div className='container-center w-full h-full pb-[180px] lg:pb-[210px] pt-8 lg:pt-[65px]'>
						<div className='w-full lg:px-5 2xl:px-[65px] relative'>
							{ loadingGetChats && (
								<div className='flex items-center justify-center py-2.5'>
									<BarLoader barClassName='w-[3px] h-3 bg-gray-500' />
								</div>
							) }

							{ renderConversationList() }
						</div>
					</div>
				</ScrollArea>
				<div className='absolute bottom-0 pb-5 lg:pb-8 w-full'>
					<div className='container-center w-full'>
						<div className='lg:px-5 2xl:px-[65px] w-full'>
							<div className='relative'>
								<ScrollToBottom
									show={ showScrollToBottom }
									onClickScrollToBottom={ () => scrollToBottomOfPage() }
								>
									{ newMessage ? (
										<div className='absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500' />
									) : null }
								</ScrollToBottom>
							</div>
						</div>
					</div>
				</div>
				<div className='absolute z-20 bottom-0 pb-5 lg:pb-8 w-full bg-neutral-white'>
					{ bannerType && <Banner
						type={ bannerType }
						botData={ botData } /> }
					<div className='container-center w-full'>
						<div className='lg:px-5 2xl:px-[65px] w-full'>
							<div className='w-full flex flex-col gap-y-4 sm:gap-y-[26px]'>
								<form
									onSubmit={ (e: React.FormEvent<HTMLFormElement>) => {
										e.preventDefault();
										handleValidateFormAndSubmit();
									} }
									className='flex flex-col w-full pointer-events-auto'
								>
									<div className='relative w-full'>
										{ renderOpenGraphPreview() }

										<Textarea
											id='question'
											name='question'
											placeholder={ `Message ${botData.name}` }
											value={ formik.values.question }
											onChange={ handleInputMessageChange }
											className='input-default block rounded-32px max-h-20 min-h-[40px] lg:min-h-[58px] pl-6 pr-12 lg:pr-[66px] py-[11px] lg:py-[17px] text-xs lg:text-base'
											rows={ 1 }
											onKeyDown={ onEnterPress }
											defaultHeight={ isMobile ? '40px' : '58px' }
										/>

										<button
											type='submit'
											disabled={ setDisabledInput() }
											className={ cn(
												'focus:outline-none focus:ring-0 btn-primary-midnight-black rounded-full w-6 h-6 lg:w-42px lg:h-42px flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-4'
											) }
										>
											<SendFilled className='w-2.5 h-2.5 lg:w-18px lg:h-18px flex-shrink-0 text-white' />
										</button>
									</div>
								</form>
							</div>
							<p className='text-gray-500 text-xs lg:text-sm font-medium mt-6 text-center'>
                Remember MiniMe can make mistakes. Please tell us if you think
                something is not right!
							</p>
						</div>
					</div>
				</div>
			</div>

			{ renderDialogSignIn() }
			{ renderModalFeedbackForm() }
			<DialogCallbackPayment />
		</>
	);
};

export default ChatContainer;
