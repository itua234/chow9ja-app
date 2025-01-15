import { useState, useRef, useEffect } from 'react';
import { TextInput } from 'react-native';

interface UseOTPProps {
  length: number;
}

export const useOTP = ({ length }: UseOTPProps) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const [focusedInput, setFocusedInput] = useState<number | null>(null);
    const inputs = [...Array(length)].map(() => useRef<TextInput>(null));

    const handleOTPInputChange = (index: number, value: string, key?: string) => {
        const newOtp = [...otp];
        if (key === 'Backspace' && value === '' && index > 0) {
            newOtp[index] = '';
            inputs[index - 1]?.current?.focus();
        } else {
            newOtp[index] = value;
            if (value !== '' && index < length - 1 && inputs[index + 1]?.current) {
                inputs[index + 1]?.current?.focus();
            }
        }
        setOtp(newOtp);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputs[0].current) {
                inputs[0].current?.focus();
            }
        }, 100); // Small delay can help with rendering

        return () => clearTimeout(timer);
    }, []);

    return {
        otp,
        focusedInput,
        inputs,
        setFocusedInput,
        handleOTPInputChange,
        isComplete: otp.every((digit) => digit !== '')
    };
};