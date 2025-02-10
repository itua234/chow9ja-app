import React, { useEffect, useState } from 'react';
import { 
  DarkTheme, 
  DefaultTheme, 
  ThemeProvider 
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

import { store, AppDispatch } from '@/reducers/store';
import { Provider, useDispatch } from 'react-redux';
import { setLatitude, setLongitude } from '@/reducers/location/locationSlice';

import { useColorScheme } from '@/hooks/useColorScheme';
import 'react-native-reanimated';
import '../global.css';
import useLocation from '@/hooks/useLocation';

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
  const {latitude, longitude, msg} = useLocation();
  //console.log("latitude", latitude, longitude, msg);
  useEffect(() => {
    if (latitude && longitude) {
      dispatch(setLatitude(latitude));
      dispatch(setLongitude(longitude));
    }
  }, [latitude, longitude, dispatch]);

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
    const initializeApp = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync(); // Hide splash screen after everything is ready
      }
    };
    initializeApp();
  }, [fontsLoaded]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="(tabs)" options={{ title: 'Tabs' }} /> */}
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="verify-email" options={{ title: 'Verify Email' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="change-password" options={{ title: 'Change Password' }} />
      <Stack.Screen name="send" options={{ title: 'Send' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />

      <Stack.Screen name="cable" options={{ title: 'Cable' }} />
      <Stack.Screen name="utility" options={{ title: 'Utility' }} />

      <Stack.Screen name="investment-data" options={{ title: 'Investment data' }} />
    </Stack>
  );
}