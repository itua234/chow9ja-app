import React, { useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, Keyboard,
    KeyboardAvoidingView, Platform, Pressable, StatusBar } from 'react-native';
import {SvgXml} from "react-native-svg";
import {logo, googleIcon, facebookIcon} from '@/util/svg';
import PrimaryButton from "@/components/PrimaryButton";
import SocialLoginButton from "@/components/SocialLoginButton";
import CustomInput from "@/components/CustomInput";
import {login} from "@/services/api"
import {storeData} from "@/util/helper"
import { AxiosResponse, AxiosError } from 'axios';
import {router} from "expo-router";

interface InputsType {
    [key: string]: string;
}
interface ErrorsType {
    [key: string]: string;
}
interface SigninProps {
    navigation?: any; 
}
interface UserData {
    results: {
        token: string;
    };
}
const Signin: React.FC<SigninProps> = ({}) => {
    const [inputs, setInputs] = useState<InputsType>({});
    const [msg, setMsg] = useState<string>('');
    const [errors, setErrors] = useState< ErrorsType>({});
    const [isLoading, setLoading] = useState<boolean>(false);

    const handleInputs = (name: string) => {
        return (value: string) => {
            setInputs(prevInputs => ({
                ...prevInputs,
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

    const Login = async () => {
        Keyboard.dismiss();
        setLoading(true);
        setErrors({});
        setMsg('');
        setTimeout(() => {
            login(inputs.email, inputs.password)
            .then(async(res: AxiosResponse) => {
                //setLoading(false);
                //const user: UserData = res.data?.results;
                console.log(res.data?.results.token);
                await storeData("user_token", res.data?.results.token);
                router.push('/dashboard');
            }).catch((error: AxiosError<any>) => {
                setErrors({});
                setMsg('');
                setLoading(false); 
                if (error.response) {
                    let errors = error.response.data.error;
                    errors.email && handleErrors(errors.email, 'email');
                    errors.password && handleErrors(errors.password, 'password');
                    if (error.response.status === 400 || error.response.status === 401) {
                        handleMessage(error.response.data.message);
                    }
                }
            })
        }, 100); // Delay submission 
    }

    const onGooglePress = async () => {
        alert("social button clicked")
    }
    const onFacebookPress = async () => {
        alert("social button clicked")
    }

    return (
        <SafeAreaView className="flex-1 bg-white pt-[20px]">
            <StatusBar
                animated={true}
                backgroundColor="#61dafb"
                networkActivityIndicatorVisible={false}
                hidden={false}
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
                            <Text className="text-[30px] font-primary font-bold text-[#2A0944] mb-2.5">Sign in to your Account</Text>
                            <Text className="font-primary text-[#6C7278]">Enter your email and password to login.</Text>
                        </View>
                        <Text className="text-[16px] text-red-500 mb-2.5 font-primary text-center">{msg}</Text>

                        <View className="flex-1">
                            <CustomInput 
                                label="Email"
                                type="email"
                                value={inputs.email}
                                onChangeText={handleInputs("email")}
                                placeholder="Enter your email"
                                error={errors.email}
                            />
                            
                            <CustomInput 
                                label="Password"
                                type="password"
                                value={inputs.password}
                                onChangeText={handleInputs("password")}
                                placeholder="Enter your password"
                                error={errors.password}
                            />
                            
                            <PrimaryButton 
                                title="Log In"
                                isLoading={isLoading} 
                                action={Login}
                                disabled={false}
                            />

                            <Pressable onPress={() => router.push('/forgot-password')}>
                                <Text className="text-primary font-primary text-right mt-[13px]">Forgot your Password?</Text>
                            </Pressable>
                        </View>

                        <View className="mt-auto pb-4">
                            <SocialLoginButton 
                                icon={googleIcon}
                                text="Continue with Google"
                                onPress={onGooglePress}
                            />
                            <SocialLoginButton 
                                icon={facebookIcon}
                                text="Continue with Facebook"
                                onPress={onFacebookPress}
                            />

                            <View className="mt-[15px] flex-row justify-center">
                                <Text className="font-primary mr-[5px]">Don't have an account?</Text>
                                <Pressable onPress={() => router.push('/sign-up')}>
                                    <Text className="font-primary text-primary">Signup!</Text>
                                </Pressable>
                            </View>
                        </View>
                            
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default Signin;