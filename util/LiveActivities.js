// LiveActivities.js
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

class LiveActivitiesManager {
  constructor() {
    if (Platform.OS !== 'ios') {
      console.warn('Live Activities are only supported on iOS 16.1 and above');
      return;
    }
    
    this.eventEmitter = new NativeEventEmitter(NativeModules.LiveActivities);
    this.listeners = new Map();
  }

  // Request permission to display Live Activities
  async requestPermission() {
    try {
      const result = await NativeModules.LiveActivities.requestPermission();
      return result;
    } catch (error) {
      console.error('Error requesting Live Activities permission:', error);
      return false;
    }
  }

  // Start a new Live Activity
  async startActivity(activityId, initialContent) {
    try {
      const result = await NativeModules.LiveActivities.start(activityId, initialContent);
      return result;
    } catch (error) {
      console.error('Error starting Live Activity:', error);
      return null;
    }
  }

  // Update an existing Live Activity
  async updateActivity(activityId, content) {
    try {
      const result = await NativeModules.LiveActivities.update(activityId, content);
      return result;
    } catch (error) {
      console.error('Error updating Live Activity:', error);
      return false;
    }
  }

  // End a specific Live Activity
  async endActivity(activityId) {
    try {
      const result = await NativeModules.LiveActivities.end(activityId);
      return result;
    } catch (error) {
      console.error('Error ending Live Activity:', error);
      return false;
    }
  }

  // End all Live Activities for the app
  async endAllActivities() {
    try {
      const result = await NativeModules.LiveActivities.endAll();
      return result;
    } catch (error) {
      console.error('Error ending all Live Activities:', error);
      return false;
    }
  }

  // Get all active Live Activities
  async getActivities() {
    try {
      const activities = await NativeModules.LiveActivities.getAll();
      return activities;
    } catch (error) {
      console.error('Error getting Live Activities:', error);
      return [];
    }
  }

  // Listen for Live Activity updates
  addListener(activityId, callback) {
    const subscription = this.eventEmitter.addListener(
      `LiveActivity_${activityId}`,
      callback
    );
    this.listeners.set(activityId, subscription);
    return subscription;
  }

  // Remove listener for a specific activity
  removeListener(activityId) {
    const subscription = this.listeners.get(activityId);
    if (subscription) {
      subscription.remove();
      this.listeners.delete(activityId);
    }
  }
}

export default new LiveActivitiesManager();