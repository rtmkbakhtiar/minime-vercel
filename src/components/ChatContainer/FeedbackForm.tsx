import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { handleCatchError } from '@/helpers/handleError';
import { toastify } from '@/helpers/toast';
import useApiClient from '@/hooks/useApiClient';

import { Textarea } from '../TextArea';

const SpinnerLoader = dynamic(() => import('../Loader/Spinner'), {
	ssr: false,
});

type FeedbackFormProps = {
  selectedFeedbackMsgCode: string[];
  botCode: string;
  conversationCode: string;
  openModalFeedbackForm: boolean;
  setOpenModalFeedbackForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({
	selectedFeedbackMsgCode,
	botCode,
	conversationCode,
	openModalFeedbackForm,
	setOpenModalFeedbackForm,
}) => {
	const apiClient = useApiClient();

	const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([]);
	const [additionalFeedbackDesc, setAdditionalFeedbackDesc] =
    useState<string>('');
	const [feedbackOptions, setFeedbackOptions] = useState<string[]>([]);
	const [loadingGetFeedbackOptions, setLoadingGetFeedbackOptions] =
    useState<boolean>(false);
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

	useEffect(() => {
		const getFeedbackOptions = async() => {
			try {
				setLoadingGetFeedbackOptions(true);

				const response = await (
					await apiClient.appApi()
				).getAppSetting('feedbacks');

				setFeedbackOptions(response?.data?.data?.feedbacks ?? []);
			} catch (error) {
				handleCatchError(error);
			} finally {
				setLoadingGetFeedbackOptions(false);
			}
		};

		if (openModalFeedbackForm && !feedbackOptions.length) {
			getFeedbackOptions();
		}
	}, [openModalFeedbackForm]);

	const handleCheckboxChange = useCallback((value?: string) => {
		if (value) {
			setSelectedCheckbox(prevSelected =>
				prevSelected.includes(value)
					? prevSelected.filter(item => item !== value)
					: [...prevSelected, value]
			);
		}
	}, []);

	const renderCheckbox = (checkbox: string) => {
		return (
			<label
				htmlFor={ checkbox }
				key={ checkbox }
				className='flex items-start relative control control-checkbox'
			>
				<input
					id={ checkbox }
					aria-describedby={ checkbox }
					name={ checkbox }
					type='checkbox'
					checked={
						selectedCheckbox.findIndex(option => option === checkbox) > -1
					}
					onChange={ () => handleCheckboxChange(checkbox) }
					className='appearance-none absolute top-0.5 left-0 -z-[1] opacity-0'
				/>
				<div className='control_indicator w-4 h-4 lg:w-5 lg:h-5 rounded-md bg-white border border-gray-300 absolute top-0.5 left-0' />

				<div className='ml-6 lg:ml-[32px] text-sm lg:text-base'>
					<span className='text-gray-700'>{ checkbox }</span>
				</div>
			</label>
		);
	};

	const onSubmitFeedbackForm = async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoadingSubmit(true);

		const fetchPromises = [];
		let allSuccessful = true;
		const feedbackCheckboxStr = selectedCheckbox.join(',');

		for (const msgCode of selectedFeedbackMsgCode) {
			const fetchPromise = (async() => {
				try {
					await (
						await apiClient.conversationApi()
					).submitFeedback(botCode, conversationCode, msgCode, {
						feedback: feedbackCheckboxStr,
						feedback_desc: additionalFeedbackDesc,
					});
				} catch (error) {
					allSuccessful = false;
				}
			})();

			fetchPromises.push(fetchPromise);
		}

		// Wait for all fetches to complete
		await Promise.all(fetchPromises);

		setLoadingSubmit(false);

		if (allSuccessful) {
			toastify('success', 'Feedback sent successfully, thank you!');
			setOpenModalFeedbackForm(false);
		} else {
			toastify(
				'error',
				'Sorry, failed to send feedback. Please try again later'
			);
		}
	};

	const onChangeTextAreaFeedbackDesc = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setAdditionalFeedbackDesc(e.target.value);
		},
		[]
	);

	const renderFeedbackForm = () => {
		return (
			<form
				onSubmit={ onSubmitFeedbackForm }
				className='lg:mt-8 flex flex-col w-full'
			>
				{ loadingGetFeedbackOptions ? (
					<div className='flex items-center justify-center h-10'>
						<SpinnerLoader className='w-5 h-5 text-gray-500' />
					</div>
				) : (
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
						{ feedbackOptions.map(renderCheckbox) }
					</div>
				) }
				<div className='mt-8 w-full'>
					<span className='text-gray-800 font-medium text-sm'>
            Additional Details
					</span>
					<div className='mt-1.5'>
						<Textarea
							id='details'
							name='details'
							placeholder='Optional'
							value={ additionalFeedbackDesc }
							onChange={ onChangeTextAreaFeedbackDesc }
							className='block rounded-lg input-default max-h-20 min-h-[47px] py-2.5 px-3.5 text-base'
							rows={ 1 }
							defaultHeight='47px'
						/>
					</div>
				</div>
				<div className='flex justify-end w-full mt-8'>
					<div className='flex items-center gap-6 text-base font-bold'>
						<button
							onClick={ () => setOpenModalFeedbackForm(false) }
							className='py-3 px-5'
						>
              Cancel
						</button>
						<button
							type='submit'
							disabled={ loadingSubmit }
							className='btn-primary-midnight-black rounded-32px py-3 px-5'
						>
              Submit
						</button>
					</div>
				</div>
			</form>
		);
	};

	return renderFeedbackForm();
};

export default FeedbackForm;
