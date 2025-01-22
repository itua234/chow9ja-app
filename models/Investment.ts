export interface Investment {
    id: string;
    //type: 'DEBIT' | 'CREDIT';
    name: string;
    image: string;
    returns: string;
    amount: number;
    createdAt: string | number;
    status: string;
    duration: number;
    description: string;
}