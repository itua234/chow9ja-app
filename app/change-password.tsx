import React, {useEffect, useRef, useState} from 'react';
import { Text, View, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, Animated, Keyboard } from 'react-native';
import {SvgXml} from "react-native-svg";
import {logo} from '@/util/svg';
import PrimaryButton from "@/components/PrimaryButton"
import CustomInput from "@/components/CustomInput"
import {change_password} from "@/api"
import { AxiosResponse, AxiosError } from 'axios';
import {router} from "expo-router";
import useInputAnimation from '@/hooks/useInputAnimation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/reducers/store';
import { setError, clearErrors, setApiErrors, setChangePasswordInput, resetForm } from '@/reducers/form/formSlice';


const ChangePassword = () => {
    const inputs = useSelector((state: RootState) => state.form.inputs);
    const errors = useSelector((state: RootState) => state.form.errors);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(resetForm()); // Reset form state when component mounts
        return () => {
            dispatch(resetForm()); // Reset form state when component unmounts
        };
    }, [dispatch]);
   
    const [isLoading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const { 
        focusedInput, 
        borderColor, 
        handleFocus, 
        handleBlur,
        animatedBorderColor
    } = useInputAnimation();

    const handleInputs = (name: string) => {
        return (value: string) => {
            dispatch(setChangePasswordInput({field: name, value, inputs}));
            const hasError = !!errors[name];
            // Update border color animation
            Animated.timing(animatedBorderColor, {
                toValue: hasError ? 2 : focusedInput === name ? 1 : 0, // Error: 2, Focused: 1, Default: 0
                duration: 300,
                useNativeDriver: false,
            }).start();
        };
    };
    const handleErrors = (error: string, input: string) => {
        dispatch(setError({field: input, error }));
    }
    const handleMessage = (text: string, type: 'success' | 'error') => setMsg({text, type});
   
    const Submit = async () => {
        Keyboard.dismiss();
        setLoading(true);
        dispatch(clearErrors());
        setMsg(null);
        console.log(inputs);
        setTimeout(() => {
            change_password(inputs)
            .then(async (res: AxiosResponse) => {
                const {results, message} = res.data;
                handleMessage(message, 'success');
                console.log(results);
                //router.push('/dashboard');
            }).catch((error: AxiosError<any>) => {
                dispatch(clearErrors());
                setMsg(null);
                setLoading(false); 
                if (error.response) {
                    let errors = error.response.data.error;
                    if (errors) {
                        dispatch(setApiErrors({errors}));
                    }
                    // errors.email && handleErrors(errors.email, 'email');
                    // errors.current_password && handleErrors(errors.current_password, 'current_password');
                    // errors.password && handleErrors(errors.password, 'password');
                    // errors.confirm_password && handleErrors(errors.confirm_password, 'confirm_password');
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
                    {msg &&  
                        <Text
                            className="text-[16px] mb-2.5 font-primary text-center"
                            style={{ color: msg.type === 'success' ? 'green' : 'red' }}
                        >
                            {msg.text}
                    </Text>}

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