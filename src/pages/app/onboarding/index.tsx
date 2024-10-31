import { useState } from 'react';
import { FormikProps, useFormik } from 'formik';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth/next';
import ArrowLeft from 'public/images/icons/arrow-left.svg';

import { Input, LayoutHome, Textarea } from '@/components';
import images from '@/constant/data/images';
import { handleCatchError } from '@/helpers/handleError';
import useApiClient from '@/hooks/useApiClient';
import { CreateBotReqStatus } from '@/interfaces';
import { USER_DASHBOARD_ROUTE } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { CreateBotRequest } from '@/openapi';

import { authOptions } from '../../api/auth/[...nextauth]';

const ConfettiScreen = dynamic(
	() => import('../../../components/ConfettiScreen'),
	{ ssr: false }
);

const describes = [
	{
		id: '1',
		name: 'Creator',
	},
	{
		id: '2',
		name: 'Influencer',
	},
	{
		id: '3',
		name: 'Coach',
	},
	{
		id: '4',
		name: 'Mentor',
	},
	{
		id: '5',
		name: 'Student',
	},
	{
		id: '6',
		name: 'Just Exploring',
	},
	{
		id: '7',
		name: 'Other',
	},
];

const details = [
	{
		id: 1,
		name: 'Yes',
	},
	{
		id: 0,
		name: 'No',
	},
	{
		id: 2,
		name: 'Unsure',
	},
];

type BoxRadioOptionProps = React.InputHTMLAttributes<HTMLInputElement> & {
  item: { id: string | number; name: string };
};

const BoxRadioOption: React.FC<BoxRadioOptionProps> = ({
	item,
	checked,
	name,
	...props
}) => {
	return (
		<label
			htmlFor={ item.name }
			className={ cn(
				'flex items-center w-full px-5 py-3 gap-2 border rounded-lg transition-all duration-200 ease-in-out hover:shadow-describes-checked cursor-pointer',
				checked
					? 'border-black-primary shadow-describes-checked'
					: 'border-gray-300'
			) }
		>
			<input
				type='radio'
				name={ name }
				className='peer cursor-pointer w-4 h-4 custom-radio checked:border border'
				id={ item.name }
				checked={ checked }
				{ ...props }
			/>
			<span className='font-bold text-sm lg:text-base text-gray-700'>
				{ item.name }
			</span>
		</label>
	);
};

type OnboardingPageProps = {
  step?: string;
};

const OnboardingPage: NextPage<OnboardingPageProps> = ({ step: stepProps }) => {
	const apiClient = useApiClient();
	const router = useRouter();
	const [showConfetti, setShowConfetti] = useState<boolean>(false);

	const [steps, setSteps] = useState([
		{
			id: 'start',
			name: 'Start',
			complete: stepProps === 'last',
		},
		{
			id: 'details',
			name: 'Details',
			complete: stepProps === 'last',
		},
		{
			id: 'steps',
			name: 'Last Step',
			complete: stepProps === 'last',
		},
	]);
	const [currentStepIdx, setCurrentStepIdx] = useState<number>(
		stepProps === 'last' ? 2 : 0
	);
	const [otherDescribes, setOtherDescribes] = useState<string>('');

	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
	const formik: FormikProps<CreateBotRequest> = useFormik<CreateBotRequest>({
		initialValues: {
			q_best_descibe: '',
			q_bot_desc: '',
			q_is_your_own: 1, // 1=yes, 0=no, 2=unsure
		},
		enableReinitialize: true,
		onSubmit: async(reqForm: CreateBotRequest) => {
			try {
				setLoadingSubmit(true);
				const response = await (
					await apiClient.botsApi()
				).createBot({
					...reqForm,
					q_is_your_own: Number(reqForm.q_is_your_own),
				});

				if (response?.status === 200) {
					handleNextStep();
					router
						.replace(`${router.asPath}?step=last`)
						.then(() => setShowConfetti(true));
				}
			} catch (error) {
				handleCatchError(error);
			} finally {
				setLoadingSubmit(false);
			}
		},
	});

	const handleStepBack = () => {
		if (currentStepIdx === 0) return router.back();
		return setCurrentStepIdx(currentStepIdx - 1);
	};

	const renderNavigationAction = () => {
		return (
			<div className='flex w-full max-lg:flex-col lg:justify-between lg:items-center max-lg:gap-8'>
				{ currentStepIdx < steps.length - 1 ? (
					<button
						onClick={ handleStepBack }
						className='flex-shrink-0 focus:ring-0 focus:outline-none'
					>
						<ArrowLeft className='w-6 h-6 lg:w-8 lg:h-8 text-gray-800' />
					</button>
				) : (
					<div className='w-6 h-6 lg:w-8 lg:h-8 flex' />
				) }
				<div className='flex items-center justify-between w-full gap-2 max-w-[292px] sm:max-w-[401px] mx-auto'>
					{ steps.map((step, stepIdx) => {
						const isCurrentStep = stepIdx === currentStepIdx;
						const isStepCompleted = step.complete;

						return (
							<div
								className='flex items-center gap-2'
								key={ step.id }>
								<div
									className={ cn(
										'rounded-full border-2 w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center relative transition-colors ease-out duration-200',
										isCurrentStep ? 'border-black-primary' : 'border-gray-300',
										isStepCompleted && 'bg-midnight-black'
									) }
								>
									{ isCurrentStep && (
										<div className='absolute-center w-2.5 h-2.5 lg:w-3 lg:h-3 bg-midnight-black rounded-full' />
									) }
									{ isStepCompleted && (
										<div className='absolute-center flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 rounded-full overflow-hidden'>
											<Image
												src={ images.icons.darkCheck }
												alt=''
												fill
												sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
											/>
										</div>
									) }
								</div>
								<span
									className={ cn(
										'text-base',
										isCurrentStep && stepIdx < steps.length - 1 && 'font-bold',
										isCurrentStep || isStepCompleted
											? 'text-gray-800'
											: 'text-gray-500'
									) }
								>
									{ step.name }
								</span>
							</div>
						);
					}) }
				</div>
			</div>
		);
	};

	const handleNextStep = () => {
		// 1. Mark the current step as complete
		const updatedSteps = steps.map((step, stepIdx) => {
			if (
				stepIdx === currentStepIdx ||
        currentStepIdx + 1 === steps.length - 1
			) {
				return {
					...step,
					complete: true,
				};
			}
			return step;
		});
		setSteps(updatedSteps);
		// 2. Update the current step value with the next step id
		setCurrentStepIdx(currentStepIdx + 1);
	};

	const renderQuestion = (question: string) => {
		return (
			<span className='text-base lg:text-lg font-normal text-gray-800'>
				{ question }
			</span>
		);
	};

	const renderStartOptions = () => {
		return (
			<div className='mt-8 lg:mt-[62px] flex flex-col gap-6 lg:gap-8 max-w-[600px] mx-auto w-full'>
				{ renderQuestion('What best describes you?') }
				<div>
					<div className='grid grid-cols-1 w-fit gap-4'>
						{ describes.map((item, index) => {
							return (
								<BoxRadioOption
									key={ `describes-${index}` }
									name='q_best_descibe'
									item={ item }
									id={ item.name }
									checked={ item.name === formik.values.q_best_descibe }
									onChange={ formik.handleChange }
									value={ item.name }
								/>
							);
						}) }
					</div>
					<div
						className={ cn(
							'mt-8',
							formik.values.q_best_descibe?.toLowerCase() === 'other'
								? 'block'
								: 'hidden'
						) }
					>
						<Input
							type='text'
							placeholder='Input other describes'
							className='input-default px-3.5 py-2.5 border rounded-lg text-sm lg:text-base'
							value={ otherDescribes }
							onChange={ e => setOtherDescribes(e.target.value) }
						/>
					</div>
				</div>
				<div>
					<button
						onClick={ () => {
							handleNextStep();
							if (otherDescribes) {
								formik.setFieldValue('q_best_descibe', otherDescribes);
							}
						} }
						disabled={ !formik.values.q_best_descibe && !otherDescribes }
						className='btn-primary-midnight-black px-[39px] lg:px-[46px] py-2.5 lg:py-3 rounded-32px text-sm lg:text-base font-bold text-center'
					>
            Next
					</button>
				</div>
			</div>
		);
	};

	const renderDetailOptions = () => {
		return (
			<div className='mt-8 lg:mt-[62px] flex flex-col gap-6 max-w-[600px] mx-auto w-full'>
				{ renderQuestion('Do you want to create your own MiniMe?') }
				<div>
					<div className='grid grid-cols-1 max-w-[157px] gap-4'>
						{ details.map((item, index) => {
							return (
								<BoxRadioOption
									key={ `createBot-${index}` }
									name='q_is_your_own'
									item={ item }
									id={ item.name }
									checked={ item.id === formik.values.q_is_your_own }
									onChange={ e =>
										formik.setFieldValue(
											'q_is_your_own',
											Number(e.target.value)
										) }
									value={ item.id }
								/>
							);
						}) }
					</div>
					<div
						className={ cn(
							'mt-8',
							formik.values.q_is_your_own === CreateBotReqStatus.YES
								? 'flex flex-col gap-6'
								: 'hidden'
						) }
					>
						{ renderQuestion('If yes, how MiniMe can help you?') }
						<Textarea
							id='q_bot_desc'
							name='q_bot_desc'
							value={ formik.values.q_bot_desc }
							onChange={ formik.handleChange }
							placeholder='e.g. MiniMe can help me scale my coaching business'
							className='input-default text-sm lg:text-base font-normal !h-[180px] px-3.5 py-2.5 rounded-lg'
							autoSize={ false }
						/>
					</div>
					<div className='mt-6 lg:mt-8'>
						<button
							onClick={ () => formik.handleSubmit() }
							disabled={
								loadingSubmit || formik.values.q_is_your_own === undefined
							}
							className='btn-primary-midnight-black px-[31.5px] lg:px-[37.5px] py-2.5 lg:py-3 rounded-32px text-sm lg:text-base font-bold text-center'
						>
              Submit
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderSuccessState = () => {
		return (
			<div className='mt-[88px] lg:mt-[62px] flex flex-col gap-[32px] items-center text-center'>
				<div className='w-[82px] h-[82px] relative'>
					<Image
						src={ images.icons.confetti }
						alt=''
						fill
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					/>
				</div>
				<div className='flex flex-col gap-4'>
					<h3 className='text-lg leading-[23px] lg:text-3xl lg:leading-[38px] font-bold text-gray-800'>
            Thank You
					</h3>
					<div className='font-normal text-sm lg:text-lg text-gray-500'>
            You&apos;re on the waitlist! <br className='max-lg:hidden' />
            We&apos;ll review your application and email you once it is
            approved.
					</div>
				</div>
				<div className='flex'>
					<Link
						href={ USER_DASHBOARD_ROUTE }
						className='btn-primary-midnight-black px-4 lg:px-5 py-2.5 lg:py-3 rounded-32px text-sm lg:text-base font-bold text-center'
					>
            Go to Dashboard
					</Link>
				</div>
			</div>
		);
	};

	const renderContentCurrentStep = () => {
		if (currentStepIdx === 0) return renderStartOptions();
		if (currentStepIdx === 1) return renderDetailOptions();
		return renderSuccessState();
	};

	return (
		<LayoutHome
			navbarProps={ { withDropdownProfile: false } }
			className='bg-white min-h-screen'
		>
			<div className='overflow-hidden w-full h-full'>
				<div className='flex flex-col container-center py-8 lg:py-[62px]'>
					{ renderNavigationAction() }
					{ renderContentCurrentStep() }
				</div>
				{ showConfetti && (
					<ConfettiScreen
						numberOfPieces={ 500 }
						recycle={ false }
						onConfettiComplete={ confetti => {
							setShowConfetti(false);
							if (confetti) confetti.reset();
						} }
					/>
				) }
			</div>
		</LayoutHome>
	);
};

export default OnboardingPage;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await getServerSession(ctx.req, ctx.res, authOptions);

	if (!session?.token) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			step: ctx?.query?.step || '',
		},
	};
};
