export const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) => { // eslint-disable-line no-unused-vars
	return array.reduce((acc, value, index, arr) => {
		(acc[predicate(value, index, arr)] ||= []).push(value);
		return acc;
	}, {} as { [key: string]: T[]; });
};