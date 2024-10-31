import { useContext } from 'react';

import { ApiContext } from '../contexts/api';
import type { Api } from '../lib/api';

const useApiClient = (): Api => {
	const apiClient = useContext(ApiContext);
	if (!apiClient)
		throw new Error('useApiClient must be inside a Provider with a value');

	return apiClient;
};

export default useApiClient;
