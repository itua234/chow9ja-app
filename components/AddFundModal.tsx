import React from 'react';
import { View, Modal, SafeAreaView } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';

interface AddFundModalProps {
    isVisible: boolean;
    onClose: () => void;
    url: string;
    onNavigationStateChange: (navState: WebViewNavigation) => void;
}
const AddFundModal: React.FC<AddFundModalProps>  = ({ 
    isVisible, 
    onClose, 
    url, 
    onNavigationStateChange 
}) => {
    const cookieScript = `
    document.cookie = "thirdParty=true; SameSite=None; Secure";
    `;
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    onClose();
                }}
            >
                <SafeAreaView className="flex-1 mt-2.5">
                    <View className="flex-1">
                        <WebView
                            source={{
                                uri: url,
                                headers: {
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                                    'Content-Type': 'text/html; charset=utf-8'
                                }
                            }}
                            userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                            className="flex-1"
                            javaScriptEnabled={true}
                            thirdPartyCookiesEnabled={true}
                            domStorageEnabled={true}
                            //incognito={true}
                            startInLoadingState={true}
                            scalesPageToFit={true}
                            mixedContentMode="always"
                            //userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                            onNavigationStateChange={onNavigationStateChange}
                            onError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.warn('WebView error: ', nativeEvent);
                            }}
                            onHttpError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.warn('WebView received error status code: ', nativeEvent.statusCode);
                            }}
                            sharedCookiesEnabled={true}
                            cacheEnabled={false}
                            allowsBackForwardNavigationGestures={true}
                            contentMode="recommended"  // iOS specific
                            onShouldStartLoadWithRequest={(request) => {
                                // Allow all navigation
                                return true;
                            }}
                            //injectedJavaScript={cookieScript}
                            injectedJavaScriptBeforeContentLoaded={cookieScript}
                            useWebKit={true}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

export default AddFundModal;