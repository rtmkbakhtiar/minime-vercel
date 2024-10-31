import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const getRandomIntInclusive = (minLimit: number, maxLimit: number) => {
	const min = Math.ceil(minLimit);
	const max = Math.floor(maxLimit);
	const randomNum = Math.floor(Math.random() * (max - min + 1) + min);

	return randomNum;
};

export const urlRegex =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

export const extractFirstUrlFromString = (text: string) => {
	return text.match(urlRegex)?.[0];
};

export const linkify = (text: string) => {
	return text.replace(urlRegex, (url: string) => {
		return (
			'<a href="' +
      url +
      '" target="_blank" style="color:blue;text-decoration:underline;">' +
      url +
      '</a>'
		);
	});
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createDummyArray = (length: number, obj?: Record<string, any>) =>
	Array.from(Array(length).keys()).map(() => Object.assign(obj ? obj : {}));
