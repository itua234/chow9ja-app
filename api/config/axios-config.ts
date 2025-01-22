import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const appToken = process.env.EXPO_PUBLIC_APP_TOKEN;
const appToken: string = "c2505e1877c35bff219c55c2820a0300a1fa3fdf33289e3fc5036c8fce2021d2";

const client = axios.create({
    //baseURL: process.env.EXPO_PUBLIC_APP_URL,
    //baseURL: "http://192.168.43.253:8080/api/v1/",
    baseURL: "http://172.20.10.4:8080/api/v1/",
    // baseURL: "http://10.0.2.2:8000/api/v1/",
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

// Define the extended AxiosRequestConfig to include the custom `useAppToken` property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    useAppToken?: boolean;
}

// Add a request interceptor
client.interceptors.request.use(
    async (config: CustomAxiosRequestConfig) => {
        try {
            // Check if the request should use the app token
            if (config.useAppToken && appToken) {
                config.headers = config.headers || {};
                config.headers!.Authorization = `Bearer ${appToken}`;
            } else {
                const userToken = await AsyncStorage.getItem('user_token');
                if (userToken) {
                    config.headers = config.headers || {};
                    config.headers!.Authorization = `Bearer ${userToken}`;
                }
            }
        } catch (error) {
            console.error('Failed to retrieve token from storage:', error);
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

const customRequest = <T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete', 
    url: string, 
    data?: any, 
    useAppToken?: boolean
): Promise<T> => {
    return client.request({
        method,
        url,
        data,
        useAppToken,
    } as CustomAxiosRequestConfig);
};

const customReq = {
    get: <T>(url: string, useAppToken?: boolean, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return client.get<T>(url, { ...config, useAppToken } as CustomAxiosRequestConfig);
    },
    post: <T>(url: string, data?: any, useAppToken?: boolean, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return client.post<T>(url, data, { ...config, useAppToken } as CustomAxiosRequestConfig);
    },
    put: <T>(url: string, data?: any, useAppToken?: boolean, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return client.put<T>(url, data, { ...config, useAppToken } as CustomAxiosRequestConfig);
    },
    delete: <T>(url: string, useAppToken?: boolean, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return client.delete<T>(url, { ...config, useAppToken } as CustomAxiosRequestConfig);
    },
}

export { 
    client, 
    customReq, 
    customRequest,
    CustomAxiosRequestConfig
};