// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return <Stack />;
// }

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    "Campton-Black": require('../assets/fonts/campton/CamptonBlack.otf'),
    "Campton-Light": require('../assets/fonts/campton/CamptonLight.otf'),
    "Campton-Medium": require('../assets/fonts/campton/CamptonMedium.otf'),
    "Campton-SemiBold": require('../assets/fonts/campton/CamptonSemiBold.otf'),
    "Campton-Bold": require('../assets/fonts/campton/CamptonBold.otf'),
    "Campton-ExtraBold": require('../assets/fonts/campton/CamptonExtraBold.otf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme !== 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="sign-in">
        <Stack.Screen name="sign-in" options={{headerShown: false, gestureEnabled: true, title: ''}}/>
        <Stack.Screen name="sign-up" options={{headerShown: false, gestureEnabled: true, title: ''}}/>
        <Stack.Screen name="verify-email" options={{headerShown: false, gestureEnabled: true, title: ''}}/>
        <Stack.Screen name="forgot-password" options={{headerShown: false, gestureEnabled: true, title: ''}}/>
        <Stack.Screen name="dashboard" options={{headerShown: false, gestureEnabled: true, title: ''}}/>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
