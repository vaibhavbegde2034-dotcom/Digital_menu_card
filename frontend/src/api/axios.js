import axios from 'axios';

const getApiBaseUrl = () => {
    return 'https://digital-menu-card-8la9.onrender.com/api';
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
export { getApiBaseUrl };
