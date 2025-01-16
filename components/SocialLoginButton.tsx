import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import {SvgXml} from "react-native-svg";

interface SocialLoginButtonProps {
    icon: string;
    text: string;
    onPress: () => void;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string
}
const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  icon, 
  text, 
  onPress, 
  backgroundColor = 'white', 
  textColor = 'black',
  borderColor = '#EDF1F3'
}) => {
   return (
        <TouchableOpacity 
        onPress={onPress}
        className={`flex-row items-center justify-center border-2 rounded-[15px] mb-3.5 py-5 px-[15px]`}
        style={[
            { 
            backgroundColor: backgroundColor,
            borderColor: borderColor
            }
        ]}
        >
            <SvgXml 
                xml={icon} 
                width="20" 
                height="20" 
                style={{ marginRight: 8 }}
            />
            <Text 
                className="font-primary font-semibold"
                style={{ color: textColor }}
            >
            {text}
            </Text>
        </TouchableOpacity>
    );
};

export default SocialLoginButton;