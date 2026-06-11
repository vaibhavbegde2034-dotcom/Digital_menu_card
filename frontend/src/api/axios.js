import axios from 'axios';

const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
    }

    if (typeof window === 'undefined') {
        return 'http://localhost:5000/api';
    }

    // Use current location protocol and hostname but ensure port 5000
    const url = `${window.location.protocol}//${window.location.hostname}:5000/api`;
    console.log('API Base URL:', url);
    return url;
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
