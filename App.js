/**
 * App.js
 * 
 * This file serves as the entry point of the application.
 * It manages navigation, user authentication, and the app's main structure.
 * Depending on the user's authentication status, it directs them to either
 * the main application (TabNavigation) or the authentication screens (SignIn, CreateAccount).
 * 
 * Key Features:
 * - Listens for authentication state changes using Firebase.
 * - Uses a stack navigator to handle screen transitions.
 * - Displays a loading spinner while determining user authentication status.
 */

import React, { useEffect, useState } from 'react'; // React for components and hooks
import { NavigationContainer } from '@react-navigation/native'; // Navigation container for screen transitions
import { createStackNavigator } from '@react-navigation/stack'; // Stack navigator for handling screen hierarchy
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native'; // Core UI components
import { auth } from './App/Services/Firebase'; // Firebase authentication service for managing user state

// Import screens for authentication
import SignInScreen from './App/Screens/SignInScreen'; // Screen for user login
import CreateAccountScreen from './App/Screens/CreateAccountScreen'; // Screen for user registration

// Import the main application navigation
import TabNavigation from './App/Navigations/TabNavigation'; // Navigation for authenticated users

// Create a stack navigator for managing screen transitions
const Stack = createStackNavigator();

export default function App() {
  // State variables
  const [user, setUser] = useState(null); // Holds the authenticated user's data
  const [isLoading, setIsLoading] = useState(true); // Tracks whether the app is still loading user state

  // Effect: Listens for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser); // Update the user state when authentication changes
      setIsLoading(false); // Stop the loading spinner once user state is determined
    });
    return unsubscribe; // Cleanup subscription when the component unmounts
  }, []);

  // Display a loading spinner while determining the authentication state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* ActivityIndicator provides visual feedback during loading */}
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* NavigationContainer manages navigation and screen transitions */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Conditional rendering based on authentication state */}
          {user ? (
            // If user is authenticated, navigate to the main application
            <Stack.Screen name="Main" component={TabNavigation} />
          ) : (
            // If user is not authenticated, show the authentication screens
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

// Styles for the main container and loading view
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1, // Take up the full screen
    backgroundColor: '#fff', // White background for the entire app
  },
  loadingContainer: {
    flex: 1, // Center the content on the screen
    justifyContent: 'center', // Vertically align the spinner
    alignItems: 'center', // Horizontally align the spinner
    backgroundColor: '#fff', // White background for the loading screen
  },
});
