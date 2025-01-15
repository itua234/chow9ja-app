import React, { ReactNode } from 'react';
import { 
    SafeAreaView, 
    KeyboardAvoidingView, 
    ScrollView, 
    Platform,
    ScrollViewProps,
    ViewStyle,
    StatusBar
} from 'react-native';

interface ScreenLayoutProps {
    children: ReactNode; // Specifies that children can be any valid React node
    className?: string; // Optional string for additional class names
    scrollViewProps?: ScrollViewProps; // Props to pass down to ScrollView
    contentContainerStyle?: ViewStyle; // Style object for ScrollView's content container
}
const ScreenLayout: React.FC<ScreenLayoutProps> = ({
    children, 
    className = '', 
    scrollViewProps = {}, 
    contentContainerStyle 
}) => {
    return (
        <SafeAreaView className={`flex-1 bg-[#f3f3f3] ${className}`}>
            <StatusBar
                animated={false}
                backgroundColor="#f3f3f3"
                networkActivityIndicatorVisible={true}
                hidden={false}
                barStyle="dark-content"
                translucent={false}
            />
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView 
                    contentContainerStyle={{ 
                        flexGrow: 1, 
                        justifyContent: 'space-between',
                        ...contentContainerStyle
                    }}
                    keyboardShouldPersistTaps="handled"
                    {...scrollViewProps}
                >
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ScreenLayout;