import Axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';

import {paths} from "@/config/paths";
import { refreshToken} from "@/lib/auth";
import {useNavigate} from "react-router";
import {RefreshTokenResponse} from "@/types/api";
import {queryConfig} from "@/lib/react-query";
import {useQueryClient} from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query-client";

export const api = Axios.create({
    // @ts-ignore
    baseURL: import.meta.env.VITE_API_URL
});


export const apiLogout = async ()=>{
    await api.post('logout/')
}



api.interceptors.request.use((config) => {
    config.headers.Accept = 'application/json';
    config.withCredentials = true;

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
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (error.request?.responseURL?.includes('/token/refresh/')) {
                return Promise.reject(error);
            }

            console.log(error.request?.responseURL);
            originalRequest._retry = true;
            sessionStorage.removeItem('accessToken');
            console.log(originalRequest);
            try {
                const refreshResponse:RefreshTokenResponse = await refreshToken();
                const newAccessToken = refreshResponse.access;
                sessionStorage.setItem('accessToken', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                const result = await api(originalRequest);
                await queryClient.refetchQueries({});
                return result;

            } catch (refreshError: any) {
                await apiLogout();
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