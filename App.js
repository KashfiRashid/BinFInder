/**
 * App.js
 * 
 * Entry point of the application. Manages user authentication state and routes
 * users to the appropriate screens based on their login status.
 * 
 * Key Features:
 * - Listens for Firebase authentication state changes.
 * - Uses a stack navigator to handle transitions between screens.
 * - Displays a loading spinner during authentication state checks.
 * - Directs authenticated users to the main application and unauthenticated users
 *   to the sign-in or account creation screens.
 */

import React, { useEffect, useState } from 'react'; // React for functional components and hooks
import { NavigationContainer } from '@react-navigation/native'; // Navigation container to manage app routes
import { createStackNavigator } from '@react-navigation/stack'; // Stack navigator for managing screen hierarchy
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native'; // Core components for UI and layout
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for local data persistence
import { auth } from './App/Services/Firebase'; // Firebase service for authentication

// Import authentication screens
import SignInScreen from './App/Screens/SignInScreen'; // User login screen
import CreateAccountScreen from './App/Screens/CreateAccountScreen'; // User registration screen

// Import main app navigation for authenticated users
import StackNavigation from './App/Navigations/StackNavigation'; // Navigation structure for the main application

// Create a stack navigator to manage screen transitions
const Stack = createStackNavigator();

export default function App() {
  // State to manage the current authenticated user
  const [user, setUser] = useState(null); // Tracks whether a user is authenticated
  const [isLoading, setIsLoading] = useState(true); // Tracks whether authentication state is being determined

  // Effect: Listen for changes to the authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser); // Update the `user` state with the authenticated user or `null`
      setIsLoading(false); // Stop the loading spinner after determining authentication state
      testAsyncStorage(); // Test functionality of AsyncStorage (for debugging purposes)
    });

    return unsubscribe; // Cleanup the Firebase listener when the component unmounts
  }, []);

  // Test function to demonstrate AsyncStorage functionality
  const testAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem('testKey', 'testValue'); // Save a key-value pair in AsyncStorage
      const value = await AsyncStorage.getItem('testKey'); // Retrieve the saved value
      console.log('AsyncStorage Test Value:', value); // Output: "testValue"
    } catch (error) {
      console.error('AsyncStorage Test Error:', error); // Log errors (if any) during AsyncStorage operations
    }
  };

  // Display a loading spinner while checking the authentication state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* ActivityIndicator: Shows a spinner to indicate loading */}
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // Render the app structure based on the authentication state
  return (
    <SafeAreaView style={styles.safeContainer}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // If the user is authenticated, show the main application screens
            <Stack.Screen name="Main" component={StackNavigation} />
          ) : (
            // If the user is not authenticated, show the authentication screens
            <>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

// Styles for the app's main layout and loading spinner
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1, // Ensures the container takes up the entire screen
    backgroundColor: '#fff', // White background for the app
  },
  loadingContainer: {
    flex: 1, // Centers the content vertically and horizontally
    justifyContent: 'center', // Vertically align the spinner
    alignItems: 'center', // Horizontally align the spinner
    backgroundColor: '#fff', // White background while loading
  },
});
