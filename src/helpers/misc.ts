import { format } from 'date-fns';

export const filterObject = (obj: ObjectKey) => {
	return Object.keys(obj).reduce((acc: ObjectKey, key: string) => {
		if (obj[key]) {
			acc[key] = obj[key];
		}

		return acc;
	}, {});
};

export const displayUserName = (name: string, maxWord = 2) => {
	if (name) {
		return name.split(/\s+/).slice(0, maxWord)
			.join(' ');
	}

	return '';
};

export const getUrlParamAsObject = (url: string) => {
	const searchParams = url.split('?')[1];
	const result: Record<string, string> = {};
	// in case the queryString is empty
	if (searchParams !== undefined) {
		const paramParts = searchParams.split('&');
		for (const part of paramParts) {
			const paramValuePair = part.split('=');
			// exclude the case when the param has no value
			if (paramValuePair.length === 2) {
				result[paramValuePair[0]] = decodeURIComponent(paramValuePair[1]);
			}
		}

	}
	return result;
};

export const scrollToElement = (id: string) => {
	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({ behavior: 'instant' });
	}
};

export const isEmptyObject = (obj: Record<any, any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
	return JSON.stringify(obj) === '{}';
};

export const showDefaultFormattedDate = (date?: string | number | Date) => {
	if (date) {
		return format(new Date(date), 'MMM dd, yyyy');
	}
	return '-';
};

// Function to format the value as currency
export const formatCurrency = (currency: string, value: string): string => {
	const numberValue = parseFloat(value.replace(/[^0-9.]/g, ''));
	if (isNaN(numberValue)) return '';
	
	const formattedNumber = numberValue.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).replace(/,/g, ',');

	return `${currency}${formattedNumber}`;
};