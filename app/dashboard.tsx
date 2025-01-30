import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import { Text, View, RefreshControl, FlatList, Platform, Pressable, ToastAndroid, StyleSheet, Share, Linking, Alert } from 'react-native';
import {SvgXml} from "react-native-svg";
import {eye, eye_off, copy, arrow_up, arrow_down, ellipsis, plus, wallet} from '../util/svg';
import TransactionCard from "@/components/TransactionCard"
import QuickActions from "../components/QuickActions"
import DashboardHeader from "@/components/DashboardHeader"
import ScreenLayout from "@/components/ui/ScreenLayout"
import * as Clipboard from 'expo-clipboard';
import {get_wallet, fund_wallet} from "@/api"
import RBSheet from "react-native-raw-bottom-sheet";
import PrimaryButton from "@/components/PrimaryButton"
import CustomInput from "@/components/CustomInput"
import AddFundModal from '@/components/AddFundModal';
import { WebViewNavigation } from 'react-native-webview';
import { 
    QuickActionProps, 
    DashboardActivityProps, 
    AccountBalanceProps 
} from "@/util/types";
import { Transaction } from "@/models/Transaction";
import { Investment } from "@/models/Investment";
import InvestmentCard from "@/components/InvestmentCard"
import { router } from 'expo-router';
import { AxiosError, AxiosResponse } from 'axios';

import { useSelector } from 'react-redux';
import { RootState } from '@/reducers/store';


export const DashboardQuickAction = ({ 
    onSendPress, 
    onAddFundsPress, 
    onRequestPress, 
    onMorePress 
}: QuickActionProps) => {
    return (
        <View className="mb-[20px] bg-white px-[25px] py-[15px] rounded-[20px]">
            <View className="flex-row justify-between">
                <QuickActions 
                    title="Send" 
                    icon={arrow_up} 
                    onPress={onSendPress} 
                />
                <QuickActions 
                    title="Add funds" 
                    icon={plus} 
                    onPress={onAddFundsPress} 
                />
                <QuickActions 
                    title="Request" 
                    icon={arrow_down} 
                    onPress={onRequestPress} 
                />
                <QuickActions 
                    title="More" 
                    icon={ellipsis} 
                    onPress={onMorePress} 
                />
            </View>
        </View>
    );
};

export const DashboardActivity = ({ 
    transactions, 
    onSeeAll,
    title
}: DashboardActivityProps) => {
    return (
        <>
            <View className="flex-row items-center justify-between mb-[20px]">
                <Text className="text-[15px] font-primary">{title}</Text>
                <View className="px-[8px] py-[10px] bg-white self-end rounded-[17px]">
                    <Pressable onPress={onSeeAll}>
                        <Text className="text-[15px] font-primary">see all</Text>
                    </Pressable>
                </View>
            </View>
            {transactions.length === 0 ? (
                // Render this view when transactions array is empty
                <View className="flex-1 items-center justify-center mt-[50px]">
                    <SvgXml xml={wallet} width="35" height="35"></SvgXml>
                    {/* <View className="w-[80px] h-[80px] rounded-full mb-[10px] bg-primary">
                         <SvgXml xml={arrow_up} width="24" height="24"></SvgXml>
                    </View> */}
                    <Text className="text-[16px] font-primary text-gray-500">
                        No transactions yet.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={({item}) => <TransactionCard data={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                />
            )}
        </>
    );
};

const renderAmountWithColoredDecimal = (amount: string) => {
    // Check if amount is undefined, null, or not a string
    if (!amount || typeof amount !== 'string') {
        return <Text className="text-[38px] font-semibold font-primary">$0.00</Text>;
    }
    // Split the amount, handling potential formatting issues
    const [wholePart, decimalPart] = amount.toString().split('.');
    //const [wholePart, decimalPart] = amount.split('.');
    return (
        <Text className="text-[38px] font-semibold font-primary">
            {wholePart}
            <Text className="text-gray-400">.{decimalPart}</Text>
        </Text>
    );
};

export const AccountBalance = ({ 
    data,
    isBalanceVisible, 
    toggleBalanceVisibility, 
    copyToClipboard
}: AccountBalanceProps) => {
    return (
        <View className="px-[10px] pt-[8px] pb-[40px] mb-[20px] bg-white rounded-[20px]">
            <Pressable onPress={toggleBalanceVisibility}>
                <View className="self-end w-[40px] h-[40px] bg-[#f3f3f3] rounded-full flex items-center justify-center">
                    {
                        isBalanceVisible
                        ? <SvgXml xml={eye} width="24" height="24"></SvgXml>
                        : <SvgXml xml={eye_off} width="24" height="24"></SvgXml>
                    }
                </View>
            </Pressable>
            <View className=" flex items-center mt-[12.5px]">
                <Text className="font-primary text-[gray]">Account balance</Text>
                {
                    isBalanceVisible
                    ? <Text className="text-[38px] font-semibold font-primary">${renderAmountWithColoredDecimal(data?.balance as string)}</Text>
                    : <Text className="text-[38px] font-semibold font-primary">*********</Text>
                }
                <View className="flex-row items-center mt-[7px]">
                    <Pressable onPress={() => copyToClipboard(data?.account_number as string)}>
                        <SvgXml xml={copy} width="14" height="14"></SvgXml>
                    </Pressable>
                    <Text className="font-primary ml-[5px] text-[gray]">{data?.account_number}</Text>
                </View>
            </View>
        </View>
    );
};

interface InputsType {
    [key: string]: string;
}
interface ErrorsType {
    [key: string]: string;
}
const Dashboard = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
    const toggleBalanceVisibility = () => setIsBalanceVisible(!isBalanceVisible);
    const [wallet, setWallet] = useState({});

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [investments, setInvestments] = useState<Investment[]>([]);
    
    const refRBSheet = useRef<any>(null);

    const [inputs, setInputs] = useState({amount: "20500"});
    const [msg, setMsg] = useState<string>('');
    const [errors, setErrors] = useState< ErrorsType>({});
    const [isLoading, setLoading] = useState<boolean>(false);
    const handleFocus = useCallback((name: string) => {
        return (value: string) => {
            setInputs(values => ({
                ...values,
                [name]: value
            }));
        };
    }, []);
    const handleErrors = (error: string, input: string) => {
        setErrors(values => ({
            ...values, 
            [input]: error
        }));
    }
    const handleMessage = (message: string) => setMsg(message);

    const [url, setUrl] = useState("");
    const handleClose = () => setUrl('');
    const handleNavigationStateChange = (navState: WebViewNavigation) => {
        const { url } = navState;
        if(url.includes('card-subscription')) {
          console.log('Payment was successful:', url);
          setUrl("");
          //router.push("/checkout");
        }
    };

    useEffect(() => {
        const fetchWallet = async () => {
            const response = await get_wallet();
            const { wallet, transactions } = response.data.results;
            setWallet(wallet);
            setTransactions(transactions);
            setInvestments([
                {
                    id: "1",
                    name: "Real Estate Fund",
                    image: "https://example.com/images/real-estate.jpg",
                    returns: "7",
                    amount: 50000,
                    createdAt: "2023-01-01",
                    status: "active",
                    duration: 12,
                    description: "A diversified real estate investment fund offering steady returns.",
                },
                {
                    id: "2",
                    name: "Tech Growth Fund",
                    image: "https://example.com/images/tech-growth.jpg",
                    returns: "12",
                    amount: 30000,
                    createdAt: "2023-02-15",
                    status: "active",
                    duration: 12,
                    description: "An investment fund focused on high-growth tech companies.",
                },
                {
                    id: "3",
                    name: "Green Energy Fund",
                    image: "https://example.com/images/green-energy.jpg",
                    returns: "9",
                    amount: 40000,
                    createdAt: "2023-03-10",
                    status: "pending",
                    duration: 9,
                    description: "A fund investing in renewable energy and sustainable projects.",
                },
                {
                    id: "4",
                    name: "Global Equity Fund",
                    image: "https://example.com/images/global-equity.jpg",
                    returns: "8",
                    amount: 60000,
                    createdAt: "2023-04-05",
                    status: "active",
                    duration: 6,
                    description: "A portfolio of global stocks providing stable long-term returns.",
                },
                {
                    id: "5",
                    name: "Cryptocurrency Fund",
                    image: "https://example.com/images/crypto.jpg",
                    returns: "15",
                    amount: 20000,
                    createdAt: "2023-05-20",
                    status: "inactive",
                    duration: 9,
                    description: "A high-risk fund investing in major cryptocurrencies.",
                }
            ]);
        };
        fetchWallet();
    }, []);

    const copyToClipboard = async (text: string) => {
        // Copy to clipboard
        await Clipboard.setStringAsync(text);
        // Optional: Show feedback to user
        if (Platform.OS === 'android') {
            ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
        } else if (Platform.OS === 'ios') {
            alert(text);
        }
    };

    // Define custom methods for each quick action
    const handleSend = () => {
        //navigation.navigate('SendMoney');
        console.log("send");
        router.push("/send");
    };
    const handleAddFunds = () => {
        setLoading(true);
        setTimeout(() => {
            fund_wallet(inputs.amount)
            .then(async (response: AxiosResponse) => {
                setLoading(false);
                console.log(response.data?.results);
                setUrl(response.data?.results?.authorization_url);
             }).catch((error: AxiosError<any>) => {
                setLoading(false);
            })
        }, 200); // Delay submission 
    };
    const handleRequest = () => {
        // Navigate to request money screen
        //navigation.navigate('RequestMoney');
        console.log("request money");
    };
    const handleMore = async (message="Compliments of the season!!!") => {
        // Show more options or open a bottom sheet
        console.log('More options clicked');
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        await Linking.openURL(url);
    };
    const seeAllTransactions = () => {
        alert("see all");
    }

    if (!user) return null;

    return (
        <ScreenLayout 
            className="pt-[10px]" 
            contentContainerStyle={{  }}
            scrollViewProps={{ 
                //refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> 
            }}
        >
            <View className="flex-1">
                {!url ? (
                    <View  className="px-[17.5] flex-1">
                        <DashboardHeader />
                        <AccountBalance 
                            isBalanceVisible={isBalanceVisible} 
                            toggleBalanceVisibility={toggleBalanceVisibility}
                            copyToClipboard={copyToClipboard}
                            data={wallet}
                        />
                        <DashboardQuickAction
                            onSendPress={handleSend}
                            onAddFundsPress={() => refRBSheet.current.open()}
                            onRequestPress={handleRequest}
                            onMorePress={handleMore}
                        />
                        <DashboardActivity
                            transactions={transactions}
                            onSeeAll={seeAllTransactions}
                            title="Recent Transaction"
                        />   

                        <RBSheet
                            ref={refRBSheet}
                            closeOnPressBack={true}
                            closeOnPressMask={false}
                            onOpen={() => console.log('RBSheet is Opened')}
                            onClose={() => console.log('RBSheet is Closed')}
                            draggable={true}
                            openDuration={500}
                            height={300}
                            customStyles={styles.bottomSheet}
                        >
                            <View className="px-7 flex-1">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-xl font-medium font-primary">TSW12286</Text>
                                </View>
                                <View className="mt-5 flex-1 pb-5">
                                    <CustomInput 
                                        label="Amount"
                                        inputMode='numeric'
                                        keyboardType='phone-pad'
                                        value={inputs.amount}
                                        onChangeText={handleFocus('amount')}
                                        placeholder="0.00"
                                        editable
                                        error={errors.amount}
                                    />
                                    
                                    <PrimaryButton 
                                        title="Fund Wallet"
                                        isLoading={isLoading} 
                                        action={handleAddFunds}
                                        disabled={false}
                                    />
                                </View>
                            </View>
                        </RBSheet>

                        {/* <View className="mt-5 flex-1 pb-5">
                            {investments.length > 0 && (
                                <FlatList
                                    data={investments}
                                    renderItem={({item}) => <InvestmentCard data={item} />}
                                    keyExtractor={(item) => item.id?.toString() || 'default'}
                                    scrollEnabled={false}
                                    ListEmptyComponent={<Text>No investments found</Text>}
                                />
                            )}
                        </View> */}

                        
                    </View>
                ) : (
                    <AddFundModal 
                        onClose={handleClose}
                        url={url}
                        onNavigationStateChange={handleNavigationStateChange}
                    />
                )}
            </View>
        </ScreenLayout>
    );
}

export default Dashboard;

const styles = StyleSheet.create({
    bottomSheet: {
        wrapper: { backgroundColor: "rgba(74, 74, 75, 0.8)" },
        draggableIcon: { backgroundColor: "#F1F1F1", width: 50 },
        container: {
            borderTopRightRadius: 60,
            borderTopLeftRadius: 40,
            backgroundColor: "white"
        }
    }
} as any);