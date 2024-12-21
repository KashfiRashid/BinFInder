/**
 * TabNavigation.js
 * 
 * This file defines the bottom tab navigation for the BinFinder app.
 * It provides seamless navigation between the main screens: Home, Search, Quiz, Profile, and Info Page.
 * Each screen is accessible from the tab bar, offering users easy navigation throughout the app.
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Import the native stack navigator for screen transitions
import Home from '../Screens/Home'; // Import the Home screen component
import Quiz from '../Screens/Quiz'; // Import the Quiz screen component
import Profile from '../Screens/Profile'; // Import the Profile screen component
import CameraScreen from '../Screens/CameraScreen'; // Import the Camera screen component
import AnalyzeScreen from '../Screens/AnalyzeScreen'; // Import the Analyze screen component
import BinDetails from '../Screens/BinDetails'; // Import the BinDetails screen component
import InfoPage from '../Screens/InfoPage'; // Import the Info Page screen component

// Initialize the Native Stack Navigator for organizing the app screens
const HomeStack = createNativeStackNavigator();

// Define the main navigation structure for the app's bottom tab navigation
export default function StackNavigation() {
  return (
    <HomeStack.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Disable header for each screen (you may enable it if needed)
      })}
    >
      {/* Home Screen - Displays the main content of the app */}
      <HomeStack.Screen 
        name="Home" 
        component={Home} 
        options={{ tabBarLabel: 'Home' }} // Label for the Home tab
      />



      {/* Camera Screen - Allows users to take pictures for analysis */}
      <HomeStack.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ tabBarLabel: 'Camera' }} // Label for the Camera tab
      />

      {/* BinDetails Screen - Displays detailed information about a specific bin */}
      <HomeStack.Screen 
        name="BinDetails" 
        component={BinDetails} 
        options={{ tabBarLabel: 'BinDetails' }} // Label for the BinDetails tab
      />

      {/* Analyze Screen - Displays analysis or processing results */}
      <HomeStack.Screen 
        name="Analyze" 
        component={AnalyzeScreen} 
        options={{ tabBarLabel: 'Analyze' }} // Label for the Analyze tab
      />

      {/* Quiz Screen - Displays the quiz section of the app */}
      <HomeStack.Screen 
        name="Quiz" 
        component={Quiz} 
        options={{ tabBarLabel: 'Quiz' }} // Label for the Quiz tab
      />

      {/* Profile Screen - Displays user's profile details */}
      <HomeStack.Screen 
        name="Profile" 
        component={Profile} 
        options={{ tabBarLabel: 'Profile' }} // Label for the Profile tab
      />

      {/* InfoPage Screen - Displays additional information or instructions */}
      <HomeStack.Screen 
        name="InfoPage" 
        component={InfoPage} 
        options={{ tabBarLabel: 'Info' }} // Label for the Info tab
      />
    </HomeStack.Navigator>
  );
}
