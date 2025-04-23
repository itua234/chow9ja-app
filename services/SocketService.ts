import { io, Socket } from 'socket.io-client';
import { User } from '@/models/User';

interface NotificationPayload {
    id: string; // Unique identifier for each notification
    type: string; // The event type (name of the socket event)
    data?: any; // The payload received with the event
    timestamp: Date; // Timestamp when the notification was received
    isRead: boolean; // Read status
}

// Define all possible notification types
enum NotificationType {
    SUBSCRIPTION_CREATED = 'SUBSCRIPTION_CREATED',
    SUBSCRIPTION_UPDATED = 'SUBSCRIPTION_UPDATED',
    SUBSCRIPTION_DELETED = 'SUBSCRIPTION_DELETED',
    PAYMENT_SUCCESSFUL = 'PAYMENT_SUCCESSFUL',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    PRICE_CHANGE = 'PRICE_CHANGE',
    USER_MENTIONED = 'USER_MENTIONED'
}

class SocketService {
    private socket: Socket | null = null;
    private notifications: NotificationPayload[] = [];
    private subscribers: ((notifications: NotificationPayload[]) => void)[] = [];
    private readonly SERVER_URL = 'https://your-backend-url.com';

    initialize(user: User) {
        this.socket = io(this.SERVER_URL, {
            auth: {
                token: user.token
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            //transports: ['websocket']
        });

        this.socket.on('connect', () => {
            console.log('Connected to notification server');
        });

        this.socket.on('notification', (payload: NotificationPayload) => {
            this.handleNotification(payload);
        });

        this.socket.on("error", (errorMessage: string) => {
            console.error("Error:", errorMessage);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from notification server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket Connection Error:', error);
        });
    }

    private handleNotification(payload: NotificationPayload) {
        const notification = {
            ...payload,
            id: Date.now().toString(),
            timestamp: new Date(),
            isRead: false
        };

        switch (notification.type) {
            case NotificationType.SUBSCRIPTION_CREATED:
                // Handle subscription creation
                this.handleSubscriptionCreated(notification.data);
                break;
            case NotificationType.PAYMENT_SUCCESSFUL:
                // Handle successful payment
                this.handlePaymentSuccess(notification.data);
                break;
            case NotificationType.PRICE_CHANGE:
                // Handle price changes
                this.handlePriceChange(notification.data);
                break;
            // Add more cases as needed
        }
        
        this.notifications.unshift(notification);
        this.notifySubscribers();
    }

    private handleSubscriptionCreated(data: any) {
        // Custom logic for subscription creation
        console.log('New subscription created:', data);
    }

    private handlePaymentSuccess(data: any) {
        // Custom logic for successful payments
        console.log('Payment successful:', data);
    }

    private handlePriceChange(data: any) {
        // Custom logic for price changes
        console.log('Price changed:', data);
    }

    subscribe(callback: (notifications: NotificationPayload[]) => void) {
        this.subscribers.push(callback);
        callback(this.notifications); // Initial notification state
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    private notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.notifications));
    }

    getUnreadCount(): number {
        return this.notifications.filter(notification => !notification.isRead).length;
    }

    markAsRead(id: string) {
        this.notifications = this.notifications.map(notification => 
            notification.id === id 
            ? { ...notification, isRead: true } 
            : notification
        );
        this.notifySubscribers();
    }

    disconnect() {
        if (this.socket) {
            console.log("Cleaning up socket...");
            this.socket.off("notification");
            this.socket.off("connect");
            this.socket.off("error");
            this.socket.off("disconnect");
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Method to emit events to server
    emit(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }
}

export const socketService = new SocketService();

// import React, { useEffect, useState } from 'react';
// import { View, Text, Pressable } from 'react-native';
// import { socketService } from '@/services/SocketService';
// import { router } from 'expo-router';

// export default function NotificationBadge() {
//     const [unreadCount, setUnreadCount] = useState(0);

//     useEffect(() => {
//         const unsubscribe = socketService.subscribe((notifications) => {
//             setUnreadCount(socketService.getUnreadCount());
//         });

//         return unsubscribe;
//     }, []);

//     if (unreadCount === 0) return null;

//     return (
//         <Pressable 
//             onPress={() => router.push('/notifications')}
//             className="relative"
//         >
//             <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
//                 <Text className="text-white text-xs font-bold">
//                     {unreadCount > 99 ? '99+' : unreadCount}
//                 </Text>
//             </View>
//         </Pressable>
//     );
// }

// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, Pressable } from 'react-native';
// import { socketService } from '@/services/SocketService';

// export default function Notifications() {
//     const [notifications, setNotifications] = useState([]);

//     useEffect(() => {
//         const unsubscribe = socketService.subscribe(setNotifications);
//         return unsubscribe;
//     }, []);

//     const renderNotification = ({ item }) => (
//         <Pressable 
//             className={`p-4 border-b ${item.isRead ? 'bg-gray-50' : 'bg-white'}`}
//             onPress={() => socketService.markAsRead(item.id)}
//         >
//             <Text className="font-bold">{item.type}</Text>
//             <Text>{item.message}</Text>
//             <Text className="text-gray-500 text-sm">
//                 {new Date(item.timestamp).toLocaleString()}
//             </Text>
//         </Pressable>
//     );

//     return (
//         <FlatList
//             data={notifications}
//             renderItem={renderNotification}
//             keyExtractor={item => item.id}
//         />
//     );
// }