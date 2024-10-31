import * as yup from 'yup';

export const SigninAdminSchema = yup.object().shape({
	email: yup.string().email()
		.required()
		.label('Email'),
	password: yup.string()
		.required()
		.label('Password'),
});
