import { client, CustomAxiosRequestConfig } from '../client';

export const get_wallet = (): Promise<any> => {
    return client.get("user/wallet");
}

export const get_banks = (): Promise<any> => {
    return client.get(
        'banks', 
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const fetch_account = (account: string, code: string | number): Promise<any> => {
    return client.get(
        `account/verify/${account}/${code}`, 
        { useAppToken: true } as CustomAxiosRequestConfig
    );
}

export const fund_wallet = (amount: string | number): Promise<any> => {
    return client.post("fund-wallet", { amount });
}