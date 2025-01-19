import { View, Text } from "react-native";

interface CustomAlertProps {
    msg: { text: string; type: 'success' | 'error' } | null;
    color?: string;
    backgroundColor?: string
}
const CustomAlert: React.FC<CustomAlertProps>  = ({ 
    msg,
    color,
    backgroundColor
}) => {
    if (!msg) {
        return null; // Return nothing if msg is null
    }
    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            height: 170,
            backgroundColor: msg.type === 'error' ? 'black' : 'black',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            opacity: 0.8
        }} className="pt-[20px]">
            <Text
                className="text-[16px] font-primary text-center"
                style={{ color: msg.type === 'success' ? 'green' : 'red' }}
            >
                {msg.text}
            </Text>
        </View>
    )
};

export default CustomAlert;