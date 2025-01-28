import { useState, useEffect, useCallback } from 'react';
import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig,
  AxiosResponse,
  CancelToken,
  Method
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Types
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    useAppToken?: boolean;
    _retry?: boolean;
    useBaseURL?: boolean;
}

// Also extend the AxiosError type to include our custom config
interface CustomAxiosError extends AxiosError {
    config: CustomAxiosRequestConfig;
}

interface ApiClientConfig {
    baseURL?: string;
    timeout?: number;
    useAppToken?: boolean;
}

interface ApiClientState {
    loading: boolean;
    error: CustomAxiosError | null;
}

interface RequestConfig {
    method: Method;
    url: string;
    data?: any;
    params?: any;
    useBaseURL?: boolean;
    useAppToken?: boolean;
    headers?: Record<string, string>;
}

interface UseApiClientReturn {
    request: <T = any>(config: RequestConfig) => Promise<T>;
    loading: boolean;
    error: CustomAxiosError | null;
    resetError: () => void;
    cancelRequests: (message?: string) => void;
}

// interface UseApiClientReturn {
//     client: AxiosInstance;
//     loading: boolean;
//     error: AxiosError | null;
//     resetError: () => void;
//     cancelRequests: (message?: string) => void;
// }

interface AuthTokens {
    userToken: string | null;
    refreshToken: string | null;
}

const DEFAULT_CONFIG: ApiClientConfig = {
    baseURL: Platform.OS === 'ios' 
        ? 'http://127.0.0.1:8080/api/v1/' 
        : 'http://10.0.2.2:8080/api/v1/',
    timeout: 10000,
    useAppToken: false
};

export const useApi = (config: ApiClientConfig = DEFAULT_CONFIG): UseApiClientReturn => {
    const [state, setState] = useState<ApiClientState>({
        loading: false,
        error: null
    });
  
    // Create a ref for the cancel token source
    const cancelTokenSource = axios.CancelToken.source();

    // Initialize the client
    const client = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        cancelToken: cancelTokenSource.token
    });

    // Token management
    const getStoredTokens = useCallback(async (): Promise<AuthTokens> => {
        try {
            const [userToken, refreshToken] = await Promise.all([
                AsyncStorage.getItem('user_token'),
                AsyncStorage.getItem('refresh_token')
            ]);
                return { userToken, refreshToken };
            } catch (error) {
                console.error('Failed to retrieve tokens:', error);
                return { userToken: null, refreshToken: null };
            }
    }, []);

    const refreshAccessToken = useCallback(async (refreshToken: string) => {
        try {
            const { data } = await client.post('/auth/refresh-token', { refreshToken });
            await AsyncStorage.setItem('user_token', data.token);
            return data.token;
        } catch (error) {
            throw new Error('Token refresh failed');
        }
    }, [client]);

    // Request Interceptor
    useEffect(() => {
        const requestInterceptor = client.interceptors.request.use(
            async (config: CustomAxiosRequestConfig) => {
                setState(prev => ({ ...prev, loading: true }));

                try {
                    if (config.useAppToken && process.env.EXPO_PUBLIC_APP_TOKEN) {
                        config.headers!.Authorization = `Bearer ${process.env.EXPO_PUBLIC_APP_TOKEN}`;
                    } else {
                        const { userToken } = await getStoredTokens();
                        if (userToken) {
                            config.headers!.Authorization = `Bearer ${userToken}`;
                        }
                    }
                } catch (error) {
                    console.error('Request interceptor error:', error);
                }

                return config;
            },
            error => {
                setState(prev => ({ ...prev, loading: false, error }));
                return Promise.reject(error);
            }
        );

        return () => {
            client.interceptors.request.eject(requestInterceptor);
        };
    }, [client, getStoredTokens]);

    // Response Interceptor
    useEffect(() => {
        const responseInterceptor = client.interceptors.response.use(
            (response: AxiosResponse) => {
                setState(prev => ({ ...prev, loading: false }));
                return response;
            },
            async (error: CustomAxiosError) => {
                setState(prev => ({ ...prev, loading: false, error }));
                // Handle 401 and token refresh
                if (error.response?.status === 401) {
                    try {
                        const { refreshToken } = await getStoredTokens();
                        if (refreshToken && error.config && !error.config._retry) {
                            error.config._retry = true;
                            const newToken = await refreshAccessToken(refreshToken);
                            error.config.headers.Authorization = `Bearer ${newToken}`;
                            return client(error.config);
                        }
                    } catch (refreshError) {
                        // Handle failed refresh (e.g., logout user)
                        await AsyncStorage.multiRemove(['user_token', 'refresh_token']);
                        // You might want to trigger a navigation to login here
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            client.interceptors.response.eject(responseInterceptor);
        };
    }, [client, getStoredTokens, refreshAccessToken]);

    const request = useCallback(async <T = any>({
        method,
        url,
        data,
        params,
        useBaseURL = false,
        useAppToken = false,
        headers = {}
    }: RequestConfig): Promise<T> => {
        try {
            const response = await client.request<T>({
                method,
                url,
                data,
                params,
                baseURL: useBaseURL ? DEFAULT_CONFIG.baseURL : config.baseURL,
                headers,
                useAppToken
            } as RequestConfig);
            return response.data;
        } catch (error) {
            throw error;
        }
    }, [client, config.baseURL]);

    const resetError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    const cancelRequests = useCallback((message?: string) => {
        cancelTokenSource.cancel(message);
    }, [cancelTokenSource]);

    return {
        request,
        loading: state.loading,
        error: state.error,
        resetError,
        cancelRequests
    };
};

// const { request } = useApi();

// // Example usage
// const getData = async () => {
//   const response = await request({
//     method: 'GET',
//     url: '/endpoint',
//     useBaseURL: true // This will now work correctly
//   });
// };