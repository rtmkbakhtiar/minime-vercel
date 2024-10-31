import { toast, ToastOptions, TypeOptions } from 'react-toastify';

import CustomToastContent from '@/components/CustomToastContent';

const defaultConfig: ToastOptions = {
	position: toast.POSITION.TOP_RIGHT,
	hideProgressBar: true,
	draggable: true,
	draggablePercent: 60,
	draggableDirection: 'x',
	autoClose: 4000,
	closeButton: false
};

export const toastify = (type: TypeOptions, message?: string) => {
	toast(
		<CustomToastContent
			type={ type }
			content={ message }
		/>,
		{
			...defaultConfig,
			type: type === 'error' ? 'default' : type
		}
	);
};