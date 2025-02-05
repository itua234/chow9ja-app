import React, { lazy, useCallback, Suspense, useState, useEffect } from 'react';
import { Text, View, SafeAreaView, ScrollView, Keyboard,
    KeyboardAvoidingView, Platform, Pressable, StatusBar, 
    Animated} from 'react-native';
import {SvgXml} from "react-native-svg";
import SocialLoginButton from "@/components/SocialLoginButton";
import CustomInput from "@/components/CustomInput";
import {logo, googleIcon, facebookIcon} from '@/util/svg';
import PrimaryButton from "@/components/PrimaryButton";
import {login, google_login} from "@/api"
import {storeData} from "@/util/helper"
import { AxiosResponse, AxiosError } from 'axios';
import {router} from "expo-router";
import { User } from "@/models/User";
import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes
} from '@react-native-google-signin/google-signin';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/reducers/store';
import { setError, clearErrors, setApiErrors, setInputAndValidate, resetForm } from '@/reducers/form/formSlice';
import { setUser, setisAuthenticated } from '@/reducers/auth/authSlice';
//const {GoogleSignin} = React.lazy(() => import('@react-native-google-signin/google-signin'));
// const SvgXml = lazy(() => import('react-native-svg').then(module => ({ default: module.SvgXml })));
// const SocialLoginButton = lazy(() => import('@/components/SocialLoginButton'));
// const CustomInput = lazy(() => import('@/components/CustomInput'));
import useInputAnimation from '@/hooks/useInputAnimation';
import * as AppleAuthentication from 'expo-apple-authentication';

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

interface LoginResponse {
    message: string;
    results: User;
    error: boolean;
}
const Signin = () => {
    const inputs = useSelector((state: RootState) => state.form.inputs);
    const errors = useSelector((state: RootState) => state.form.errors);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(resetForm()); // Reset form state when component mounts
        return () => {
            dispatch(resetForm()); // Reset form state when component unmounts
        };
    }, [dispatch]);

    const [msg, setMsg] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);

    const { 
        focusedInput, 
        borderColor, 
        handleFocus, 
        handleBlur,
        animatedBorderColor
    } = useInputAnimation();

    const handleInputs = (name: string) => {
        return (value: string) => {
            const rules = {
                [name]: name === 'email' ? 'required|email' : 'required'
            };
            dispatch(setInputAndValidate({field: name, value, rules}));
            const hasError = !!errors[name];
            // Update border color animation
            Animated.timing(animatedBorderColor, {
                toValue: hasError ? 2 : focusedInput === name ? 1 : 0, // Error: 2, Focused: 1, Default: 0
                duration: 100,
                useNativeDriver: false,
            }).start();
        };
    };
    const handleErrors = (error: string, input: string) => {
        dispatch(setError({field: input, error }));
    }
    const handleMessage = (message: string) => setMsg(message);

    const Login = async () => {
        Keyboard.dismiss();
        setLoading(true);
        //dispatch(clearErrors());
        handleMessage('');
        setTimeout(() => {
            login(inputs.email, inputs.password)
            .then(async (res: AxiosResponse<LoginResponse>) => {
                setLoading(false);
                const user: User = res.data?.results;
                await storeData("user_token", user?.token);
                await storeData("refresh_token", user?.refresh_token);
                await storeData('isFirstTime', 'false');
                // Dispatch the user and set authentication status
                dispatch(setUser(user));
                dispatch(setisAuthenticated(true));
                router.push('/dashboard');
            }).catch((error: AxiosError<any>) => {
                dispatch(clearErrors());
                handleMessage('');
                setLoading(false); 
                if (error.response) {
                    let errors = error.response.data.error;
                    if (errors) {
                        dispatch(setApiErrors(errors));
                        //errors.email && handleErrors(errors.email, 'email');
                        //errors.password && handleErrors(errors.password, 'password');
                    }
                    if (error.response.status === 400 || error.response.status === 401) {
                        handleMessage(error.response.data.message);
                    }
                }
            })
        }, 100); // Delay submission 
    }

    const onGooglePress = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                let payload = {
                    email: response.data.user.email,
                    firstname: response.data.user.familyName?.split(" ")[0] ||  null,
                    lastname: response.data.user.givenName,
                    photo: response.data.user.photo,
                    googleId: response.data.user.id,
                }
                google_login(payload)
                .then(async (res: AxiosResponse<LoginResponse>) => {
                    const user: User = res.data?.results;
                    //console.log("User from Google Login:", user);
                    await storeData("user_token", user?.token);
                    await storeData("refresh_token", user?.refresh_token);
                    await storeData('isFirstTime', 'false');
                    // Dispatch the user and set authentication status
                    dispatch(setUser(user));
                    dispatch(setisAuthenticated(true));
                    router.push('/(tabs)');
                }).catch((error: AxiosError<any>) => {
                    handleMessage('');
                    if (error.response) {
                        if (error.response.status === 400 || error.response.status === 401) {
                            handleMessage(error.response.data.message);
                        }
                    }
                })
            } else {
              // sign in was cancelled by user
            }
        } catch (error: any) {
            console.error("Sign-In Error", error);
            if (isErrorWithCode(error)) {
              switch (error.code) {
                case statusCodes.SIGN_IN_CANCELLED:
                    console.log("User cancelled the sign-in process")
                  // Android only, play services not available or outdated
                  break;
                case statusCodes.IN_PROGRESS:
                    console.log("Sign-in process is in progress");
                  // operation (eg. sign in) already in progress
                  break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    console.log("Google Play services not available.")
                  // Android only, play services not available or outdated
                  break;
                default:
                    console.log('Unknown error:', error);
                // some other error happened
              }
            } else {
              // an error that's not related to google sign in occurred
            }
        }
    };
    const onFacebookPress = async () => {
        //router.push("/dashboard");
        const signOut = async () => {
            try {
                await GoogleSignin.signOut();
                dispatch(setUser(null));
                dispatch(setisAuthenticated(false));
                console.log("user has been signed out of google");
            } catch (error) {
                console.error(error);
            }
        };
    };
    const handleAppleSignIn = async () => {
        if(Platform.OS === "ios"){
            try {
                const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                });
                // Handle the credential (e.g., send it to your backend for verification)
                //setUserInfo(credential);
                console.log('Apple Sign-In successful:', credential);
            }catch (error: any) {
                if (error.code === 'ERR_CANCELED') {
                    console.log('Apple Sign-In was canceled by the user.');
                } else {
                    console.error('Apple Sign-In failed:', error);
                }
            }
        }
    };
    const handleAppleSignOut = async () => {
        try {
            //await AppleAuthentication.signOutAsync();
            //setUserInfo(null);
            console.log('Apple Sign-Out successful');
        } catch (error) {
          console.error('Apple Sign-Out failed:', error);
        }
    };
    // const isAppleSignInAvailable = await AppleAuthentication.isAvailableAsync();
    // if (isAppleSignInAvailable) {
    // // Apple Sign-In is available
    // } else {
    // // Apple Sign-In is not available
    // }
    
    return (
        <SafeAreaView className="flex-1 bg-white pt-[20px]">
            <StatusBar
                animated={true}
                backgroundColor="#fff"
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
                                <Text className="text-primary font-primary text-right mt-[15px]">Forgot your Password?</Text>
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
                            {/* <AppleAuthentication.AppleAuthenticationButton
                                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                                cornerRadius={5}
                                style={{ width: 200, height: 44 }}
                                onPress={handleAppleSignIn}
                            /> */}

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