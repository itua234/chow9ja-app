import React, {useRef, useState} from 'react';
import { Text, View, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, Animated } from 'react-native';
import {SvgXml} from "react-native-svg";
import {logo} from '@/util/svg';
import PrimaryButton from "@/components/PrimaryButton"
import CustomInput from "@/components/CustomInput"
import {login} from "@/services/api"
import {validate} from "@/util/validator"

interface InputsType {
    [key: string]: string;
}
interface ErrorsType {
    [key: string]: string;
}
const ForgetPassword = () => {
    const [inputs, setInputs] = useState<InputsType>({email: ""});
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState<ErrorsType>({});
    //const [touched, setTouched] = useState<{[key: string]: boolean}>({});
    const [isLoading, setLoading] = useState(false);

    const handleInputs = (name: string) => {
        return (value: string) => {
            setInputs(prevInputs => ({
                ...prevInputs,
                [name]: value
            }));
            // const rules = {
            //     [name]: name === 'email' ? 'required|email' : 'required'
            // };
            const rules = {
                [name]: 
                    name === "email" ? "required|email" : 
                    name === "password" ? "required|min:6" : 
                    name === "phone" ? "required|numeric|min:10|max:15" : 
                    "required", // Default to "required" for all other fields
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

    const Submit = async () => {
        setLoading(true);
        setErrors({});
        setMsg('');
        // const rules = {
        //     email: 'required|email'
        // };
        // const errors:  ErrorsType = validate(inputs, rules);
        // Object.keys(errors).length > 0
        // ? (console.log('Validation errors:', errors), errors.email && handleErrors(errors.email, 'email'))
        // : console.log('All inputs are valid!'); // Proceed with form submission logic, e.g., send data to an API

        setLoading(false);
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
                <View className="px-[17.5] flex-1">
                    <SvgXml xml={logo} width="101" height="40"></SvgXml>
                    <View className="mb-30">
                        <Text className="text-[30px] font-primary font-bold text-[#2A0944] mb-2.5">Forgot Your Password</Text>
                        <Text className="font-primary text-[#6C7278]">Enter your valid email address and we will share a link to create a new password.</Text>
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
                            name={"email"}
                            focusedInput={focusedInput} // Check if this input is focused
                            animatedBorderColor={focusedInput === "email" ? borderColor : "#EDF1F3"}
                            onFocus={() => handleFocus("email")} // Set focused input
                            onBlur={() => handleBlur("email")} // Clear focused input
                        />

                        <CustomInput 
                            label="Password"
                            type="text"
                            value={inputs.password}
                            onChangeText={handleInputs("password")}
                            placeholder="Enter your password"
                            error={errors.password}
                            name={"password"}
                            focusedInput={focusedInput} // Check if this input is focused
                            animatedBorderColor={focusedInput === "password" ? borderColor : "#EDF1F3"}
                            onFocus={() => handleFocus("password")} // Set focused input
                            onBlur={() => handleBlur("password")} // Clear focused input
                        />
                        
                        <PrimaryButton 
                            title="Reset Password"
                            isLoading={isLoading} 
                            action={Submit}
                            disabled={false}
                        />
                    </View>
                        
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default ForgetPassword;