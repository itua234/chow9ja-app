import React, {useState, useRef, useEffect} from 'react';
import {
    View, 
    SafeAreaView, 
    Text, 
    StatusBar,
    Pressable, 
    TextInput, 
    Animated
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PrimaryButton from "../components/PrimaryButton"
import ScreenLayout from "@/components/ui/ScreenLayout"
import CustomInput from "@/components/CustomInput"
import CustomPicker from "@/components/ui/CustomPicker"
//import CustomBackButton from "../components/CustomBackButton"
import {get_banks, fetch_account} from "../services/api"

interface BankType {
    name: string;
    code: string;
}
interface InputsType {
    account: string;
    bank: BankType;
    amount: string;
    description: string;
}
interface ErrorsType {
    [key: string]: string;
}
const Send = () => {
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);

    const [banks, setBanks] = useState<BankType[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    useEffect(() => {
        const fetchBanks = async () => {
            const response = await get_banks();
            setBanks(response.data?.results);
        };
        fetchBanks();
    }, []);

    const [accountName, setAccountName] = useState<string>('');
    const [isFetchingAccount, setIsFetchingAccount] = useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [inputs, setInputs] = useState<InputsType>({
        account: "",
        bank: {
            name: "Select Bank...", code: ""
        },
        amount: "",
        description: ""
    });
    const [msg, setMsg] = useState<string>('');
    const [errors, setErrors] = useState<ErrorsType>({});
    const handleInputs = (name: keyof InputsType) => {
        return (value: string) => {
            setInputs(values => ({
                ...values,
                [name]: value
            }));
        };
    };
    const handleErrors = (error: string, input: string) => {
        setErrors(values => ({
            ...values, 
            [input]: error
        }));
    }
    const handleMessage = (message: string) => setMsg(message);

    const selectBank = (bank: BankType) => {
        setInputs(values => ({
            ...values,
            bank: {
                ...values.bank,
                name: bank.name,
                code: bank.code
            },
            account: ""
        }));
        setAccountName("");
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        if (inputs.account.length === 10 && inputs.bank.code) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            timeoutRef.current = setTimeout(async () => {
                try {
                    setIsFetchingAccount(true);
                    setAccountName('');
                    const response = await fetch_account(inputs.account, inputs.bank.code);
                    
                    if (response.data?.results.account_name) {
                        setAccountName(response.data.results.account_name);
                        handleErrors('', 'account');
                    } else {
                        setAccountName('');
                        handleErrors('Invalid account number', 'account');
                    }
                } catch (error) {
                    setAccountName('');
                    handleErrors('Error verifying account', 'account');
                } finally {
                    setIsFetchingAccount(false);
                }
            }, 500);
        } else if (inputs.account.length > 0 && inputs.account.length < 10) {
            setAccountName('');
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [inputs.account, inputs.bank.code]);

    const Send = async () => {
        setLoading(true);
        console.log(inputs);
        //router.push("/ConfirmPayment", {recipient: inputs});
    };

    // Rest of your component remains the same
    return (
        <ScreenLayout 
            className="pt-[10px] bg-white" 
            contentContainerStyle={{  }}
            scrollViewProps={{ }}
        >
            <View className="px-[17.5] flex-1">
                <Text className="text-red-500 text-center">{msg}</Text>
                <View className="flex-1">
                    <View className="mt-5">
                        <Text className="text-[#1A1C1E] mb-2 mt-[7.5px] font-primary">Select a Bank</Text>
                        <Pressable onPress={() => setModalVisible(!modalVisible)} className="border-2 border-[#EDF1F3] rounded-[15px] py-5 px-[15px] font-primary text-[#1A1C1E] text-[16px]">
                            <Text className={`text-[16px] font-primary ${inputs.bank.name !== "Select Bank..." ? "text-[#1A1C1E]" : "text-[#6C7278]"}`}>
                                {inputs.bank.name}
                            </Text>
                        </Pressable>
                    </View>
                    
                    <CustomInput 
                        label="Enter Destination Account"
                        type="number"
                        keyboardType='phone-pad'
                        value={inputs.account}
                        onChangeText={handleInputs('account')}
                        placeholder="Account Number"
                        maxLength={10}
                        editable
                        error={errors.account}
                    />
                    <View className="flex-row justify-between mt-[7.5px]">
                        <Text className="font-primary">
                            {isFetchingAccount ? 'Verifying Beneficiary...' : accountName}
                        </Text>
                        <Text className="font-primary">{inputs.account?.length}/10</Text>
                    </View>

                    <CustomInput 
                        label="Amount"
                        inputMode='numeric'
                        keyboardType='phone-pad'
                        value={inputs.amount}
                        onChangeText={handleInputs('amount')}
                        placeholder="0.00"
                        editable
                        error={errors.amount}
                    />

                    <CustomInput 
                        label="Transaction Description"
                        inputMode='text'
                        value={inputs.description}
                        onChangeText={handleInputs('description')}
                        placeholder="Transaction Description"
                        editable
                        error={errors.description}
                    />

                    <PrimaryButton 
                        title="Send"
                        isLoading={isLoading} 
                        action={Send}
                        disabled={false}
                    />

                    <CustomPicker
                        modalVisible={modalVisible}
                        animationType="slide"
                        title="Select a Bank"
                        setModalVisible={setModalVisible}
                        data={banks}
                        onSelect={selectBank}
                        searchPlaceholder="Search banks..."
                        searchKeys={['name', 'code']} // Search by both name and code
                        //renderItem={banks.length ? renderBank : () => <Text>Loading...</Text>}
                    />

                </View>
            </View>
        </ScreenLayout>
    );
};

export default Send;