/**
 * Home Screen:
 * - Displays an interactive Google Map to show trash can locations.
 * - Includes animated navigation buttons for easy navigation to other screens.
 * - Buttons include:
 *   - Camera (for taking pictures)
 *   - Info (for displaying information)
 *   - Quiz (for accessing a quiz)
 *   - Profile (for user profile management)
 * - Buttons scale in and out when pressed for visual feedback.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import GoogleMap from '../Components/Home/GoogleMap'; // Import the Google Map component to show the interactive map
import { useNavigation } from "@react-navigation/native"; // Hook to manage navigation
import { SafeAreaView } from 'react-native-safe-area-context'; // SafeAreaView to ensure UI doesn't go under notches or status bars
import Ionicons from '@expo/vector-icons/Ionicons'; // Icon library for buttons

// Get screen width for responsive design
const { width } = Dimensions.get('window');

export default function Home({ username }) {
  const { navigate } = useNavigation(); // Destructure 'navigate' from useNavigation to handle navigation

  // Initialize button scale for animation
  const [buttonScale] = useState(new Animated.Value(1));

  // Handle press-in animation (scale down)
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9, // Scale to 90%
      useNativeDriver: true, // Use native driver for performance
    }).start();
  };

  // Handle press-out animation (scale back to normal)
  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1, // Scale back to 100%
      useNativeDriver: true, // Use native driver for performance
    }).start();
  };

  // Animated style for buttons
  const animatedStyle = {
    transform: [{ scale: buttonScale }], // Apply scaling to buttons on press
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* GoogleMap component renders the map */}
      <GoogleMap />

      {/* Navigation buttons container */}
      <View style={styles.navigationContainer}>
        {/* Scanner Button - Navigate to Camera Screen */}
        <Animated.View style={[styles.navItem, animatedStyle]}>
          <TouchableOpacity
            style={[styles.buttonNav, styles.scannerButton]} // Styles for scanner button
            onPress={() => navigate("Camera", {})} // Navigate to Camera screen
            onPressIn={handlePressIn} // Start scale-down animation on press-in
            onPressOut={handlePressOut} // Reset scale on press-out
          >
            <Ionicons name="camera" color={'white'} size={32} /> {/* Camera icon */}
          </TouchableOpacity>
        </Animated.View>

        {/* Info Button - Navigate to InfoPage */}
        <Animated.View style={[styles.navItem, animatedStyle]}>
          <TouchableOpacity
            style={[styles.buttonNav, styles.infoButton]} // Styles for info button
            onPress={() => navigate("InfoPage", {})} // Navigate to Info page
            onPressIn={handlePressIn} // Start scale-down animation on press-in
            onPressOut={handlePressOut} // Reset scale on press-out
          >
            <Ionicons name="information-circle" color={'white'} size={32} /> {/* Info icon */}
          </TouchableOpacity>
        </Animated.View>

        {/* Quiz Button - Navigate to Quiz Screen */}
        <Animated.View style={[styles.navItem, animatedStyle]}>
          <TouchableOpacity
            style={[styles.buttonNav, styles.quizButton]} // Styles for quiz button
            onPress={() => navigate("Quiz", {})} // Navigate to Quiz screen
            onPressIn={handlePressIn} // Start scale-down animation on press-in
            onPressOut={handlePressOut} // Reset scale on press-out
          >
            <Ionicons name="game-controller" color={'white'} size={32} /> {/* Quiz icon */}
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Button - Navigate to Profile Screen */}
        <Animated.View style={[styles.navItem, animatedStyle]}>
          <TouchableOpacity
            style={[styles.buttonNav, styles.profileButton]} // Styles for profile button
            onPress={() => navigate("Profile", {})} // Navigate to Profile screen
            onPressIn={handlePressIn} // Start scale-down animation on press-in
            onPressOut={handlePressOut} // Reset scale on press-out
          >
            <Ionicons name="person" color={'white'} size={32} /> {/* Profile icon */}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// Styles for the Home screen
const styles = StyleSheet.create({
  container: {
    flex: 1, // Occupy the entire screen
    backgroundColor: '#4B774E', // Background color for aesthetic
  },
  navigationContainer: {
    position: 'absolute', // Position the buttons at the bottom of the screen
    bottom: 20, // Add space from the bottom
    width: '100%', // Occupy full width
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-around', // Distribute buttons evenly
    alignItems: 'center', // Align items vertically at center
    paddingHorizontal: 20, // Add horizontal padding
  },
  navItem: {
    alignItems: 'center', // Center the items in the button
    justifyContent: 'center', // Center the content
  },
  buttonNav: {
    width: 60, // Set button width
    height: 60, // Set button height
    borderRadius: 30, // Make buttons circular
    alignItems: 'center', // Align icon in the center of the button
    justifyContent: 'center', // Align icon in the center of the button
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scannerButton: {
    backgroundColor: "#2a5298", // Blue color for scanner button
  },
  infoButton: {
    backgroundColor: "#1d3c6e", // Dark blue for info button
  },
  quizButton: {
    backgroundColor: "#3c774e", // Green for quiz button
  },
  profileButton: {
    backgroundColor: "#d16348", // Orange for profile button
  },
});
