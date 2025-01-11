import React, { useState } from "react";
import { View, Text, Image, Dimensions, Pressable, StyleSheet, FlatList } from "react-native";
import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const slides = [
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

export default function Splash() {
    const [activeSlide, setActiveSlide] = useState(0);

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(scrollPosition / screenWidth);
        setActiveSlide(currentIndex);
    };

    const renderSlide = ({ item }) => (
        <View className="justify-center items-center px-[20px]" style={{ width: screenWidth }}>
            <Image source={item.image} style={styles.image} />
            <Text className="text-center font-primary text-[24px] mb-[10px] text-[#333]">{item.title}</Text>
            <Text className="text-center font-primary text-[16px] mb-[10px] text-[#666]">{item.description}</Text>
        </View>
    );

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

            {/* Pagination Dots */}
            <View className="flex-row justify-center my-[10px]">
                {slides.map((_, index) => (
                    <View
                        key={index}
                        className="w-[10px] h-[10px] rounded-[5px] mx-[5px]"
                        style={[
                            //styles.dot,
                            activeSlide === index ? styles.activeDot : styles.inactiveDot
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
                onPress={() => router.push("/sign-in")}>
                    <Text className="
                        text-center 
                        text-white 
                        font-primary
                        text-[18px]
                        text-black
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
                onPress={() => router.push("/sign-up")}>
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
    slide: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: "contain",
        marginBottom: 20,
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
    }
});