import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Uncomment and use environment variables in a real-world scenario
//const appToken = process.env.EXPO_PUBLIC_APP_TOKEN;
const appToken: string = "c2505e1877c35bff219c55c2820a0300a1fa3fdf33289e3fc5036c8fce2021d2";

// const client = axios.create({
//     baseURL: process.env.EXPO_PUBLIC_APP_URL,
//     headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//     }
// });
const client = axios.create({
    //baseURL: "http://192.168.43.253:8080/api/v1/",
    baseURL: "http://172.20.10.4:8080/api/v1/",
    //baseURL: "http://192.168.66.166:8080/api/v1/",
    // baseURL: "http://10.0.2.2:8000/api/v1/",
    //baseURL: "https://docazytest.azurewebsites.net/api/v1/",
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

export const get_wallet = () => {
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

export const forgot_password =  (email: string): Promise<void> => {
    return client.get(
        `auth/email/${email}/password_reset/send-code`,
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const change_password = (inputs: { [key: string]: string }): Promise<void> => {
    return client.post(
        `auth/change-password`, 
        inputs, 
        { useAppToken: false } as CustomAxiosRequestConfig
    );
}

export const get_flags = (): Promise<void> => {
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