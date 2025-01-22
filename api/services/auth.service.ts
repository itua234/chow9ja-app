import { client, CustomAxiosRequestConfig } from '../config/axios-config';

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

export const verify_email = (email: string, code: string) => {
    return client.post(
        "auth/signin", 
        { email, code }, 
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