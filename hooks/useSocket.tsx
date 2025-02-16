import { useEffect, useRef, useState } from "react";
import io, { Socket, SocketOptions } from "socket.io-client";

interface Notification<T = any> {
    id: string; // Unique identifier for each notification
    type: string; // The event type (name of the socket event)
    data: T; // The payload received with the event
    timestamp: Date; // Timestamp when the notification was received
    isRead: boolean; // Read status
}

interface UseSocketOptions {
    url: string; // The socket server URL
    options?: SocketOptions; // Optional socket.io-client options
    events: string[]; // List of events to listen for
}

interface UseSocketReturn<T = any> {
    notifications: Notification<T>[]; // List of notifications
    notificationCount: number; // Count of unread notifications
    resetNotificationCount: () => void; // Method to reset notification count
    markNotificationAsRead: (notificationId: string) => void; // Mark notification as read
    removeNotification: (notificationId: string) => void; // Remove a notification
}

const useSocket = <T = any>({
    url,
    options,
    events
}: UseSocketOptions): UseSocketReturn<T> => {
    const [notifications, setNotifications] = useState<Notification<T>[]>([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const socket = useRef<Socket | null>(null);

    useEffect(() => {
        if(!socket.current){
            socket.current = io(url, {
                ...options,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });
            socket.current.on('connect', () => {
                console.log('Connected to notification server');
            });

            events.forEach((event) => {
                socket.current?.on(event, (data: T & { id?: string }) => {
                    const newNotification: Notification<T> = {
                        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Fallback if no ID
                        type: event,
                        data,
                        timestamp: new Date(),
                        isRead: false,
                    };

                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        newNotification,
                    ]);

                    setNotificationCount((prevCount) => prevCount + 1);
                });
            });

            socket.current.on("error", (errorMessage: string) => {
                console.error("Error:", errorMessage);
            });
            socket.current.on('disconnect', () => {
                console.log('Disconnected from notification server');
            });
        }

        return () => {
            if(socket.current){
                console.log("Cleaning up socket...");
                events.forEach((event) => {
                    socket.current?.off(event);
                });
                socket.current.off("connect");
                socket.current.off("error");
                socket.current.off("disconnect");
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, [url]);

    const resetNotificationCount = () => setNotificationCount(0);

    const markNotificationAsRead = (notificationId: string) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
        // You might want to send this to your server
        socket.current?.emit('markAsRead', {notificationId});
    };

    const removeNotification = (notificationId: string) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter(
                (notification) => notification.id !== notificationId
            )
        );
    };

    return {
        notifications,
        notificationCount,
        resetNotificationCount,
        markNotificationAsRead,
        removeNotification,
    };
};

export default useSocket;