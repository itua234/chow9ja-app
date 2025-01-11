import React, { useState, useRef } from 'react';
import { View, TextInput, Animated, StyleSheet, Text } from 'react-native';

const AnimatedTextInput = ({ 
    placeholder,
    value,
    onChangeText,
    containerStyle,
    inputStyle,
    labelStyle,
    ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!value) {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    const animatedLabelStyle = {
        position: 'absolute',
        left: 16,
        top: animatedValue.interpolate({
            inputRange: [0, 1],
            //outputRange: [28, -8], // Adjusted to center on border
            outputRange: [14, -12], 
        }),
        transform: [
            {
                scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.75],
                }),
            }
        ],
        zIndex: 1,
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <Animated.View
            style={[
                styles.label, 
                animatedLabelStyle, 
                labelStyle,
                { color: isFocused ? '#007AFF' : '#999' }
            ]}>
                <Text className="font-primary">{placeholder}</Text>
            </Animated.View>
            <TextInput
                style={[styles.input, inputStyle]}
                value={value}
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                blurOnSubmit
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
       marginVertical: 50,
        height: 56,
        position: 'relative',
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        fontSize: 16,
        color: '#333',
    },
    label: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 5,
        // borderWidth: 1,
        // borderColor: 'blue',
        // borderRadius: 8,
    },
});

export default AnimatedTextInput;