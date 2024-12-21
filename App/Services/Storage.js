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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from './Firebase'; // Adjust import path as needed

// Save data to AsyncStorage
export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Load data from AsyncStorage
export const loadData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Clear data from AsyncStorage
export const clearData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

/**
 * Sync user score between Firestore and AsyncStorage
 * 
 * @returns {Promise<number>} - The user's score
 */
export const syncScore = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.warn('No authenticated user');
    return 0; // Default score
  }

  const localKey = `score_${user.uid}`;
  let localScore = await loadData(localKey);

  try {
    const userRef = doc(db, "Scores", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const firestoreScore = userDoc.data().score || 0;

      // Sync local data if different
      if (localScore === null || localScore !== firestoreScore) {
        await saveData(localKey, firestoreScore); // Cache Firestore score locally
        return firestoreScore;
      } else {
        return localScore; // Return cached score if synced
      }
    } else {
      // Initialize Firestore score if document doesn't exist
      await setDoc(userRef, { score: 0 });
      await saveData(localKey, 0);
      return 0; // Initial score
    }
  } catch (error) {
    console.error('Error syncing score:', error);

    // Fallback to local score if Firestore is unavailable
    return localScore || 0;
  }
};

/**
 * Update user's score locally and in Firestore
 * 
 * @param {number} points - Points to add to the user's score
 */
export const updateScore = async (points) => {
  const user = auth.currentUser;
  if (!user) {
    console.warn('No authenticated user');
    return;
  }

  const localKey = `score_${user.uid}`;
  let localScore = await loadData(localKey);

  if (localScore === null) {
    localScore = 0; // Default to 0 if no local score exists
  }

  const newScore = localScore + points;

  // Update local storage
  await saveData(localKey, newScore);

  try {
    // Update Firestore
    const userRef = doc(db, "Scores", user.uid);
    await updateDoc(userRef, { score: newScore });
  } catch (error) {
    console.error('Error updating score in Firestore:', error);
  }
};
