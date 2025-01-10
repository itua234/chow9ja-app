import React, { useState } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar 
} from "react-native";

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
}

const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: "1", title: "Welcome", message: "Thank you for joining!", isRead: false },
        { id: "2", title: "New Update", message: "Version 2.0 is now available.", isRead: false },
        { id: "3", title: "Reminder", message: "Don't forget your appointment tomorrow.", isRead: true },
    ]);

    const markAsRead = (id: string) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === id ? { ...notification, isRead: true } : notification
            )
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
        );
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <View
        className={`
            rounded-lg 
            mx-4 
            my-2 
            p-4 
            ${item.isRead ? 'bg-gray-100' : 'bg-white'} shadow-sm`
        }>
            <TouchableOpacity onPress={() => markAsRead(item.id)}>
                <View className="mb-[8px]">
                    <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
                    <Text className="text-sm text-gray-600">{item.message}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <Text className="text-2xl font-bold text-center text-gray-800 my-5">
                Notifications
            </Text>
            {notifications.length > 0 ? (
                <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                className="px-[16px]"
                />
            ) : (
                <Text className="text-base text-gray-600 font-primary text-center mt-[20px]">
                    No notifications at the moment.
                </Text>
            )}
        </SafeAreaView>
    );
};

export default Notifications;