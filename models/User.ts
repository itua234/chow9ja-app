export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
    googleId: string | null;
    verified: boolean;
    notificationsEnabled: boolean;
    email_verified_at: string;
    token: string;
}