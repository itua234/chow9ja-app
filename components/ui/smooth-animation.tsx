import React, { useEffect, useRef } from "react";
import { 
    View, 
    Text, 
    Pressable, 
    Animated, 
    StyleSheet, 
    LayoutAnimation, 
    UIManager, 
    Platform 
} from "react-native";

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

const CustomRadio: React.FC<CustomRadioProps> = ({ 
    label,
    selected, 
    onSelect, 
    size = 24, 
    color = '#007AFF' 
}) => {
    const scaleValue = useRef(new Animated.Value(selected ? 1 : 0)).current;

    // Animate when the selected state changes
    useEffect(() => {
        // Smoothly animate changes in layout
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

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
            style={styles.radioContainer}
        >
            {/* Radio Circle */}
            <View style={[styles.outer, { width: outerSize, height: outerSize, borderRadius: outerSize / 2, borderColor: color }]}>
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

            {/* Label */}
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 15,
        marginTop: 12,
    },
    outer: {
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    inner: {
        position: 'absolute',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default CustomRadio;
