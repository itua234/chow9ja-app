import React, {useState} from 'react';
import { Text, View, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, Animated, Keyboard } from 'react-native';
import {SvgXml} from "react-native-svg";
import {logo} from '@/util/svg';
import PrimaryButton from "@/components/PrimaryButton"
import CustomInput from "@/components/CustomInput"
import CustomAlert from "@/components/ui/CustomAlert"
import {forgot_password} from "@/api"
import { AxiosResponse, AxiosError } from 'axios';
import {validate} from "@/util/validator"
import useInputAnimation from '@/hooks/useInputAnimation';

interface InputsType {
    [key: string]: string;
}
interface ErrorsType {
    [key: string]: string;
}
const ForgetPassword = () => {
    const [inputs, setInputs] = useState<InputsType>({email: ""});
    const [errors, setErrors] = useState<ErrorsType>({});
    const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isLoading, setLoading] = useState(false);

    const { 
        focusedInput, 
        borderColor, 
        handleFocus, 
        handleBlur,
        animatedBorderColor
    } = useInputAnimation();

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
                useNativeDriver: false
            }).start();
        };
    };
    const handleErrors = (error: string, input: string) => {
        setErrors(values => ({
            ...values, 
            [input]: error
        }));
    }
    const handleMessage = (text: string, type: 'success' | 'error') => setMsg({text, type});
   
    const Submit = async () => {
        Keyboard.dismiss();
        setLoading(true);
        setErrors({});
        setMsg(null);
        setTimeout(() => {
            forgot_password(inputs.email)
            .then(async (res: AxiosResponse) => {
                const {results, message} = res.data;
                setLoading(false);
                handleMessage(message, 'success');
                console.log(results);
                // Automatically hide the banner after 6 seconds
                setTimeout(() => {
                    setMsg(null);
                }, 6000);
            }).catch((error: AxiosError<any>) => { 
                setErrors({});
                setMsg(null);
                setLoading(false); 
                if (error.response) {
                    let errors = error.response.data.error;
                    errors.email && handleErrors(errors.email, 'email');
                    if (error.response.status === 400 || error.response.status === 401) {
                        handleMessage(error.response.data.message, 'error');
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
            {msg && (<CustomAlert msg={msg}/>)}
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="px-[17.5] flex-1">
                    <SvgXml xml={logo} width="101" height="40"></SvgXml>
                    <View className="mb-30">
                        <Text className="text-[30px] font-primary font-bold text-[#2A0944] mb-2.5">Forgot Your Password</Text>
                        <Text className="font-primary text-[#6C7278]">Enter your valid email address and we will share a link to create a new password.</Text>
                    </View>

                    <View className="flex-1 mt-2.5">
                        <CustomInput 
                            label="Email"
                            type="email"
                            value={inputs.email}
                            onChangeText={handleInputs("email")}
                            placeholder="Enter your email"
                            error={errors.email}
                            name={"email"}
                            focusedInput={focusedInput} // Check if this input is focused
                            animatedBorderColor={focusedInput === "email" ? borderColor : "#EDF1F3"}
                            onFocus={() => handleFocus("email")} // Set focused input
                            onBlur={() => handleBlur("email")} // Clear focused input
                        />
                        
                        <PrimaryButton 
                            title="Reset Password"
                            isLoading={isLoading} 
                            action={Submit}
                            disabled={
                                Object.values(errors).some(error => error) || // Check for errors
                                !inputs.email // Ensure required inputs are filled
                            }
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default ForgetPassword;