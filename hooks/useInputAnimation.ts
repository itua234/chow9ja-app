import { useState, useRef, useCallback } from 'react';
import { Animated } from 'react-native';

const useInputAnimation = () => {
    const animatedBorderColor = useRef(new Animated.Value(0)).current;
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    // Handle focus animation
    const handleFocus = useCallback((name: string) => {
        setFocusedInput(name);
        Animated.timing(animatedBorderColor, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [animatedBorderColor]);

    // Handle blur animation
    const handleBlur = useCallback((name: string) => {
        setFocusedInput(null);
        Animated.timing(animatedBorderColor, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [animatedBorderColor]);

    // Interpolated border color based on focus
    const borderColor = animatedBorderColor.interpolate({
        inputRange: [0, 1, 2], // 0 = default, 1 = focus, 2 = error
        outputRange: ['#EDF1F3', '#121212', 'red'], // Default, focused, error
    });

    return {
        focusedInput,
        borderColor,
        handleFocus,
        handleBlur,
        animatedBorderColor
    };
};

export default useInputAnimation;