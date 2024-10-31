import { useState } from 'react';
import { FormikProps, useFormik } from 'formik';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

import images from '@/constant/data/images';
import { toastify } from '@/helpers/toast';
import { ADMIN_DASHBOARD_ROUTE } from '@/lib/routes';
import { AdminLoginReq } from '@/openapi';
import { SigninAdminSchema } from '@/validator/auth';

const SigninAdmin: NextPage = () => {
	const router = useRouter();

	const [enableValidation, setEnableValidation] = useState<boolean>(false);
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
	const formik: FormikProps<AdminLoginReq> = useFormik<AdminLoginReq>({
		validateOnBlur: enableValidation,
		validateOnChange: enableValidation,
		validationSchema: SigninAdminSchema,
		initialValues: {
			email: '',
			password: ''
		},
		enableReinitialize: true,
		onSubmit: async(reqForm: AdminLoginReq) => {
			setLoadingSubmit(true);
			signIn('login_admin', {
				redirect: false,
				...reqForm
			})
				.then(async response => {
					if (response?.ok && !response?.error) {
						router.replace(ADMIN_DASHBOARD_ROUTE);
					} else {
						toastify('error', response?.error || 'It seems something wrong has happened.');
					}
				})
				.finally(() => {
					setLoadingSubmit(false);
				});
		},
	});

	const onSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setEnableValidation(true);
		formik.handleSubmit();
	};

	return (
		<div className='flex min-h-full flex-1 flex-col justify-center py-12 container-center'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center'>
				<div className='relative overflow-hidden w-[82px] h-[14.09px]'>
					<Image
						src={ images.logo.minime }
						alt='Minime AI'
						fill
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					/>
				</div>
				<h2 className='mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
					Sign in to your account
				</h2>
			</div>

			<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
				<div className='bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12'>
					<form
						onSubmit={ onSubmit }
						className='space-y-6'>
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium leading-6 text-gray-900'>
								Email address
							</label>
							<div className='mt-2'>
								<input
									id='email'
									name='email'
									type='email'
									value={ formik.values.email }
									onChange={ formik.handleChange }
									className='block input-default w-full rounded-md py-1.5 text-sm lg:text-base'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium leading-6 text-gray-900'>
								Password
							</label>
							<div className='mt-2'>
								<input
									id='password'
									name='password'
									type='password'
									value={ formik.values.password }
									onChange={ formik.handleChange }
									className='block input-default w-full rounded-md py-1.5 text-sm lg:text-base'
								/>
							</div>
						</div>

						<div>
							<button
								type='submit'
								disabled={ loadingSubmit }
								className='flex w-full justify-center rounded-md btn-primary-midnight-black disabled:opacity-50 px-3 py-1.5 text-sm lg:text-base'
							>
								{ loadingSubmit ? 'Loading...' : 'Sign in' }
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SigninAdmin;