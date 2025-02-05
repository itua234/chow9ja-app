import React, { useEffect, useState } from 'react';
import { 
  DarkTheme, 
  DefaultTheme, 
  ThemeProvider 
} from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFonts } from 'expo-font';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {SvgXml} from "react-native-svg";
import {groundforce_logo} from '@/util/svg';

import { store, RootState, AppDispatch } from '@/reducers/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setAppIsReady, setisAuthenticated } from '@/reducers/auth/authSlice';
import {get_user} from "@/api"
import { User } from "@/models/User";

import { useColorScheme } from '@/hooks/useColorScheme';
import 'react-native-reanimated';
import '../global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <RootLayout />
    </Provider>
  );
}

function RootLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    isAuthenticated,
    isLoading,
    appIsReady
  } = useSelector((state: RootState) => state.auth);
  const [isFirstTime, setIsFirstTime] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    "Campton-Black": require('../assets/fonts/campton/CamptonBlack.otf'),
    "Campton-Light": require('../assets/fonts/campton/CamptonLight.otf'),
    "Campton-Medium": require('../assets/fonts/campton/CamptonMedium.otf'),
    "Campton-SemiBold": require('../assets/fonts/campton/CamptonSemiBold.otf'),
    "Campton-Bold": require('../assets/fonts/campton/CamptonBold.otf'),
    "Campton-ExtraBold": require('../assets/fonts/campton/CamptonExtraBold.otf')
  });

  useEffect(() => {
    (async () => {
      try {
        const firstTimeValue = await AsyncStorage.getItem('isFirstTime');
        if (firstTimeValue === null) {
          await AsyncStorage.setItem('isFirstTime', 'true'); // Set default value if not present
          setIsFirstTime('true');
        } else {
          setIsFirstTime('false');
        }
      } catch (error) {
        console.log('Error initializing app:', error);
      } finally {
        // Hide splash screen once everything is ready
        SplashScreen.hideAsync();
      }
    })();
  }, [fontsLoaded]);

  useEffect(() => {
    checkAuthStatus();
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
      }
    }catch (error) {
      console.log('Error checking auth status:', error);
    }finally{
      dispatch(setAppIsReady(true));
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (appIsReady) {
      if (isAuthenticated) {
        router.replace("/(tabs)"); // Navigate only after app is ready
      } else {
          if (isFirstTime === 'false') {
            router.replace("/sign-in");
          }
      }
    }
  }, [appIsReady, isAuthenticated]); // Run when appIsReady or isAuthenticated changes

  if (!fontsLoaded || !appIsReady || isFirstTime === null) {
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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Splashscreen' }} />
      <Stack.Screen name="(tabs)" options={{ title: 'Tabs' }} />
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="verify-email" options={{ title: 'Verify Email' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="change-password" options={{ title: 'Change Password' }} />
      <Stack.Screen name="send" options={{ title: 'Send' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
    </Stack>
  );
}