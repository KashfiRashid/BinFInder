// /App/Services/Storage.js

/**
 * Storage.js
 * 
 * This file provides utility functions to manage local storage using AsyncStorage in React Native.
 * AsyncStorage is a simple, unencrypted, asynchronous, and persistent key-value storage system.
 * It is used to store lightweight data on the user's device.
 * 
 * Key Features:
 * - Save data to AsyncStorage.
 * - Load data from AsyncStorage.
 * - Clear data from AsyncStorage.
 * 
 * Current Use Case:
 * - Local storage for lightweight data such as user preferences, temporary states, or cached results.
 * - Provides a way to store user-specific settings or data that can be accessed even when offline.
 * 
 * Future Potential:
 * - **User Preferences:** Store user-specific preferences like dark mode, preferred language, and default location.
 * - **Cached Data:** Save recently accessed data such as trashcan locations or quiz scores for faster load times.
 * - **Offline Support:** Enable the app to function offline by storing essential data locally.
 * - **Temporary User State:** Save temporary states, such as unsaved inputs or ongoing quiz progress.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage module for local storage

/**
 * Save data to AsyncStorage
 * 
 * @param {string} key - The key under which the value will be stored.
 * @param {any} value - The value to be stored. It is serialized to JSON.
 */
export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value); // Convert value to JSON string
    await AsyncStorage.setItem(key, jsonValue); // Save JSON string to AsyncStorage
  } catch (error) {
    console.error('Error saving data:', error); // Log error if saving fails
  }
};

/**
 * Load data from AsyncStorage
 * 
 * @param {string} key - The key of the value to be retrieved.
 * @returns {Promise<any>} - The parsed value retrieved from AsyncStorage, or null if not found.
 */
export const loadData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key); // Retrieve JSON string from AsyncStorage
    return jsonValue != null ? JSON.parse(jsonValue) : null; // Parse JSON string to an object
  } catch (error) {
    console.error('Error loading data:', error); // Log error if retrieval fails
  }
};

/**
 * Clear data from AsyncStorage
 * 
 * @param {string} key - The key of the value to be cleared.
 */
export const clearData = async (key) => {
  try {
    await AsyncStorage.removeItem(key); // Remove item from AsyncStorage
  } catch (error) {
    console.error('Error clearing data:', error); // Log error if removal fails
  }
};
