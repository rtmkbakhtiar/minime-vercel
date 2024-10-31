import React from 'react';
import dynamic from 'next/dynamic';
import X from 'public/images/icons/x.svg';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../Dialog';
import { Sheet, SheetContent, SheetTrigger } from '../Sheet';

const FeedbackForm = dynamic(() => import('./FeedbackForm'), { ssr: false });

type DialogFeedbackFormProps = {
  openModalFeedbackForm: boolean;
  setOpenModalFeedbackForm: React.Dispatch<React.SetStateAction<boolean>>;
  botCode: string;
  conversationCode: string;
  isMobile?: boolean;
  selectedFeedbackMsgCode: string[];
};

const DialogFeedbackForm: React.FC<DialogFeedbackFormProps> = ({
	openModalFeedbackForm,
	setOpenModalFeedbackForm,
	botCode,
	conversationCode,
	isMobile,
	selectedFeedbackMsgCode,
}) => {
	const renderFeedbackForm = () => {
		return (
			<FeedbackForm
				openModalFeedbackForm={ openModalFeedbackForm }
				setOpenModalFeedbackForm={ setOpenModalFeedbackForm }
				selectedFeedbackMsgCode={ selectedFeedbackMsgCode }
				botCode={ botCode }
				conversationCode={ conversationCode }
			/>
		);
	};

	const renderModalFeedbackForm = () => {
		if (isMobile) {
			return (
				<Sheet
					open={ openModalFeedbackForm }
					onOpenChange={ setOpenModalFeedbackForm }
				>
					<SheetTrigger className='hidden'>Open</SheetTrigger>
					<SheetContent
						side='bottom'
						className='w-full h-full !max-h-[80vh] shadow-general-m rounded-t-[24px]'
					>
						<div className='w-full h-full flex flex-col'>
							<div className='p-6 flex items-center justify-between'>
								<p className='text-base font-bold text-gray-800'>
                  Feedback Form
								</p>
								<button
									onClick={ () => setOpenModalFeedbackForm(false) }
									className='focus:ring-0 focus:outline-none'
								>
									<X className='w-6 h-6 text-gray-300 hover:text-gray-400' />
								</button>
							</div>
							<div className='px-6 pb-8 overflow-y-auto custom-scrollbar'>
								{ renderFeedbackForm() }
							</div>
						</div>
					</SheetContent>
				</Sheet>
			);
		}

		return (
			<Dialog
				open={ openModalFeedbackForm }
				onOpenChange={ setOpenModalFeedbackForm }
			>
				<DialogTrigger className='hidden'>
					<span>Tell us more</span>
				</DialogTrigger>
				<DialogContent className='lg:max-w-[600px] p-8'>
					<DialogHeader className='flex items-center justify-between gap-2'>
						<DialogTitle className='font-bold text-lg text-gray-800'>
              Feedback
						</DialogTitle>
						<DialogClose className='absolute right-8 focus:ring-0 focus:outline-none'>
							<X className='w-6 h-6 text-gray-300 hover:text-gray-400' />
						</DialogClose>
					</DialogHeader>
					<DialogDescription className='hidden'>
            Feedback form
					</DialogDescription>
					{ renderFeedbackForm() }
				</DialogContent>
			</Dialog>
		);
	};

	return renderModalFeedbackForm();
};

export default DialogFeedbackForm;
