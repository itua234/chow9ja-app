import { View, Text } from "react-native";

interface CustomAlertProps {
    msg: string;
    type?: string;
    color?: string;
    backgroundColor?: string
}
const CustomAlert: React.FC<CustomAlertProps>  = ({ 
    msg,
    type,
    color,
    backgroundColor
}) => {
    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            height: 150,
            backgroundColor: 'white',
            //backgroundColor: msgType === 'error' ? 'red' : 'green',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            opacity: 0.8
        }} className="pt-[20px]">
            <Text
                className="text-[15px] font-primary text-center"
                // style={{ color: msgType === 'success' ? 'green' : 'red' }}
            >
                {msg}
            </Text>
        </View>
    )
};

export default CustomAlert;