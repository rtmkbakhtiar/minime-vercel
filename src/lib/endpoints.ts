const baseUrlApi = process.env.NEXT_PUBLIC_BASE_URL_API;

const endpoints: {
  [key: string]: string;
} = {
	authUser: `${baseUrlApi}/v1/auth`,
	authAdmin: `${baseUrlApi}/v1/auth/admin`,
};

export default endpoints;
