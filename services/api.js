import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Uncomment and use environment variables in a real-world scenario
const appToken = process.env.EXPO_PUBLIC_APP_TOKEN;

const client = axios.create({
    baseURL: process.env.EXPO_PUBLIC_APP_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
client.interceptors.request.use(
    async config => {
        try {
            // Check if the request should use the app token
            if (config.useAppToken && appToken) {
                config.headers.Authorization = `Bearer ${appToken}`;
            } else {
                const userToken = await AsyncStorage.getItem('user_token');
                if (userToken) {
                    config.headers.Authorization = `Bearer ${userToken}`;
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

// Auth API functions
export const register = (inputs) => {
    return client.post("auth/signup", inputs, { useAppToken: true });
}

export const login = (email, password) => {
    return client.post("auth/signin", { email, password }, { useAppToken: true });
}

export const get_wallet = () => {
    return client.get("user/wallet");
}

export const verify_email = (email, code) => {
    return client.post("auth/signin", { email, code }, { useAppToken: true });
}

export const send_code = (email, purpose) => {
    return client.get(`auth/email/${email}/${purpose}/send-code`, { useAppToken: true });
}

export const verify_code = (email, code, purpose) => {
    return client.get(`auth/email/${email}/${code}/${purpose}/verify-code`, { useAppToken: true });
}

export const forgot_password = (email) => {
    return client.get(`auth/email/${email}/password_reset/send-code`, { useAppToken: true });
}

export const change_password = (inputs) => {
    return client.post(`auth/change-password`, inputs, { useAppToken: false });
}

export const get_flags = () => {
    //return axios.get("https://flagcdn.com/en/codes.json");
    return axios.get("https://country-code-au6g.vercel.app/Country.json");
}

export const get_banks = () => {
    return client.get("banks", { useAppToken: true });
}

export const fetch_account = (account, code) => {
    return client.get(`account/verify/${account}/${code}`, { useAppToken: true });
}

export const fund_wallet = (amount) => {
    return client.post("fund-wallet", { amount });
}