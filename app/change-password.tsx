import React, {useRef, useState} from 'react';
import { Text, View, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, Animated, Keyboard } from 'react-native';
import {SvgXml} from "react-native-svg";
import {logo} from '@/util/svg';
import PrimaryButton from "@/components/PrimaryButton"
import CustomInput from "@/components/CustomInput"
import {change_password} from "@/services/api"
import { AxiosResponse, AxiosError } from 'axios';
import {router} from "expo-router";
import {validate} from "@/util/validator"

interface InputsType {
    [key: string]: string;
}
interface ErrorsType {
    [key: string]: string;
}
const ChangePassword = () => {
    const [inputs, setInputs] = useState<InputsType>({
        email: "",
        current_password: "",
        password: "",
        confirm_password: ""
    });
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState<ErrorsType>({});
    const [isLoading, setLoading] = useState(false);
    const [msgType, setMsgType] = useState<'success' | 'error'>('error'); // Track message type

    const handleInputs = (name: string) => {
        return (value: string) => {
            setInputs(prevInputs => ({
                ...prevInputs,
                [name]: value,
                ...(name === 'password' ? { confirm_password: '' } : {}), // Clear confirm_password if name is password
            }));
            const rules = {
                [name]: 
                    name === 'current_password' ? 'required' : 
                    name === 'password' ? 'required|min:8|number|special' :
                    name === 'confirm_password' ? `required|match:password`:
                    'required'
            };
            const fieldErrors: ErrorsType = validate({password: inputs.password, [name]: value }, rules);
            //const fieldErrors:  ErrorsType = validate({ [name]: value }, rules);
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
    const handleMessage = (message: string, type: 'success' | 'error') => {
        setMsg(message);
        setMsgType(type); // Set message type (success or error)
    };

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
   
    const Submit = async () => {
        Keyboard.dismiss();
        setLoading(true);
        setErrors({});
        setMsg('');
        console.log(inputs);
        setTimeout(() => {
            change_password(inputs)
            .then(async (res: AxiosResponse) => {
                const {results, message} = res.data;
                setMsg(message);
                setMsgType('success');
                console.log(results);
                //router.push('/dashboard');
            }).catch((error: AxiosError<any>) => {
                setErrors({});
                setMsg('');
                setLoading(false); 
                if (error.response) {
                    let errors = error.response.data.error;
                    errors.email && handleErrors(errors.email, 'email');
                    errors.current_password && handleErrors(errors.current_password, 'current_password');
                    errors.password && handleErrors(errors.password, 'password');
                    errors.confirm_password && handleErrors(errors.confirm_password, 'confirm_password');
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
                    <Text
                        className="text-[16px] mb-2.5 font-primary text-center"
                        style={{ color: msgType === 'success' ? 'green' : 'red' }}
                    >
                        {msg}
                    </Text>

                    <View className="flex-1">
                        <CustomInput 
                            label="Old Password"
                            type="password"
                            value={inputs.current_password}
                            onChangeText={handleInputs("current_password")}
                            placeholder="Enter your current password"
                            error={errors.current_password}
                            name={"current_password"}
                            focusedInput={focusedInput} // Check if this input is focused
                            animatedBorderColor={focusedInput === "current_password" ? borderColor : "#EDF1F3"}
                            onFocus={() => handleFocus("current_password")} // Set focused input
                            onBlur={() => handleBlur("current_password")} // Clear focused input
                        />

                        <CustomInput 
                            label="New Password"
                            type="password"
                            value={inputs.password}
                            onChangeText={handleInputs("password")}
                            placeholder="Enter your new password"
                            error={errors.password}
                            name={"password"}
                            focusedInput={focusedInput} // Check if this input is focused
                            animatedBorderColor={focusedInput === "password" ? borderColor : "#EDF1F3"}
                            onFocus={() => handleFocus("password")} // Set focused input
                            onBlur={() => handleBlur("password")} // Clear focused input
                        />

                        <CustomInput 
                            label="Confirm New Password"
                            type="password"
                            value={inputs.confirm_password}
                            onChangeText={handleInputs("confirm_password")}
                            placeholder="Confirm New password"
                            error={errors.confirm_password}
                            name={"confirm_password"}
                            focusedInput={focusedInput} // Check if this input is focused
                            animatedBorderColor={focusedInput === "confirm_password" ? borderColor : "#EDF1F3"}
                            onFocus={() => handleFocus("confirm_password")} // Set focused input
                            onBlur={() => handleBlur("confirm_password")} // Clear focused input
                        />

                        
                        <PrimaryButton 
                            title="Change Password"
                            isLoading={isLoading} 
                            action={Submit}
                            disabled={
                                Object.values(errors).some(error => error) || // Check for errors
                                !inputs.current_password || // Ensure required inputs are filled
                                !inputs.password ||
                                !inputs.confirm_password
                            }
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default ChangePassword;