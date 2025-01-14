import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import {SvgXml} from "react-native-svg";
import {settings, settingsActive, home, homeActive, wallet, walletActive, analytics, analyticsActive} from '../util/svg';

function CustomTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const getIcon = (routeName, focused) => {
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
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tab}
                        key={route.key}
                    >
                        <SvgXml
                            xml={getIcon(route.name, isFocused)}
                            width="30"
                            height="30"
                        />
                        <Text
                        className={`font-primary text-[12px] ${
                            isFocused ? 'text-primary' : 'text-[gray]'
                        } mt-[3px]`}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red', // Ensure the parent container has the same background color
    },
    tabBar: {
        flexDirection: 'row',
        height: 80,
        //borderTopWidth: 3,
        //borderTopColor: '#eee',
        backgroundColor: '#fff',
        paddingBottom: 10,
        overflow: 'hidden',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
});

export default CustomTabBar;