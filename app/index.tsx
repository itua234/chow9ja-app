import React, { useState } from "react";
import { View, Text, Image, Dimensions, Pressable, StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { router } from "expo-router";
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

interface Slide {
    title: string;
    description: string;
    image: any; // Use `ImageSourcePropType` if you want stricter typing
}
const slides: Slide[] = [
    {
        title: "Welcome to Our App",
        description: "Discover amazing features to enhance your productivity.",
        image: require("@/assets/images/slide2.jpg"), // Replace with your image
    },
    {
        title: "Track Your Progress",
        description: "Stay updated with real-time progress tracking.",
        image: require("@/assets/images/slide1.jpg"), // Replace with your image
    },
    {
        title: "Join Our Community",
        description: "Connect with like-minded individuals.",
        image: require("@/assets/images/slide3.png"), // Replace with your image
    }
];

export default function index() {
    const [activeSlide, setActiveSlide] = useState(0);
    const { width: screenWidth } = Dimensions.get("window");
    const [text, setText] = useState('');
    const opacity = useSharedValue(1);
    const dotWidth = useSharedValue(40);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(scrollPosition / screenWidth);
        setActiveSlide(currentIndex);

        // Animate opacity and dot width
        opacity.value = withTiming(1, { duration: 300, easing: Easing.ease });
        dotWidth.value = withTiming(10, { duration: 300, easing: Easing.ease });
    };

    const renderSlide = ({ item }: { item: Slide }) => (
        <Animated.View className="justify-center items-center px-[20px]" style={{ width: screenWidth }}>
            <Image source={item.image} className="w-[300px] h-[300px] mb-[20px] object-contain" />
            <Text className="text-center font-primary text-[24px] mb-[10px] text-[#333]">{item.title}</Text>
            <Text className="text-center font-primary text-[16px] mb-[10px] text-[#666]">{item.description}</Text>
        </Animated.View>
    );

    const animatedDotStyle = useAnimatedStyle(() => {
        return {
            width: dotWidth.value,
        };
    });

    return (
        <View style={styles.container}>
            <FlatList
                data={slides}
                renderItem={renderSlide}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
            />

            <View className="flex-row justify-center my-[10px]">
                {slides.map((_, index) => (
                    <Animated.View
                        key={index}
                        className="w-[10px] h-[10px] rounded-[5px] mx-[5px]"
                        style={[
                            styles.dot,
                            activeSlide === index ? styles.activeDot : styles.inactiveDot,
                            activeSlide === index && animatedDotStyle
                        ]}
                    />
                ))}
            </View>

            {/* Buttons */}
            <View className="p-[20px]">
                <Pressable  className=" 
                py-5
                px-[15px] 
                border-2  
                rounded-[15px] 
                mt-5 
                flex 
                items-center 
                justify-center" 
                onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                    router.push("/sign-in");
                 }}>
                    <Text className="
                        text-center 
                        text-white 
                        font-primary
                        text-[18px]
                        text-[black]
                        " >Login</Text>
                </Pressable>
                <Pressable className=" 
                py-5
                px-[15px] 
                bg-primary 
                rounded-[15px] 
                mt-5 
                flex 
                items-center 
                justify-center" 
                onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/sign-up");
                 }}>
                    <Text className="
                        text-center 
                        text-white 
                        font-primary
                        text-[18px]
                        text-white
                        " >Sign Up</Text>
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: "#121212",
        width: 40
    },
    inactiveDot: {
        backgroundColor: "#ccc",
    },
});

{/* <ActivityIndicator size="large" color="#000" /> */}