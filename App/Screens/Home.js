/**
 * Home.js
 * 
 * This screen serves as the main landing page for the BinFinder app. 
 * It combines a personalized header and an interactive Google Map component.
 * 
 * Key Features:
 * - Displays a personalized welcome message using the `Header` component.
 * - Shows an interactive map for users to explore trash can locations using the `GoogleMap` component.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../Components/Home/Header'; // Header component for personalized greetings
import GoogleMap from '../Components/Home/GoogleMap'; // Google Map component for displaying trash can locations

export default function Home({ username }) {
  return (
    <View style={styles.container}>
      {/* Header displays a welcome message, accepting the username as a prop */}
      <Header username={username} />

      {/* GoogleMap renders the interactive map for exploring trash cans */}
      <GoogleMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Occupies the entire screen
    backgroundColor: '#1a1a1a', // Dark theme background
    padding: 20, // Adds padding around the content
  },
});
