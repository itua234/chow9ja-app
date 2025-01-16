import React, { useState, useEffect } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Text, View, 
    SafeAreaView, ScrollView, TextInput, Image, Keyboard,
    KeyboardAvoidingView, TouchableOpacity, Modal,
    Platform, Pressable, StatusBar } from 'react-native';
import {SvgXml, SvgUri} from "react-native-svg";
import {logo} from '@/util/svg';
import PrimaryButton from "@/components/PrimaryButton";
import CustomInput from "@/components/CustomInput";
import CustomPicker from "@/components/ui/CustomPicker"
import {register, get_flags} from "../services/api"
import {storeData} from "@/util/helper"
import { AxiosResponse, AxiosError } from 'axios';
import {router} from "expo-router";
import * as Haptics from 'expo-haptics';
import { validate } from '@/util/validator';

interface InputsType {
    [key: string]: string;
}
interface ErrorsType {
    [key: string]: string;
}
type Country = {
    code: string;        // Country code (e.g., 'US')
    dial_code: string;   // Dial code (e.g., '+1')
    name: string;       // Optional country name
};
const Signup = () => {
    const [inputs, setInputs] = useState<InputsType>({});
    const [msg, setMsg] = useState<string>('');
    const [errors, setErrors] = useState< ErrorsType>({});
    const [isLoading, setLoading] = useState<boolean>(false);
    //const [countryCode, setCountryCode] = useState('NG');
    const [callingCode, setCallingCode] = useState<string>('+234');
    const [flagUrl, setFlagUrl] = useState<string>('https://flagcdn.com/w320/ng.png'); // Default flag
    const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
    const [countries, setCountries] = useState([]);
 
    const onSelectCountry = (country: Country) => {
        const flagUrl = `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`;
        setFlagUrl(flagUrl);
        setCallingCode(country.dial_code);
        setInputs(prevInputs => ({
            ...prevInputs,
            "phone": ""
        }));
    };

    // Custom render function for countries
    const renderCountry = (country: Country) => (
        <>
            <Image className="w-[32px] h-[32px] rounded-full mr-[10px]"
                source={{uri: `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`}}
            />
            <Text className="text-[#6C7278] font-primary text-[16px]">
                {country.name.toUpperCase()}
            </Text>
            <Text className="text-[#6C7278] font-primary text-[16px] ml-[10px]">{country.dial_code}</Text>
        </>
    );

    useEffect(() => {
        const fetchCountries = async () => {
            const response = await get_flags();
            setCountries(response?.data);
        };
        fetchCountries();
    }, []);

    const handleInputs = (name: string) => {
        return (value: string) => {
            setInputs(prevInputs => ({
                ...prevInputs,
                [name]: value
            }));
            const rules = {
                [name]: 
                    name === 'firstname' ? 'required' : 
                    name === 'lastname' ? 'required' : 
                    name === 'email' ? 'required|email' : 
                    name === 'phone' ? 'required|number|min:10' :
                    name === 'password' ? 'required|min:8|number|special' :
                'required'
            };
            const fieldErrors:  ErrorsType = validate({ [name]: value }, rules);
            // Clear error if input becomes valid, or set new error
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: fieldErrors[name] || ''
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

    interface SignupResponseData {
        results: {
            token: string;
        };
    }
    const Signup = async () => {
        // router.push({
        //     pathname: "/verify-email",
        //     params: {email: "ituaosemeilu234@gmail.com"}
        // });
        const payload = inputs;
        if (inputs.phone || inputs.phone.trim() !== "") {
            payload.phone = callingCode + inputs.phone;
        }
        Keyboard.dismiss();
        setLoading(true);
        setErrors({});
        handleMessage('');
        setTimeout(() => {
            register(payload)
            .then(async (res: AxiosResponse) => {
                //setLoading(false);
                //console.log(res.data?.results);
                router.push({
                    pathname: "/verify-email",
                    params: {email: res.data?.results}
                });
            }).catch((error: AxiosError<any>) => {
                setErrors({});
                handleMessage('');
                setLoading(false); 
                if (error.response) {
                    let errors = error.response.data.error;
                    errors.firstname && handleErrors(errors.firstname, 'firstname');
                    errors.lastname && handleErrors(errors.lastname, 'lastname');
                    errors.email && handleErrors(errors.email, 'email');
                    errors.phone && handleErrors(errors.phone, 'phone');
                    errors.password && handleErrors(errors.password, 'password');
                    if (error.response.status === 400 || error.response.status === 401) {
                        handleMessage(error.response.data.message);
                    }
                }
            })
        }, 100); // Delay submission 
    }

    return (
        <SafeAreaView className="flex-1 bg-white pt-[20px]">
            <StatusBar
                animated={false}
                backgroundColor="#fff"
                networkActivityIndicatorVisible={true}
                hidden={false}
                barStyle="dark-content"
                translucent={false}
            />
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView 
                    contentContainerStyle={{ 
                        flexGrow: 1, 
                        justifyContent: 'space-between' 
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="px-[17.5] flex-1">
                        <SvgXml xml={logo} width="101" height="40"></SvgXml>
                        <View className="mb-30">
                            <Text className="text-[30px] font-primary font-bold text-[#2A0944] mb-2.5">Sign up</Text>
                            <Text className="font-primary text-[#6C7278]">Create an account to continue.</Text>
                        </View>
                        <Text className="text-[16px] text-red-500 mb-2.5 font-primary text-center">{msg}</Text>

                        <View className="flex-1">
                            <CustomInput 
                                label="First Name"
                                type="text"
                                value={inputs.firstname}
                                onChangeText={handleInputs("firstname")}
                                placeholder="Enter your firstname"
                                error={errors.firstname}
                            />
                        
                            <CustomInput 
                                label="Last Name"
                                type="text"
                                value={inputs.lastname}
                                onChangeText={handleInputs("lastname")}
                                placeholder="Enter your lastname"
                                error={errors.lastname}
                            />

                            <CustomInput 
                                label="Email"
                                type="email"
                                value={inputs.email}
                                onChangeText={handleInputs("email")}
                                placeholder="Enter your email"
                                error={errors.email}
                            />
                            
                            <View className="">
                                <Text className="text-[#6C7278] mb-2 mt-[7.5px] font-primary">Phone Number</Text>
                                <View className={`flex-row items-center border-2 border-[#EDF1F3] rounded-[15px]`}>
                                    <TouchableOpacity 
                                        className="flex-row items-center justify-center w-[110px] h-full border-r border-[#EDF1F3] "
                                        onPress={async () => {
                                            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                            setShowCountryPicker(!showCountryPicker)
                                        }}
                                    >
                                        <View className="flex-row items-center">
                                            <Image className="w-[30px] h-[30px] rounded-full"
                                                source={{
                                                    uri: flagUrl,
                                                }}
                                            />
                                            <Text className="text-[18px] font-primary ml-[10px]">{callingCode}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TextInput
                                        className="flex-1 py-5 px-[15px] font-primary text-[#1A1C1E] text-[16px]"
                                        placeholder="Enter your phone"
                                        placeholderTextColor={"#6C7278"}
                                        value={inputs.phone}
                                        onChangeText={handleInputs("phone")}
                                        inputMode='tel'
                                        keyboardType='phone-pad'
                                        maxLength={10}
                                    />
                                </View>
                            </View>
                            {errors.phone && <Text className="text-[16px] text-red-500 mt-1 font-primary">{errors.phone}</Text>}

                            <CustomInput 
                                label="Password"
                                type="password"
                                value={inputs.password}
                                onChangeText={handleInputs("password")}
                                placeholder="Enter your password"
                                error={errors.password}
                            />
                            
                            <PrimaryButton 
                                title="Register"
                                isLoading={isLoading} 
                                action={Signup}
                                disabled={false}
                            />
                        </View>

                        <CustomPicker
                            modalVisible={showCountryPicker}
                            animationType="slide"
                            title="Select a Country"
                            setModalVisible={setShowCountryPicker}
                            data={countries}
                            onSelect={onSelectCountry}
                            searchPlaceholder="Search country..."
                            searchKeys={['name', 'code']} // Search by both name and code
                            //renderItem={renderCountry}
                            renderItem={countries.length ? renderCountry : () => <Text>Loading...</Text>}
                        />

                        <View className="mt-auto pb-4">
                            <View className="mt-[15px] flex-row justify-center">
                                <Text className="font-primary mr-[5px]">Already have an account?</Text>
                                <Pressable onPress={() => router.push('/sign-in')}>
                                    <Text className="font-primary text-primary">Login!</Text>
                                </Pressable>
                            </View>
                        </View>
                            
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

}

export default Signup;