import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import {SvgXml} from "react-native-svg";
import {groundforce_logo} from '@/util/svg';

import { store } from '@/reducers/store';
import { RootState } from '@/reducers/store';
import { setUser, setLoading } from '@/reducers/auth/authSlice';

import { useColorScheme } from '@/hooks/useColorScheme';
import 'react-native-reanimated';
import '../global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
        <RootLayout />
      {/* </ThemeProvider> */}
    </Provider>
  );
}

function RootLayout() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);

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
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        dispatch(setUser(user));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      dispatch(setLoading(false));
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //   <ActivityIndicator size="large" color="#61dafb" />
      // </View>
      <View className="flex-1 items-center justify-center bg-[#4884DF]">
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