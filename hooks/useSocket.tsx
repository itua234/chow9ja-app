import { useEffect, useState } from "react";
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
    events,
}: UseSocketOptions): UseSocketReturn<T> => {
    const [notifications, setNotifications] = useState<Notification<T>[]>([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [socketInstance, setSocket] = useState<Socket | null>(null); // Add this state

    useEffect(() => {
        const socket: Socket = io(url, options);
        setSocket(socket); // Store socket in state

        socket.on('connect', () => {
            console.log('Connected to notification server');
        });

        events.forEach((event) => {
            socket.on(event, (data: T) => {
                const newNotification: Notification<T> = {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

        socket.on("error", (errorMessage: string) => {
            console.error("Error:", errorMessage);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from notification server');
        });

        return () => {
            console.log("Cleaning up socket...");
            socket.off("connect");
            events.forEach((event) => {
                socket.off(event);
            });
            socket.disconnect();
        };
    }, [url, options, events]);

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
        socketInstance?.emit('markAsRead');
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