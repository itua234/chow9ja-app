import React, {useState, useRef, useEffect} from 'react';
import {
    View, 
    SafeAreaView, 
    Text, 
    StatusBar,
    Pressable, 
    TextInput, 
    Animated,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PrimaryButton from "../components/PrimaryButton"
import ScreenLayout from "@/components/ui/ScreenLayout"
import CustomInput from "@/components/CustomInput"
import CustomPicker from "@/components/ui/CustomPicker"
//import CustomBackButton from "../components/CustomBackButton"
import {fetch_biller_info, fetch_bill_info, fetch_account} from "@/api"
import RBSheet from "react-native-raw-bottom-sheet";

interface ProviderType {
    id: number;
    name: string;
    biller_name?: string;
    biller_code: string;
    description: string;
    logo: string | null;
    short_name: string;
    country_code: string;
}
interface InputsType {
    meter_number: string | number;
    amount: string | number;
}
interface ErrorsType {
    [key: string]: string;
}
const Utility = () => {
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    const screenHeight = Dimensions.get('window').height;
    const [bottomSheetType, setBottomSheetType] = useState('provider');

    const [providers, setProviders] = useState<ProviderType[]>([]);
    const [packages, setPackages] = useState<string[]>([]);
    const [openInput, setOpenInput] = useState<boolean>(false);
    const refRBSheet = useRef<any>(null);
    useEffect(() => {
        const fetchProviders = async () => {
            const response = await fetch_biller_info("UTILITYBILLS");
            setProviders(response.data?.results);
            setPackages(["PREPAID", "POSTPAID"]);
        };
        fetchProviders();
    }, []);

    const [accountName, setAccountName] = useState<string>('');
    const [isFetchingAccount, setIsFetchingAccount] = useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [inputs, setInputs] = useState({
        meter_number: "",
        amount: "",
        provider: {
            name: "Select a Disco", biller_code: ""
        },
        package: "Postpaid or Prepaid"
    });
    useEffect(() => {
        if (inputs.provider.name !== "Select a Disco" && inputs.package !== "Postpaid or Prepaid") {
            setOpenInput(true);
        } else {
            setOpenInput(false);
        }
    }, [inputs.provider.name, inputs.package]);
    
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

    const selectProvider = (provider: ProviderType) => {
        setInputs(values => ({
            ...values,
            provider: {
                ...values.provider,
                name: provider.short_name,
                biller_code: provider.biller_code
            },
            package: "Postpaid or Prepaid"
        }));
        setOpenInput(true);
        refRBSheet.current.close();
    };
    const selectPackage = (item: any) => {
        setInputs(values => ({
            ...values,
            package: item,
        }));
        refRBSheet.current.close();
    };

    const Send = async () => {
        setLoading(true);
        console.log(inputs);
        //router.push("/ConfirmPayment", {recipient: inputs});
    };

    // Rest of your component remains the same
    return (
        <ScreenLayout className="pt-[10px] bg-white">
            <View className="px-[17.5] flex-1">
                <Text className="text-red-500 text-center">{msg}</Text>
                <View className="flex-1">
                    <View className="mt-5">
                        <Text className="text-[#1A1C1E] mb-2 mt-[7.5px] font-primary">Select Provider</Text>
                        <Pressable onPress={() => {
                            setBottomSheetType('provider');
                            refRBSheet.current.open();
                        }} className="border-2 border-[#EDF1F3] rounded-[15px] py-5 px-[15px] font-primary text-[#1A1C1E] text-[16px]">
                            <Text className={`text-[16px] font-primary ${inputs.provider.name !== "Select a Disco" ? "text-[#1A1C1E]" : "text-[#6C7278]"}`}>
                                {inputs.provider.name}
                            </Text>
                        </Pressable>
                    </View>

                    <View className="mt-5">
                        <Text className="text-[#1A1C1E] mb-2 font-primary">Select Type</Text>
                        <Pressable onPress={async () => {
                            setBottomSheetType('package');
                            refRBSheet.current.open();
                        }} className="border-2 border-[#EDF1F3] rounded-[15px] py-5 px-[15px] font-primary text-[#1A1C1E] text-[16px]">
                            <Text className={`text-[16px] font-primary ${inputs.package !== "Postpaid or Prepaid" ? "text-[#1A1C1E]" : "text-[#6C7278]"}`}>
                                {inputs.package}
                            </Text>
                        </Pressable>
                    </View>
                    
                    {openInput && (
                        <>
                        <CustomInput 
                            label="Meter Number"
                            type="number"
                            keyboardType='phone-pad'
                            value={inputs.meter_number}
                            onChangeText={handleInputs('meter_number')}
                            placeholder="Enter Meter Number"
                            //maxLength={10}
                            editable
                            error={errors.meter_number}
                        />
                        <CustomInput 
                            label="Amount"
                            type="number"
                            keyboardType='phone-pad'
                            value={inputs.amount}
                            onChangeText={handleInputs('amount')}
                            placeholder="Enter Amount"
                            //maxLength={10}
                            editable
                            error={errors.amount}
                        />
                        </>
                    )}

                    <PrimaryButton 
                        title="Continue"
                        isLoading={isLoading} 
                        action={Send}
                        disabled={false}
                    />

                    <RBSheet
                        ref={refRBSheet}
                        closeOnPressBack={true}
                        closeOnPressMask={true}
                        draggable={true}
                        openDuration={200}
                        height={screenHeight * 0.7}
                        customStyles={styles.bottomSheet}
                    >
                        <View className="px-7 flex-1">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-xl font-medium font-primary">
                                    {bottomSheetType === 'provider' ? 'Select a Disco' : ` Select Type`}
                                </Text>
                            </View>
                            <View className="mt-5 flex-1 pb-5">
                                <FlatList
                                    data={bottomSheetType === 'provider' ? providers : packages as any[]}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity 
                                        onPress={() => 
                                            bottomSheetType === 'provider' 
                                                ? selectProvider(item)
                                                : selectPackage(item)
                                        }
                                            className="flex-row items-center px-[15px] mt-[10px] border-[2px] border-[#EDF1F3] py-[15px] active:bg-gray-50"
                                        >
                                            <Text className="text-[#6C7278] font-primary text-[16px]">
                                                {typeof item === 'string' ? item : item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </RBSheet>


                </View>
            </View>
        </ScreenLayout>
    );
};

export default Utility;

const styles = StyleSheet.create({
    bottomSheet: {
        wrapper: { backgroundColor: "rgba(74, 74, 75, 0.8)" },
        draggableIcon: { backgroundColor: "#F1F1F1", width: 50 },
        container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            backgroundColor: "white"
        }
    }
} as any);          