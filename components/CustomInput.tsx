import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps, Animated } from 'react-native';
import {SvgXml} from "react-native-svg";
import {eye, eye_off} from "@/util/svg";

// type InputModeType = 'email' | 'numeric' | 'tel' | 'text';
// type KeyboardType = 'email-address' | 'numeric' | 'phone-pad' | 'default';
// type AutoCapitalizeType = 'none' | 'sentences' | 'words' | 'characters';

//type CustomInputProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
type CustomInputProps = TextInputProps & {
    label?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'phone';  // Input type
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;
    name?: string;
    focusedInput?: string | null;
    animatedBorderColor?: Animated.AnimatedInterpolation<string>;
    onFocus?: () => void;
    onBlur?: () => void;
}
const CustomInput: React.FC<CustomInputProps> = ({ 
    label, 
    type = 'text', 
    value, 
    onChangeText, 
    placeholder, 
    className,
    error,
    name,
    focusedInput,
    animatedBorderColor,
    onFocus,
    onBlur,
    ...props
}) => {
    const [seePassword, setSeePassword] = useState<boolean>(false);
    // Determine input mode and secure text entry based on type
    const getInputProps = (): Partial<TextInputProps> => {
        switch(type) {
        case 'email':
            return {
                keyboardType: 'email-address',
                autoCapitalize: 'none',
            };
        case 'password':
            return {
                secureTextEntry: !seePassword,
            };
        case 'number':
            return {
                keyboardType: 'numeric',
            };
        case 'phone':
            return {
                keyboardType: 'phone-pad',
            };
        default:
            return {};
        }
    };

    const renderIcon = () => {
        if (type !== 'password') return null;

        return (
            <TouchableOpacity 
                onPress={() => setSeePassword(!seePassword)} 
                className="pr-4"
            >
                {<SvgXml xml={seePassword ? eye : eye_off} width="24" height="24"></SvgXml>}
            </TouchableOpacity>
        );
    };

    return (
        <View className="">
            {label && (
                <Text className="text-[#1A1C1E] mb-2 mt-[7.5px] font-primary">
                    {label}
                </Text>
            )}
            <Animated.View 
            className={`
                flex-row 
                items-center 
                border-2 
                rounded-md ${className}
            `}
            style={{ borderColor: animatedBorderColor || '#EDF1F3' }}>
                <TextInput
                    className="flex-1 py-5 px-[15px] font-primary text-[#1A1C1E] text-[16px]"
                    placeholder={placeholder}
                    placeholderTextColor={"#6C7278"}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    {...getInputProps()}
                    {...props}
                />
                {renderIcon()}
            </Animated.View>
            {error && <Text className="text-[16px] text-red-500 mt-1 font-primary">{error}</Text>}
        </View>
    );
};

export default CustomInput;