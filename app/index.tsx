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
import { useFonts } from "expo-font";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch } from '@/reducers/store';
import { Provider, useDispatch} from 'react-redux';
import { setUser, setLoading, setAppIsReady, setisAuthenticated } from '@/reducers/auth/authSlice';
import {get_user} from "@/api"
import { User } from "@/models/User";
import * as SplashScreen from 'expo-splash-screen';

export default function index() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        user,
        isAuthenticated,
        isLoading,
        appIsReady
    } = useSelector((state: RootState) => state.auth);
      
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

const styles = StyleSheet.create({
    
});