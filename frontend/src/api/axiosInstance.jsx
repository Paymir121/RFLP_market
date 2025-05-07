import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Укажи нужный адрес

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем интерцептор для автоматического добавления токена
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Добавляем интерцептор для обновления токена при 401 ошибке
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${API_URL}/auth/jwt/refresh/`, { refresh: refreshToken });
                const newAccessToken = response.data.access;

                localStorage.setItem('token', newAccessToken);

                // Обновляем заголовок и пробуем заново
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Перенаправляем на страницу логина
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
