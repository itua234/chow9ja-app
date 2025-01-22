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



// config/axios.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
export const API_ERRORS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

// Config (Move to .env in production)
const CONFIG = {
  //baseURL: 'http://172.20.10.4:8080/api/v1/',
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://172.20.10.4:8080/api/v1/',
  appToken: process.env.EXPO_PUBLIC_APP_TOKEN || 'c2505e1877c35bff219c55c2820a0300a1fa3fdf33289e3fc5036c8fce2021d2',
  timeout: 15000,
};

// Create axios instance with default config
const client = axios.create({
  baseURL: CONFIG.baseURL,
  timeout: CONFIG.timeout,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor
client.interceptors.request.use(
  async (config) => {
    try {
      if (config.useAppToken) {
        config.headers.Authorization = `Bearer ${CONFIG.appToken}`;
      } else {
        const userToken = await AsyncStorage.getItem('user_token');
        if (userToken) {
          config.headers.Authorization = `Bearer ${userToken}`;
        }
      }
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      type: API_ERRORS.SERVER_ERROR,
      message: 'An unexpected error occurred',
      originalError: error,
      data: null,
    };

    if (!error.response) {
      customError.type = API_ERRORS.NETWORK_ERROR;
      customError.message = 'Network error - please check your connection';
      return Promise.reject(customError);
    }

    switch (error.response.status) {
      case 401:
        customError.type = API_ERRORS.UNAUTHORIZED;
        customError.message = 'Unauthorized - please login again';
        break;
      case 404:
        customError.type = API_ERRORS.NOT_FOUND;
        customError.message = 'Resource not found';
        break;
      case 422:
        customError.type = API_ERRORS.VALIDATION_ERROR;
        customError.message = 'Validation error';
        customError.data = error.response.data.errors;
        break;
    }

    return Promise.reject(customError);
  }
);

export default client;

// services/authService.js
import client from '../config/axios';

class AuthService {
  static async register(inputs) {
    try {
      const response = await client.post('auth/signup', inputs, { useAppToken: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const response = await client.post('auth/signin', { email, password }, { useAppToken: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async verifyEmail(email, code) {
    try {
      const response = await client.post('auth/signin', { email, code }, { useAppToken: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async sendCode(email, purpose) {
    try {
      const response = await client.get(`auth/email/${email}/${purpose}/send-code`, { useAppToken: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async verifyCode(email, code, purpose) {
    try {
      const response = await client.get(`auth/email/${email}/${code}/${purpose}/verify-code`, { useAppToken: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async forgotPassword(email) {
    try {
      const response = await client.get(`auth/email/${email}/password_reset/send-code`, { useAppToken: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async changePassword(inputs) {
    try {
      const response = await client.post('auth/change-password', inputs);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// services/walletService.js
import client from '../config/axios';

class WalletService {
  static async getWallet() {
    try {
      const response = await client.get('user/wallet');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async fundWallet(amount) {
    try {
      const response = await client.post('fund-wallet', { amount });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// services/bankService.js
import client from '../config/axios';

class BankService {
  static async getBanks() {
    try {
      const response = await client.get('banks', { useAppToken: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchAccount(account, code) {
    try {
      const response = await client.get(`account/verify/${account}/${code}`, { useAppToken: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// services/countryService.js
import axios from 'axios';

class CountryService {
  static async getFlags() {
    try {
      const response = await axios.get('https://country-code-au6g.vercel.app/Country.json');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Example usage
export {
  AuthService,
  WalletService,
  BankService,
  CountryService,
  API_ERRORS,
};