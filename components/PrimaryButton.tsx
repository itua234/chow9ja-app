import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';

interface PrimaryButtonProps {
    title: string;
    action: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    style?: string
}
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    action,
    //variant
    disabled = false,
    isLoading = false
}) => {
    return (
        <TouchableOpacity 
            onPress={action} 
            disabled={disabled}
            className={`
                ${disabled ? 'opacity-50' : ''}
            `}
        >
            <View className={`
                py-5
                px-[15px] 
                bg-primary 
                rounded-[15px] 
                mt-5 
                flex 
                items-center 
                justify-center
                ${disabled ? 'bg-disabled' : ''}
            `}>
                {isLoading ? (
                    <Image
                        className="w-[25px] h-[25px]"
                        source={require('../assets/loader.gif')}
                    />
                ) : (
                    <Text className={`
                        text-center 
                        text-white 
                        font-primary
                        text-[16px]
                        ${disabled ? 'text-white' : ''}
                    `}>
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default PrimaryButton;