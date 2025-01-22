export interface Transaction {
    id: string;
    type: 'DEBIT' | 'CREDIT';
    createdAt: string | number;
    amount: number;
    receiver: {
        firstname: string;
        lastname: string;
    };
    sender: {
        firstname: string;
        lastname: string;
    };
    status: string;
    description: string;
}