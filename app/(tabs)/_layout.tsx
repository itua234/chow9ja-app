import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomTabBar from '@/components/CustomTabBar';
import {settings, settingsActive, home, homeActive, wallet, 
  walletActive, analytics, analyticsActive} from '@/util/svg';
  import {SvgXml} from "react-native-svg";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const getIcon = (routeName: string, focused: boolean) => {
      switch (routeName) {
        case 'Home':
            return focused ? homeActive : home;
        case 'Wallet':
            return focused ? walletActive : wallet;
        case 'Analytics':
            return focused ? analyticsActive : analytics;
        default:
            return focused ? settingsActive : settings;
      }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "red",
            height: 80,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            justifyContent: "center"
          },
        }),
        tabBarItemStyle: {
          height: 60,
          paddingVertical: 10,
          alignItems: "center",
           justifyContent: "center"
        }
      }}
      //tabBar={(props) => <CustomTabBar {...props} />}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={styles.tabItem.active}>
                <SvgXml
                    xml={home}
                    width="28"
                    height="28"
                />
                <Text className="font-primary ml-[7.5px]">Home</Text>
              </View>
            ) : (
              <View style={styles.tabItem.inactive}>
                <SvgXml
                    xml={homeActive}
                    width="28"
                    height="28"
                />
              </View>
            )
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={styles.tabItem.active}>
                <SvgXml
                    xml={analytics}
                    width="28"
                    height="28"
                />
                <Text className="font-primary ml-[7.5px]">Analytics</Text>
              </View>
            ) : (
              <View style={styles.tabItem.inactive}>
                <SvgXml
                    xml={analyticsActive}
                    width="28"
                    height="28"
                />
              </View>
            )
          ),
        }}
      />
       <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={styles.tabItem.active}>
                <SvgXml
                    xml={settings}
                    width="28"
                    height="28"
                />
                <Text className="font-primary ml-[7.5px]">Settings</Text>
              </View>
            ) : (
              <View style={styles.tabItem.inactive}>
                <SvgXml
                    xml={settingsActive}
                    width="28"
                    height="28"
                />
              </View>
            )
          ),
        }}
      />
       <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={styles.tabItem.active}>
                <SvgXml
                    xml={wallet}
                    width="28"
                    height="28"
                />
                <Text className="font-primary ml-[7.5px]">Wallet</Text>
              </View>
            ) : (
              <View style={styles.tabItem.inactive}>
                <SvgXml
                    xml={walletActive}
                    width="28"
                    height="28"
                />
              </View>
            )
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tabItem: {
    active: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f3f3f3",
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      minWidth: 120,
      top: 15,
      left: 20
    },
    inactive: {
      flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 120,
    top: 15,
    left: 20
    }
  },
}  as any);