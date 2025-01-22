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
import { 
    UserData ,
    ApiResponse
} from "@/util/types";
import {
    GoogleSignin,
    GoogleSigninButton,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});
console.log("ios", process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID);
console.log("web", process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID)

interface InputsType {
    [key: string]: string;
}
interface ErrorsType {
    [key: string]: string;
}
interface LoginResponse {
    message: string;
    results: UserData;
    error: boolean;
}
const Signin = () => {
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
                duration: 100,
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
            duration: 100,
            useNativeDriver: false,
        }).start();
    };
    const handleBlur = (name: string) => {
        setFocusedInput(null);
        Animated.timing(animatedBorderColor, {
            toValue: 0,
            duration: 100,
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
        handleMessage('');
        setTimeout(() => {
            login(inputs.email, inputs.password)
            .then(async (res: AxiosResponse<LoginResponse>) => {
                const user: UserData = res.data?.results;
                await storeData("user_token", user?.token);
                router.push('/dashboard');
            }).catch((error: AxiosError<any>) => {
                setErrors({});
                handleMessage('');
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
        alert("social button clicked");
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
              //setState({ userInfo: response.data });
              console.log("userInfo", response.data);
            } else {
              // sign in was cancelled by user
            }
          } catch (error) {
            if (isErrorWithCode(error)) {
              switch (error.code) {
                case statusCodes.IN_PROGRESS:
                  // operation (eg. sign in) already in progress
                  break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                  // Android only, play services not available or outdated
                  break;
                default:
                // some other error happened
              }
            } else {
              // an error that's not related to google sign in occurred
            }
          }
    }
    const onFacebookPress = async () => {
        alert("social button clicked")
    }

    return (
        <SafeAreaView className="flex-1 bg-white pt-[20px]">
            <StatusBar
                animated={true}
                backgroundColor="#61dafb"
                barStyle="dark-content" // Ensures black text for iOS
                networkActivityIndicatorVisible={true}
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
                                disabled={isLoading}
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