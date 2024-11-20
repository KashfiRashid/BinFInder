/**
 * TabNavigation.js
 * 
 * This file defines the bottom tab navigation for the BinFinder app.
 * It provides seamless navigation between the main screens: Home, Search, Quiz, and Profile.
 * Each tab is represented with an Ionicons icon and is styled for an intuitive user experience.
 * 
 * Key Features:
 * - Bottom tab navigation using `react-navigation/bottom-tabs`.
 * - Dynamic tab icons based on the current route.
 * - Custom styling for active and inactive states.
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Bottom tab navigator for switching between screens
import React from 'react';
import Home from '../Screens/Home'; // Home screen for core app features
import Quiz from '../Screens/Quiz'; // Quiz screen for swiping game functionality
import Scanner from '../Screens/Scanner'; // Scanner screen for waste identification
import Profile from '../Screens/Profile'; // Profile screen for user account management
import Ionicons from '@expo/vector-icons/Ionicons'; // Icon library for rendering tab icons

// Initialize the bottom tab navigator
const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      // Configure screen-specific options dynamically
      screenOptions={({ route }) => ({
        headerShown: false, // Disable headers for all tabs
        tabBarIcon: ({ color, size }) => {
          // Dynamically assign icons based on the current route name
          let iconName;
          if (route.name === 'Home') iconName = 'home'; // Home icon
          else if (route.name === 'Search') iconName = 'search'; // Search icon
          else if (route.name === 'Quiz') iconName = 'game-controller'; // Quiz icon
          else if (route.name === 'Profile') iconName = 'person'; // Profile icon

          return <Ionicons name={iconName} size={size} color={color} />; // Render the corresponding Ionicons icon
        },
        tabBarActiveTintColor: '#6200ee', // Color for active tab icons
        tabBarInactiveTintColor: '#888', // Color for inactive tab icons
        tabBarStyle: { 
          backgroundColor: '#f8f9fa', // Light background for the tab bar
          height: 60, // Height of the tab bar
          paddingBottom: 5, // Padding for better alignment
        },
      })}
    >
      {/* Define each tab with its name, component, and optional label */}
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Search" component={Scanner} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="Quiz" component={Quiz} options={{ tabBarLabel: 'Quiz' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}
