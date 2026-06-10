import axios from 'axios';

const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
    }

    if (typeof window === 'undefined') {
        return 'http://localhost:5000/api';
    }

    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
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
