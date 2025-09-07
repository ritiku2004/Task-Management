import axios from 'axios';

const api = axios.create({
    baseURL: 'https://task-management-anmn.onrender.com/api',
});

// Request Interceptor: Attach the token to every request
api.interceptors.request.use((config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo && userInfo.token) {
                    localStorage.removeItem('userInfo');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);



export default api;