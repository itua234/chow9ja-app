import { useState, useEffect, useCallback } from 'react';
import axios, { 
    AxiosInstance, 
    AxiosError, 
    InternalAxiosRequestConfig,
    AxiosResponse,
    CancelToken
  } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
//import { logger } from 'react-native-logs';

//const log = logger.createLogger();

// request cancellation to avoid unnecessary network requests
const cancelTokenSource = axios.CancelToken.source();

// Uncomment and use environment variables in a real-world scenario
const appToken = process.env.EXPO_PUBLIC_APP_TOKEN;

const client = axios.create({
    baseURL: "http://192.168.43.253:8080/api/v1/",
    //baseURL: "http://172.20.10.4:8080/api/v1/",
    //baseURL: "http://192.168.214.166:8080/api/v1/",
    //baseURL: Platform.OS === 'ios' ? 'http://127.0.0.1:8080/api/v1/' : 'http://10.0.2.2:8080/api/v1/',
    timeout: 10000, // 10 seconds
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    cancelToken: cancelTokenSource.token
});

// Define the extended AxiosRequestConfig to include the custom `useAppToken` property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    useAppToken?: boolean;
}

const refresh_token = async (error: any) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
            try {
                const { data } = await client.post(
                    '/auth/refresh-token', 
                    { refresh_token: refreshToken },
                    { useAppToken: true }as CustomAxiosRequestConfig
                );
                await AsyncStorage.setItem('user_token', data.results.token);
                await AsyncStorage.setItem('refresh_token', data.results.refresh_token);
                originalRequest.headers.Authorization = `Bearer ${data.results.token}`;
                console.log("token has been refreshed");
                return client(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Handle failed refresh (e.g., logout user)
                await AsyncStorage.multiRemove(['user_token', 'refresh_token']);
                // You might want to trigger a navigation to login here or handle logout
            }
        }
    }
}

// Add a request interceptor
client.interceptors.request.use(
    async (config: CustomAxiosRequestConfig) => {
        try {
            // Check if the request should use the app token
            if (config.useAppToken && appToken) {
                config.headers!.Authorization = `Bearer ${appToken}`;
            } else {
                const userToken = await AsyncStorage.getItem('user_token');
                if (userToken) {
                    config.headers!.Authorization = `Bearer ${userToken}`;
                }
            }
        } catch (error) {
            console.log('Request interceptor error:', error);
        }
        //log.info(`Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
//Add a response interceptor to handle errors globally
client.interceptors.response.use(
    //log.info(`Response: ${response.status} ${response.config.url}`);
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (error.response) {
            // Handle specific HTTP error codes
            switch (error.response.status) {
                case 401:
                    console.log('Unauthorized: Redirect to login');
                    await refresh_token(error);
                    break;
                case 404:
                    console.log('Resource not found');
                    break;
                case 500:
                    console.log('Server error');
                    break;
                case 422:
                    console.log('Validation error:', error.response.data);
                    break;
                default:
                    console.log('An error occurred:', {
                        message: error.message,
                        status: error.response.status,
                        data: error.response.data,
                    });
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.log('No response received:', error.request);
        } else {
            // Something happened in setting up the request
            console.log('Request setup error:', error.message);
        }
        // Propagate the error to the .catch() block of the request
        return Promise.reject(error);
    }
);

const customRequest = <T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', 
    url: string, 
    data?: any, 
    useAppToken?: boolean
): Promise<T> => {
    return client.request({
        method,
        url,
        data,
        useAppToken
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