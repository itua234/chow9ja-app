import React from 'react';
import useSocket from './useSocket';

// Type for our notification data
interface MessageData {
  message: string;
  sender: string;
}

const NotificationComponent = () => {
  // Define the events we want to listen to
  const socketEvents = ['new_message', 'user_joined', 'user_left'];
  
  // Initialize the hook
  const {
    notifications,
    notificationCount,
    resetNotificationCount,
    markNotificationAsRead,
    removeNotification
  } = useSocket<MessageData>(
    'http://your-socket-server.com', // Server URL
    {
      auth: {
        token: 'your-auth-token' // Your authentication token
      }
    },
    socketEvents
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          Notifications ({notificationCount} unread)
        </h2>
        {notificationCount > 0 && (
          <button
            onClick={resetNotificationCount}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border rounded ${
              notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
            }`}
          >
            <div className="flex justify-between">
              <h3 className="font-medium">{notification.type}</h3>
              <span className="text-sm text-gray-500">
                {notification.timestamp.toLocaleTimeString()}
              </span>
            </div>
            
            <p className="mt-2">
              {notification.data.message} from {notification.data.sender}
            </p>
            
            <div className="mt-2 space-x-2">
              {!notification.isRead && (
                <button
                  onClick={() => markNotificationAsRead(notification.id)}
                  className="text-sm text-blue-500"
                >
                  Mark as read
                </button>
              )}
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationComponent;