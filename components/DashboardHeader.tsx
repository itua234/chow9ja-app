import React, {useState, useEffect, useRef} from 'react';
import { Text, View, Image, Pressable, Animated } from 'react-native';
import {SvgXml, SvgUri} from "react-native-svg";
import {bell, headphones, active_bell} from '@/util/svg';
import useSocket from '@/hooks/useSocket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from "expo-router";

const DashboardHeader = () => {
    // const { 
    //     notifications, 
    //     notificationCount, 
    //     resetNotificationCount 
    // } = useSocket(
    //     'http://172.20.10.4:8080', // Replace with your socket server URL
    //     {auth: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0bmFtZSI6Ikl0dWEiLCJsYXN0bmFtZSI6Ik9zZW1laWx1IiwiZW1haWwiOiJpdHVhb3NlbWVpbHUyMzRAZ21haWwuY29tIiwidmVyaWZpZWQiOmZhbHNlLCJpZCI6ImM1NDJjZTQwLTNlZGItNGZiMi04OTQ3LTZlMWNiYWQyNmMwYyIsInBob25lIjoiKzIzNDgxMTQ4MDA3NTAiLCJwYXNzd29yZCI6IiQyYiQxMCRyWFRLUHQ4c3ZCdVh0R016Mk8uenYub1FacEV6cEtHMFl2b3ZLU1dTLjI1RVpRdm1Ua0tiYSIsImdvb2dsZUlkIjpudWxsLCJub3RpZmljYXRpb25zRW5hYmxlZCI6dHJ1ZSwiZW1haWxfdmVyaWZpZWRfYXQiOiIyMDI0LTEyLTEwVDAwOjM4OjA1LjAwMFoifSwiaWF0IjoxNzM0NjA5ODUwLCJleHAiOjE3MzQ3ODI2NTB9.LSOA4DtU2Ll05OTR-FWO3FzMORogHboPlz7N0aBpt30" }}, // Optional connection options
    //     ['notification', 'message', 'alert', 'user_registered'] // Events to listen for
    // );
    const [notificationCount, setNotifications] = useState(0);
    const [activeTab, setActiveTab] = useState<'Finance' | 'Wallet'>('Finance');
    const walletAnim = useRef(new Animated.Value(0)).current;
    const financeAnim = useRef(new Animated.Value(1)).current;
    const handlePress = (tab: 'Finance' | 'Wallet') => {
        setActiveTab(tab);
        // Animate both buttons simultaneously
        Animated.parallel([
            Animated.timing(financeAnim, {
                toValue: tab === 'Finance' ? 1 : 0,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(walletAnim, {
                toValue: tab === 'Wallet' ? 1 : 0,
                duration: 200,
                useNativeDriver: false,
            })
        ]).start();
    };

    return (
        <>
        <View className="mb-[20px] flex-row justify-between">
            <View className="flex-row items-center justify-center">
                <Image
                    style={{height: 40, width: 40, borderRadius: 50}}
                    source={{uri: "https://res.cloudinary.com/capital-votes/image/upload/v1740639662/vvdkjh8futiuvfndoqep.png"}}
                />
            </View>
            <View className="bg-[white] flex-row px-[10px] rounded-[25px] h-[50px] py-[5px]">
                <Animated.View 
                    className="rounded-[20px] mr-[10px]"
                    style={{
                        backgroundColor: financeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['#ffffff', '#f3f3f3']
                        }),
                    }}
                >
                    <Pressable 
                        className="h-[40px] px-[10px] flex items-center justify-center"
                        onPress={() => handlePress('Finance')}
                    >
                        <Text className="font-primary text-[14px]">Finance</Text>
                    </Pressable>
                </Animated.View>
                <Animated.View 
                    className="rounded-[20px]"
                    style={{
                        backgroundColor: walletAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['#ffffff', '#f3f3f3']
                        }),
                    }}
                >
                    <Pressable 
                        className="h-[40px] px-[10px] flex items-center justify-center"
                        onPress={() => handlePress('Wallet')}
                    >
                        <Text className="font-primary text-[14px]">Wallet</Text>
                    </Pressable>
                </Animated.View>
            </View>
            <View className="flex-row items-center justify-center">
                <View className="w-[40px] h-[40px] rounded-full bg-white items-center justify-center ml-[10px]">
                    <Pressable onPress={() => router.push('/change-password')}>
                        <SvgXml xml={notificationCount > 0 ? active_bell : bell} width="30" height="30" />
                    </Pressable>
                </View>
            </View>
        </View>
        </>
    );
};

export default DashboardHeader;