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

const requestLiveActivityPermission = async () => {
  const granted = await LiveActivitiesManager.requestPermission();
  if (granted) {
    console.log('Live Activity permission granted');
  }
};

const startDeliveryActivity = async () => {
  const activityContent = {
    driverName: "John Doe",
    estimatedArrival: "15:30",
    currentLocation: {
      latitude: 37.7749,
      longitude: -122.4194
    }
  };
  
  const activityId = await LiveActivitiesManager.startActivity(
    'delivery_tracking',
    activityContent
  );
};

const updateDeliveryLocation = async (activityId, newLocation) => {
  await LiveActivitiesManager.updateActivity(activityId, {
    currentLocation: newLocation,
    estimatedArrival: "15:45"
  });
};

const endDeliveryTracking = async (activityId) => {
  await LiveActivitiesManager.endActivity(activityId);
};

To make this work, you'll need to:

Set up the native iOS module (requires Swift code)
Configure your app's capabilities to include Live Activities
Create an Activity Configuration in your iOS project
Design your Live Activity interface using SwiftUI

Important Considerations:

Live Activities require iOS 16.1 or later
You'll need an Apple Developer account
Using Development Build means you can't use Expo Go anymore
You'll need to submit your app through TestFlight for testing
The community modules might not have all features of native implementation