import React, { useState, useEffect, useLayoutEffect } from "react";
import { 
    View, 
    Text, 
    Image, 
    Pressable, 
    StyleSheet,
} from "react-native";
import { router } from "expo-router";
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { StatusBar } from 'expo-status-bar';
import PrimaryButton from "@/components/PrimaryButton";

import { SvgXml } from "react-native-svg";
import { groundforce_logo } from '@/util/svg';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducers/store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch } from '@/reducers/store';
import { useDispatch} from 'react-redux';
import { setUser, setLoading, setAppIsReady, setisAuthenticated } from '@/reducers/auth/authSlice';
import {get_user} from "@/api"
import { User } from "@/models/User";

export default function index() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        user,
        isAuthenticated,
        isLoading,
        appIsReady
    } = useSelector((state: RootState) => state.auth);
    const [isFirstTime, setIsFirstTime] = useState<string | null>(null);
    useEffect(() => {
        const initializeApp = async () => {
            const firstTimeValue = await AsyncStorage.getItem('isFirstTime');
            const newValue = firstTimeValue === null ? "true" : "false";
            setIsFirstTime(newValue);
            await checkAuthStatus(); // Wait for auth status check
        };
        initializeApp();
    }, []);
    const checkAuthStatus = async () => {
        try {
          const token = await AsyncStorage.getItem('user_token');
          if(token){
            const response = await get_user();
            const user: User = response.data.results;
            dispatch(setUser(user));
            dispatch(setAppIsReady(true));
            dispatch(setisAuthenticated(true));
            dispatch(setLoading(false));
            // Initialize socket connection
            //socketService.initialize(user);
          }
        }catch (error) {
          console.log('Error checking auth status:', error);
        }finally{
          dispatch(setAppIsReady(true));
          dispatch(setLoading(false));
        }
    };
    // Cleanup socket connection on unmount
    useEffect(() => {
        return () => {
            //socketService.disconnect();
        };
    }, []);
    useEffect(() => {
        // Redirect based on `isFirstTime` and `isAuthenticated`
        if (appIsReady && isFirstTime === "false") {
            if (isAuthenticated) {
                router.replace("/dashboard");
            } else {
                router.replace("/sign-in");
            }
        }
    }, [appIsReady, isFirstTime, isAuthenticated]);

    if (!appIsReady || isFirstTime === null) {
        return (
            <View className="
            flex-1 
            items-center 
            justify-center
            bg-[#4884DF]">
                <SvgXml
                    xml={groundforce_logo}
                    width="200"
                    height="30"
                />
            </View>
        );
    }
    
    if (isFirstTime === "true") {
        return (
            <>
            <StatusBar style="light" />
            <View className="flex-1 flex-column bg-primary">
                <View className="flex-1">
                    
                </View>
                <View className="flex-1 bg-white px-[17.5] text-center pt-[40px]">
                    <View className="">
                        <Text className="font-primary text-[27px] text-center">Stay Ahead: Manage Subscriptions with Ease!</Text>
                        <Text className="font-primary text-[16px] text-center mt-[15px]">Get timely alerts for upcoming payments and price changes.</Text>
                    </View>
                    <View className="mt-[20px]">
                        <PrimaryButton 
                            title="Sign Up Now"
                            isLoading={false} 
                            action={async () => {
                                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push("/sign-up");
                            }}
                            disabled={false}
                        />
                        <Pressable className=" 
                            px-[15px] 
                            rounded-[15px] 
                            mt-6 
                            flex 
                            items-center 
                            justify-center" 
                            onPress={async () => {
                                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push("/sign-in");
                            }}>
                            <Text className="
                                text-center 
                                font-primary
                                text-[18px]
                            " >Log In</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            </>
        );
    }

}