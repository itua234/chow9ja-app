import React, {useState, useEffect, useRef} from 'react';
import { Text, View, Image, Pressable, Animated } from 'react-native';
import {SvgXml, SvgUri} from "react-native-svg";
import {bell, headphones, active_bell} from '@/util/svg';
import useSocket from '@/hooks/useSocket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from "expo-router";
import { useSelector } from 'react-redux';
import { RootState } from '@/reducers/store';

const DashboardHeader = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const {
        notifications,
        notificationCount,
        resetNotificationCount,
        markNotificationAsRead,
        removeNotification
    } = useSocket({
        url: 'http://172.20.10.4:8080',
        //options: userToken ? { auth: { token: userToken } } : undefined,
        options: {
            auth: { 
                token: user?.token,
                //room: 'general_room_1',
            }
        },
        events: ['new_message', 'user_joined', 'user_registered'] // Events to listen for
    });
    
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
                {user.photo ? (
                    <Image
                        style={{ height: 40, width: 40, borderRadius: 50 }}
                        source={{ uri: user.photo }}
                    />) :
                (
                    <SvgXml xml={headphones} width={40} height={40} /> // Fallback SVG
                )}
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
                    {/* <Text className='font-primary text-[14px]'>{notificationCount}</Text> */}
                    <Pressable onPress={() => {
                        // router.push({
                        //     pathname: '/notifications',
                        //     params: {
                        //         notifications: JSON.stringify(notifications),
                        //     }
                        // });
                        router.push("/splash");
                    }}>
                        <SvgXml xml={notificationCount > 0 ? active_bell : bell} width="30" height="30" />
                    </Pressable>
                </View>
            </View>
        </View>
        </>
    );
};

export default DashboardHeader;