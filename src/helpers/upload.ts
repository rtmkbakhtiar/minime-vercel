export const convertToFormData = (formObj: { [key: string]: any; }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
	const formData: FormData = new FormData();

	Object.keys(formObj).forEach((key: string) => {
		formData.append(key, formObj[key]);
	});

	return formData;
};