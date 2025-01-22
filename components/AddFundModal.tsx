import React, { useRef, useState } from 'react';
import { View, Modal, SafeAreaView, Animated,StyleSheet, Button } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import WebViewProgressEvent  from 'react-native-webview';
import {StatusBar} from "expo-status-bar";

interface AddFundModalProps {
    isVisible: boolean;
    onClose: () => void;
    url: string;
    onNavigationStateChange: (navState: WebViewNavigation) => void;
    onBackPress: () => void; 
}
const AddFundModal: React.FC<AddFundModalProps>  = ({ 
    isVisible, 
    onClose, 
    url, 
    onNavigationStateChange,
    onBackPress 
}) => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const [ webkey, setWebkey ] = useState(0);
    
    const onLoadProgress = (event: { nativeEvent: { progress: number } }) => {
        Animated.timing(progressAnim, {
            toValue: event.nativeEvent.progress,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const progressBarWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp'
    });
    
    return (
        <>
        <StatusBar style="dark" />
        <Button title="back" onPress={onBackPress}></Button>
        <View className="flex-1" style={{position: "relative"}}>
            <WebView
                source={{
                    uri: url,
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Content-Type': 'text/html; charset=utf-8',
                       // 'Referer': 'https://example.com', // Add any required headers
                    }
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                thirdPartyCookiesEnabled={true}
                sharedCookiesEnabled={true}
                userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                mixedContentMode="always"
                onLoad={() => console.log("WebView loaded")}
                onLoadEnd={() => console.log("WebView load completed")}
                onLoadProgress={onLoadProgress}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
                onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView received error status code: ', nativeEvent.statusCode);
                }}
                className="flex-1"
                onNavigationStateChange={(state) => {
                    console.log(state);
                }}
                key={webkey}
                onLoadStart={(syntheticEvent) => {
                    try {
                        const { nativeEvent } = syntheticEvent;
                        if (nativeEvent.url === 'about:blank') {
                            setWebkey(webkey=>webkey+1);
                        }
                    } catch { }
                }}
            />
            <Animated.View style={[
                styles.progressBar,
                {
                    width: progressBarWidth,
                }
            ]} />
        </View>
    </>
    );
};

const styles = StyleSheet.create({
    progressBar: {
        height: 3,
        backgroundColor: '#2196F3', // You can change the color
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 30,
    },
    webview: {
        flex: 1,
    }
});

export default AddFundModal;