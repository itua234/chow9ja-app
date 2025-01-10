import React, { useState, useRef, useEffect } from 'react';
import { View, SafeAreaView, Text, Alert, Pressable, 
    TouchableWithoutFeedback, Keyboard, TextInput, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import {SvgXml, SvgUri} from "react-native-svg";
import {logo} from '@/util/svg';
import PrimaryButton from "@/components/PrimaryButton"
import { AxiosResponse, AxiosError } from 'axios';
import { useLocalSearchParams, router } from "expo-router";
import { send_code, verify_code } from "@/services/api"

const VerifyEmail = () => {
    const { email = "" } = useLocalSearchParams();
    const [isLoading, setLoading] = useState(false);
    const [resendIsDisabled, setResendIsDisabled] = useState(true);
    const [msg, setMsg] = useState<string>('');
    const [errors, setErrors] = useState({});
    const [timer, setTimer] = useState<number>(120);
    const [focusedInput, setFocusedInput] = useState<number | null>(null);
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputs = [...Array(4)].map(() =>useRef<TextInput>(null));

    const handleErrors = (error: string, input: string) => {
        setErrors(values => ({
            ...values, 
            [input]: error
        }));
    }
    const handleMessage = (message: string) => setMsg(message);

    useEffect(() => {
        const countdown = setInterval(() => {
            if (timer > 0) {
                setTimer((prevTimer) => prevTimer - 1);
            } else {
                clearInterval(countdown);
                setResendIsDisabled((resendIsDisabled) => !resendIsDisabled);
            }
        }, 1000);
        return () => clearInterval(countdown);
    }, [timer]);
    // Convert remaining time to minutes and seconds
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    
    // Function to handle OTP input
    const handleOTPInputChange = (index: number, value: string, key?: string) => {
        const newOtp = [...otp];
        // If backspace is pressed and the current input is empty
        if (key === 'Backspace' && value === '' && index > 0) {
            //Clear the current input
            newOtp[index] = '';
            // Focus on the previous input
            if (inputs[index - 1]?.current) {
                inputs[index - 1]?.current?.focus();
            }
        }else {
            // Focus on the next TextInput if a value is entered
            newOtp[index] = value;
            // Focus on the next TextInput if a value is entered
            if(value !== '' && index < 3 && inputs[index + 1]?.current) {
                inputs[index + 1]?.current?.focus();
            }
        }
        setOtp(newOtp);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if(inputs[0].current) {
                inputs[0].current?.focus();
            }
        }, 100); // Small delay can help with rendering

        return () => clearTimeout(timer);
    }, []);

    const Verify = async () => {
        setLoading(true);
        const filledInputs = otp.every((digit) => digit !== '');
        if(filledInputs){
            const otpValue = otp.join('');
            console.log(otpValue);

            //Keyboard.dismiss();
            setMsg('');
            setTimeout(() => {
                verify_code(email as string, otpValue, "email_verification")
                .then(async(res: AxiosResponse) => {
                    //setLoading(false);
                    //await storeData("user_token", res.data?.results.token);
                    //navigation.navigate('Dashboard');
                    console.log(res.data?.results);
                }).catch((error: AxiosError<any>) => {
                    setMsg('');
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
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
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
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="px-[17.5] flex-1">
                        <View className="h-[7.5] w-full rounded-[20px] flex-row">
                            <View className="bg-[#F5E8B7] h-full rounded-l-[20px] w-[20%]"></View>
                            <View className="bg-[#89ABD940] h-full rounded-r-[20px] w-[80%]"></View>
                        </View>
                        <View className="flex-row justify-end">
                            <Text className="font-semibold font-primary text-[#89ABD940]">20%</Text>
                        </View>
                        <SvgXml xml={logo} width="101" height="40"></SvgXml>
                        <View className="mb-30">
                            <Text className="text-[30px] font-primary font-bold text-[#2A0944] mb-2.5">Verify your email address.</Text>
                            <Text className="font-primary text-[#6C7278]">A verification code has been sent to your email: {email}. Enter the code to continue</Text>
                        </View>
                        <Text className="text-[16px] text-red-500 mb-2.5 font-primary text-center">{msg}</Text>

                        <View className="flex-1">
                            <View className="flex-row justify-center items-center">
                                {[0, 1, 2, 3].map((index) => (
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

                            <View className="mt-[15px] flex-row justify-center">
                                <Text className="font-primary mr-[5px]">Did not receive the code?</Text>
                                <Pressable onPress={ResendCode} disabled={resendIsDisabled}>
                                    <Text className="font-primary text-primary">Resend Code</Text>
                                </Pressable>
                                <Text className="font-primary ml-[5px]">
                                    in {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
                                </Text>
                            </View>
                            
                            <PrimaryButton 
                                title="Continue"
                                isLoading={isLoading} 
                                action={Verify}
                                disabled={otp.some(digit => digit === '')}
                            />
                        </View>
                            
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default VerifyEmail;