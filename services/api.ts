import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
//import { logger } from 'react-native-logs';

//const log = logger.createLogger();

// request cancellation to avoid unnecessary network requests
//const source = axios.CancelToken.source();

//const LOCALHOST = Platform.OS === 'ios' ? 'http://127.0.0.1:8000' : 'http://10.0.2.2:8000';
//export const API_BASE_URL = LOCALHOST + '/api/v1/';

// Uncomment and use environment variables in a real-world scenario
const appToken = process.env.EXPO_PUBLIC_APP_TOKEN;

const client = axios.create({
    //baseURL: "http://192.168.43.253:8080/api/v1/",
    //baseURL: "http://172.20.10.4:8080/api/v1/",
    baseURL: "http://192.168.214.166:8080/api/v1/",
    //baseURL: Platform.OS === 'ios' ? 'http://127.0.0.1:8080/api/v1/' : 'http://10.0.2.2:8080/api/v1/',
    timeout: 10000, // 10 seconds
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
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
                const { data } = await client.post('/auth/refresh-token', { refreshToken });
                await AsyncStorage.setItem('user_token', data.token);
                originalRequest.headers.Authorization = `Bearer ${data.token}`;
                return client(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Redirect to login or handle logout
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
    (error: AxiosError) => {
        //await refresh_token(error);
        if (error.response) {
            // Handle specific HTTP error codes
            switch (error.response.status) {
                case 401:
                    console.log('Unauthorized: Redirect to login');
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

// Auth API functions
export const register = (inputs: { [key: string]: string }) => {
    return client.post(
        "auth/signup", 
        inputs, 
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const login = (email: string, password: string): Promise<any> => {
    return client.post(
        "auth/signin", 
        { email, password }, 
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const google_login = (inputs: { [key: string]: string }): Promise<any> => {
    return client.post(
        "auth/signin", 
        inputs, 
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const get_wallet = (): Promise<any> => {
    return client.get("user/wallet");
}

export const verify_email = (email: string, code: string) => {
    return client.post(
        "auth/signin", 
        { email, code }, 
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const send_code = (email: string, purpose: string) => {
    return client.get(
        `auth/email/${email}/${purpose}/send-code`, 
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const verify_code =  (email: string, code: string, purpose: string): Promise<void> => {
    return client.get(
        `auth/email/${email}/${code}/${purpose}/verify-code`,
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const forgot_password =  (email: string): Promise<any> => {
    return client.get(
        `auth/email/${email}/password_reset/send-code`,
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const change_password = (inputs: { [key: string]: string }): Promise<any> => {
    return client.post(
        `auth/change-password`, 
        inputs, 
        { useAppToken: false } as CustomAxiosRequestConfig
    );
}

export const get_flags = (): Promise<any> => {
    //return axios.get("https://flagcdn.com/en/codes.json");
    return axios.get("https://country-code-au6g.vercel.app/Country.json");
}

export const get_banks = () => {
    return client.get(
        'banks', 
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const fetch_account = (account: string, code: string | number) => {
    return client.get(
        `account/verify/${account}/${code}`, 
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const fund_wallet = (amount: string | number) => {
    return client.post("fund-wallet", { amount });
}

// Cancel the request
//source.cancel('Request canceled by the user.');