import { client, CustomAxiosRequestConfig } from '../client';

export const register = (inputs: { [key: string]: string }): Promise<any> => {
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

export const google_login = (inputs: { [key: string]: string | null }): Promise<any> => {
    return client.post(
        "auth/google_signin", 
        inputs, 
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

export const send_code = (email: string, purpose: string): Promise<any> => {
    return client.get(
        `auth/email/${email}/${purpose}/send-code`, 
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const verify_code =  (email: string, code: string, purpose: string): Promise<any> => {
    return client.get(
        `auth/email/${email}/${code}/${purpose}/verify-code`,
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}