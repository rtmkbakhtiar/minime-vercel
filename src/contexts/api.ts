import React from 'react';

import type { Api } from '../lib/api';

export const ApiContext = React.createContext<Api | undefined>(undefined);