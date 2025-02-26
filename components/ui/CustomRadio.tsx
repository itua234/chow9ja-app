import { useEffect } from "react";
import { View, Text, Pressable, Animated, StyleSheet, TouchableOpacity, Platform, UIManager } from "react-native";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CustomRadioProps {
    onSelect: () => void;
    color?: string;
    size?: number;
    selected: boolean;
    label?: string | number;
}
const CustomRadio: React.FC<CustomRadioProps>  = ({ 
    label,
    selected = false, 
    onSelect, 
    size = 24, 
    color = '#007AFF'
}) => {
    // Create animated value for scaling effect
    const scaleValue = new Animated.Value(selected ? 1 : 0);
    // Handle animation when selected state changes
    useEffect(() => {
        Animated.timing(scaleValue, {
            toValue: selected ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [selected]);
    // Calculate sizes based on the prop
    const outerSize = size;
    const innerSize = size * 0.6;

    return (
        <Pressable 
        onPress={onSelect}
        //activeOpacity={0.8}
        className="flex-row justify-between items-center py-[20px] px-[20px] border-[2px] border-[#fff] mt-[12px] rounded-[15px]">
            <View className="flex-1 flex-row items-center">
                <View
                    style={[
                    styles.outer,
                    {
                        width: outerSize,
                        height: outerSize,
                        borderRadius: outerSize / 2,
                        borderColor: color,
                    },
                    ]}>
                    <Animated.View
                        style={[
                            styles.inner,
                            {
                                width: innerSize,
                                height: innerSize,
                                borderRadius: innerSize / 2,
                                backgroundColor: color,
                                transform: [{ scale: scaleValue }],
                            },
                        ]}
                    />
                </View>
                <View className="ml-[10px]">
                    <Text className="font-primary text-[16px] ">Yearly</Text>
                    <Text className="font-primary">-66% discount</Text>
                </View>
            </View>
            <View className="">
                <Text className="font-primary text-[16px]">94.80</Text>
                <Text className="font-primary">every year</Text>
            </View>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
    },
    outer: {
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inner: {
        position: 'absolute',
    },
});
  
export default CustomRadio;