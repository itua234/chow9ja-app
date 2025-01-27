import React, { useState } from 'react';
import { View, SafeAreaView, Text, Alert, Pressable, 
    TouchableWithoutFeedback, Keyboard, TextInput, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import {SvgXml} from "react-native-svg";
import {logo} from '@/util/svg';
import PrimaryButton from "@/components/PrimaryButton"
import { AxiosResponse, AxiosError } from 'axios';
import { useLocalSearchParams, router } from "expo-router";
import { send_code, verify_code } from "@/api"
import { storeData } from '@/util/helper';
import { useOTP } from '../hooks/useOTP';
import { useResendTimer } from '../hooks/useResendTimer';

const VerifyEmail = () => {
    const { email = "" } = useLocalSearchParams();
    const [isLoading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string>('');
    const [errors, setErrors] = useState({});

    const handleErrors = (error: string, input: string) => {
        setErrors(values => ({
            ...values, 
            [input]: error
        }));
    }
    const handleMessage = (message: string) => setMsg(message);

    const { 
        otp, 
        focusedInput, 
        inputs, 
        setFocusedInput, 
        handleOTPInputChange,
        isComplete 
    } = useOTP({ length: 4 });
    
    const {
        resendIsDisabled,
        formattedTime,
        resetTimer
    } = useResendTimer(120);

    const Verify = async () => {
        Keyboard.dismiss();
        setLoading(true);
        handleMessage('');
        const filledInputs = otp.every((digit) => digit !== '');
        if(filledInputs){
            const otpValue = otp.join('');
            setTimeout(() => {
                verify_code(email as string, otpValue, "email_verification")
                .then(async (res: AxiosResponse) => {
                    setLoading(false);
                    await storeData("user_token", res.data?.results?.token);
                    router.push('/dashboard');
                }).catch((error: AxiosError<any>) => {
                    handleMessage('');
                    setLoading(false); 
                    if (error.response) {
                        let errors = error.response.data.error;
                        errors.email && handleErrors(errors.email, 'email');
                        if (error.response.status === 400 || error.response.status === 401) {
                            handleMessage(error.response.data.message);
                        }
                    }
                })
            }, 100); // Delay submission 
        } else {
            Alert.alert('Error', 'Please fill all OTP fields');
        }
    }

    const ResendCode = async () => {
        setLoading(true);
        handleMessage('');
        setTimeout(() => {
            send_code(email as string, "email_verification")
            .then((res: AxiosResponse) => {
                console.log(res.data?.results);
                setLoading(false);
                // Reset timer and disable resend button
                resetTimer();
                // Show success message if provided in response
                if (res.data?.message) {
                    handleMessage(res.data.message);
                }
            }).catch((error: AxiosError<any>) => {
                handleMessage('');
                setLoading(false); 
                if (error.response) {
                    let errors = error.response.data.error;
                    errors.email && handleErrors(errors.email, 'email');
                    if (error.response.status === 400 || error.response.status === 401) {
                        handleMessage(error.response.data.message);
                    }
                }
            });
        }, 100); // Delay submission 
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
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
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="px-[17.5] flex-1">
                        <SvgXml xml={logo} width="101" height="40"></SvgXml>
                        <View className="mb-30">
                            <Text className="text-[30px] font-primary font-bold text-[#2A0944] mb-2.5">Verify your email address.</Text>
                            <Text className="font-primary text-[#6C7278]">A verification code has been sent to your email: {email}. Enter the code to continue</Text>
                        </View>
                        <Text className="text-[16px] text-red-500 mb-2.5 font-primary text-center">{msg}</Text>

                        <View className="flex-1">
                            <View className="flex-row justify-center items-center">
                                {[...Array(4).keys()].map((index) => (
                                    <TextInput
                                        key={index}
                                        ref={inputs[index]}
                                        className={`border-2 ${
                                            focusedInput == index
                                                ? 'border-primary' 
                                                : 'border-[#89ABD940]'
                                        } rounded-[5px] w-[60px] h-[60px] m-[5px] text-center text-[20px] font-primary text-primary`}
                                        onFocus={() => setFocusedInput(index)}
                                        onBlur={() => setFocusedInput(null)}
                                        maxLength={1}
                                        keyboardType="numeric"
                                        value={otp[index]}
                                        onChangeText={(text) => handleOTPInputChange(index, text)}
                                        onKeyPress={({ nativeEvent: { key } }) => {
                                            if (key === 'Backspace') {
                                                handleOTPInputChange(index, '', key);
                                            }
                                        }}
                                    />
                                ))}
                            </View>

                            <View className="mt-[15px] flex-row justify-center mb-[20px]">
                                <Text className="font-primary mr-[5px]">Did not receive the code?</Text>
                                <Pressable onPress={ResendCode} disabled={resendIsDisabled}>
                                    <Text className="font-primary text-primary">Resend Code</Text>
                                </Pressable>
                                <Text className="font-primary ml-[5px]">
                                    in {formattedTime}
                                </Text>
                            </View>
                            
                            <PrimaryButton 
                                title="Continue"
                                isLoading={isLoading} 
                                action={Verify}
                                disabled={!isComplete}
                            />
                        </View>
                            
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default VerifyEmail;