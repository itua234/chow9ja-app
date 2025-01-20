import { useLocalSearchParams } from "expo-router";
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

interface Notification<T = any> {
    id: string; // Unique identifier for each notification
    type: string; // The event type (name of the socket event)
    data: T; // The payload received with the event
    timestamp: Date; // Timestamp when the notification was received
    isRead: boolean; // Read status
}

const Notifications = () => {
    const { notifications: notificationsParam } = useLocalSearchParams();
    const notifications = notificationsParam ? JSON.parse(notificationsParam as string) : [];
    
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
                    <Text className="text-lg font-bold text-gray-800">{item.id}</Text>
                    <Text className="text-sm text-gray-600">{item.id}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <Text className="font-primary text-2xl font-bold text-center text-gray-800 my-5">
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


// const [notifications, setNotifications] = useState<Notification[]>([
    //     { id: "1", title: "Welcome", message: "Thank you for joining!", isRead: false },
    //     { id: "2", title: "New Update", message: "Version 2.0 is now available.", isRead: false },
    //     { id: "3", title: "Reminder", message: "Don't forget your appointment tomorrow.", isRead: true },
    // ]);