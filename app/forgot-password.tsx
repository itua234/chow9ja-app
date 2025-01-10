import React, {useState} from 'react';
import { Text, View, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
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
        };
    };
    const handleErrors = (error: string, input: string) => {
        setErrors(values => ({
            ...values, 
            [input]: error
        }));
    }
    const handleMessage = (message: string) => setMsg(message);

    const Submit = async () => {
        setLoading(true);
        setErrors({});
        setMsg('');
        const rules = {
            email: 'required|email'
        };
        const errors:  ErrorsType = validate(inputs, rules);
        Object.keys(errors).length > 0
        ? (console.log('Validation errors:', errors), errors.email && handleErrors(errors.email, 'email'))
        : console.log('All inputs are valid!'); // Proceed with form submission logic, e.g., send data to an API

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