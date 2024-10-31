export const degreesToRads = (degrees: number) => {
	return degrees * Math.PI / 180;
};

export const randomRange = (min: number, max: number) => {
	return min + (Math.random() * (max - min));
};

export const randomInt = (min: number, max: number) => {
	return Math.floor(min + (Math.random() * ((max - min) + 1)));
};