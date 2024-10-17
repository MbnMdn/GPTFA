import axios from 'axios';

import { ENV } from './settings';

const api = axios.create({
    baseURL: ENV.apiUrl,
    headers: { accept: 'application/json' },
});

export default api;
