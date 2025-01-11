import React, { useRef, useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, Keyboard,
    KeyboardAvoidingView, Platform, Pressable, StatusBar, 
    Animated} from 'react-native';
import {SvgXml} from "react-native-svg";
import {logo, googleIcon, facebookIcon} from '@/util/svg';
import PrimaryButton from "@/components/PrimaryButton";
import SocialLoginButton from "@/components/SocialLoginButton";
import CustomInput from "@/components/CustomInput";
import {login} from "@/services/api"
import {storeData} from "@/util/helper"
import { AxiosResponse, AxiosError } from 'axios';
import {router} from "expo-router";
import {validate} from "@/util/validator"

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
interface LoginResponse {
    message: string;
    results: UserData;
    error: boolean;
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
            const rules = {
                [name]: name === 'email' ? 'required|email' : 'required'
            };
            const fieldErrors:  ErrorsType = validate({ [name]: value }, rules);
            const hasError = !!fieldErrors[name];
            // Clear error if input becomes valid, or set new error
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: fieldErrors[name] || ''
            }));
            // Update border color animation
            Animated.timing(animatedBorderColor, {
                toValue: hasError ? 2 : focusedInput === name ? 1 : 0, // Error: 2, Focused: 1, Default: 0
                duration: 300,
                useNativeDriver: false,
            }).start();
        };
    };
    const handleErrors = (error: string, input: string) => {
        setErrors(values => ({
            ...values, 
            [input]: error
        }));
    }
    const handleMessage = (message: string) => setMsg(message);

    const animatedBorderColor = useRef(new Animated.Value(0)).current;
    const [focusedInput, setFocusedInput] = useState<string | null>(null); // Track focused input
    // Handle focus and blur animations
    const handleFocus = (name: string) => {
        setFocusedInput(name);
        Animated.timing(animatedBorderColor, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };
    const handleBlur = (name: string) => {
        setFocusedInput(null);
        Animated.timing(animatedBorderColor, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };
    // Interpolated border color based on focus
    const borderColor = animatedBorderColor.interpolate({
        inputRange: [0, 1, 2], // 0 = default, 1 = focus, 2 = error
        outputRange: ['#EDF1F3', '#121212', 'red'], // Default, focused, error
    });

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
            {/* <StatusBar
                animated={true}
                backgroundColor="#61dafb"
                networkActivityIndicatorVisible={false}
                hidden={false}
            /> */}
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
                                name="email"
                                focusedInput={focusedInput} // Check if this input is focused
                                animatedBorderColor={focusedInput === "email" ? borderColor : "#EDF1F3"}
                                onFocus={() => handleFocus("email")} // Set focused input
                                onBlur={() => handleBlur("email")} // Clear focused input
                            />
                            
                            <CustomInput 
                                label="Password"
                                type="password"
                                value={inputs.password}
                                onChangeText={handleInputs("password")}
                                placeholder="Enter your password"
                                error={errors.password}
                                name="password"
                                focusedInput={focusedInput} // Check if this input is focused
                                animatedBorderColor={focusedInput === "password" ? borderColor : "#EDF1F3"}
                                onFocus={() => handleFocus("password")} // Set focused input
                                onBlur={() => handleBlur("password")} // Clear focused input
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