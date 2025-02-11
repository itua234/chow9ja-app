import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Pressable,
    StyleProp,
    ViewStyle,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

type CustomSliderProps = {
    children: React.ReactNode; // Accept an array of React elements as slides
    autoSlideInterval?: number; // Time in milliseconds for auto-sliding
    showPagination?: boolean; // Whether to show pagination indicators
    slideContainerStyle?: StyleProp<ViewStyle>;
    dotStyle?: StyleProp<ViewStyle>;
    activeDotStyle?: StyleProp<ViewStyle>;
};

const CustomSlider: React.FC<CustomSliderProps> = ({
    children,
    autoSlideInterval = 4000,
    showPagination = true,
    slideContainerStyle,
    dotStyle,
    activeDotStyle,
}) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Convert children to an array of React nodes
    const slides = React.Children.toArray(children);

    // Automatically scroll to the next slide
    const scrollToNext = () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        setCurrentIndex(nextIndex);

        // Scroll the ScrollView to the next position
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: nextIndex * (screenWidth - 35),
                animated: true,
            });
        }
    };

    useEffect(() => {
        // Set up the interval for auto-sliding
        if (autoSlideInterval > 0) {
            intervalRef.current = setInterval(scrollToNext, autoSlideInterval); // Auto-slide every autoSlideInterval seconds
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current); // Clean up the interval on unmount
            }
        };
    }, [currentIndex]);

    // Handle scroll events
    const handleMomentumScrollEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const index = Math.round(
            event.nativeEvent.contentOffset.x / (screenWidth - 35)
        );
        setCurrentIndex(index);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
            >
                <View style={styles.slidesWrapper}>
                    {slides.map((slide, index) => (
                        <View
                            key={index}
                            style={[
                                styles.slide,
                                slideContainerStyle,
                                { width: screenWidth - 35 },
                            ]}
                        >
                            {slide}
                        </View>
                    ))}
                </View>
            </ScrollView>
            {showPagination && (
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                dotStyle,
                                currentIndex === index && [
                                    styles.activeDot,
                                    activeDotStyle,
                                ],
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slidesWrapper: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    slide: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        // backgroundColor: 'white',
        //padding: 20,
        //borderRadius: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#6c757d',
    },
    pagination: {
        flexDirection: 'row',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        margin: 5,
    },
    activeDot: {
        backgroundColor: '#121212',
    },
});

export default CustomSlider;