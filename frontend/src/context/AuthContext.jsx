import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
    const navigate = useNavigate();

    const getUserData = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/auth/users/me/');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            logout();
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        if (token) {
            getUserData();
        }
    }, [token, getUserData]);

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post('/auth/jwt/create/', {
                email,
                password
            });

            const { access, refresh } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            setToken(access);
            setRefreshToken(refresh);

            await getUserData();
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Ошибка при входе. Проверьте свои данные и попробуйте снова.';

            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = 'Неверный email или пароль';
                } else if (error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                }
            }

            throw new Error(errorMessage);
        }
    };

    const register = async (email, password, re_password) => {
        try {
            await axiosInstance.post('/auth/users/', {
                email,
                password,
                re_password
            });

            await login(email, password);
        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'Ошибка при регистрации';

            if (error.response?.data) {
                if (error.response.data.email) {
                    errorMessage = error.response.data.email[0];
                } else if (error.response.data.password) {
                    errorMessage = error.response.data.password[0];
                } else if (error.response.data.non_field_errors) {
                    errorMessage = error.response.data.non_field_errors[0];
                }
            }

            throw new Error(errorMessage);
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            const response = await axiosInstance.patch('/auth/users/me/', updatedData);
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            login,
            register,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
