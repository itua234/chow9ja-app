import { WebViewNavigation } from "react-native-webview";

// QuickActionProps
export interface QuickActionProps {
    onSendPress: () => void;
    onAddFundsPress: () => void;
    onRequestPress: () => void;
    onMorePress: () => void;
}

// Transaction
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

// DashboardActivityProps
export interface DashboardActivityProps {
    transactions: Transaction[];
    onSeeAll: () => void;
    title: string;
}

// AccountBalanceProps
export interface AccountBalanceProps {
    data: { [key: string]: string | number };
    isBalanceVisible: boolean;
    toggleBalanceVisibility: () => void;
    copyToClipboard: (text: string) => void;
}

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