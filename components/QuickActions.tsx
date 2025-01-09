import {View, Text, Pressable} from 'react-native';
import {SvgXml} from "react-native-svg";

interface ActionsType {
    title: string;
    icon: string;
    onPress: () => void;
    className?: string;
}
const QuickActions = ({
    title, 
    icon, 
    onPress = () => {}, 
    className = ''
}: ActionsType) => {
    return (
        <Pressable 
            onPress={onPress} 
            className={`flex items-center ${className}`}
        >
            <View className="w-[50px] h-[50px] bg-[#f3f3f3] rounded-full flex items-center justify-center mb-[5px]">
                <SvgXml xml={icon} width="24" height="24" />
            </View>
            <Text className="font-primary text-[14px] text-[gray]">{title}</Text>
        </Pressable>
    );
};

export default QuickActions;