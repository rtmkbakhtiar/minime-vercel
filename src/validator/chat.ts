import * as yup from 'yup';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const ChatSchema = yup.object().shape({
	// imageFile: yup
	// 	.mixed()
	// 	.nullable()
	// 	.required('Please upload a picture')
	// 	.test('type', 'This file type is invalid or unsupported', (value: any) => {
	// 		return !value || (value && (/^image\//.test(value?.type)));
	// 	})
	// 	.test('fileSize', 'Your image is larger than 5MB', (value: any) => {
	// 		return !value || (value && value?.size / 1024 / 1024 <= 5);
	// 	})
	// 	.label('Image'),
	question: yup.string().label('Question')
		.required('Please insert question')
});