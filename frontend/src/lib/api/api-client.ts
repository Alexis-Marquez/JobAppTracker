import Axios, { InternalAxiosRequestConfig } from 'axios';

import {paths} from "@/config/paths";
import { refreshToken} from "@/lib/auth";
import {useNavigate} from "react-router";



function authRequestInterceptor(config: InternalAxiosRequestConfig) {
    if (config.headers) {
        config.headers.Accept = 'application/json';
    }

    config.withCredentials = true;
    return config;
}


export const api = Axios.create({
    // @ts-ignore
    baseURL: import.meta.env.VITE_API_URL
});
api.interceptors.request.use(authRequestInterceptor);
export const apiLogout = async ()=>{
    await api.post('logout/')
}



api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log(error.config);
        if (error.response?.status === 401 && !originalRequest._retry&& !originalRequest.skipAuthRefresh) {
            originalRequest._retry = true;
            sessionStorage.removeItem('accessToken');
            try {
                const refreshResponse = await refreshToken();
                const newAccessToken = refreshResponse.access;
                console.log(newAccessToken);
                sessionStorage.setItem('accessToken', newAccessToken);
                // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // return api(originalRequest);
            } catch (refreshError) {
                console.error(refreshError);
                // If refresh fails force logout
                // await apiLogout();
                sessionStorage.removeItem('accessToken');
                window.location.href = '/login/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: { data: any; }) => {
        return response.data;
    },
    (error: { response: { data: { message: string; }; status: number; }; message: string; }) => {
        const message = error.response?.data?.message || error.message;
        // useNotifications.getState().addNotification({
        //     type: 'error',
        //     title: 'Error',
        //     message,
        // });
        return Promise.reject(error);
    },
);