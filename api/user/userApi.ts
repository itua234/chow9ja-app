import { client, CustomAxiosRequestConfig } from '../client';

export const get_user = (): Promise<any> => {
    return client.get("user");
}