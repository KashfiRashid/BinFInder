/**
 * Header.js
 * 
 * This component represents the header section of the app. It includes:
 * - A placeholder for the app logo (currently commented out but can be activated).
 * - A search bar for users to input queries.
 * - A user profile section that displays the user's profile picture and username.
 * 
 * Current Functionality:
 * - The search bar is static and does not yet perform any actions or connect to APIs.
 * - The profile section uses a placeholder image and displays a username passed via props.
 * 
 * Future Potential:
 * - Dynamic Profile: The `username` and profile picture can be fetched from the backend using user authentication.
 * - Customizable Search: The search bar can be connected to a search engine or used to filter content dynamically.
 * - Improved Styling: Custom themes and additional features can be added for user interactivity.
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, Dimensions } from 'react-native';

export default function Header({ username }) {
  return (
    <View style={styles.headerContainer}>
      {/* Placeholder for the app logo */}
      {/* Uncomment this line and provide the correct logo path to display an app logo */}
      {/* <Image source={require('./../../../assets/logo.png')} style={styles.logo} /> */}

      {/* Search Bar */}
      <TextInput
        placeholder="Search"
        placeholderTextColor="#aaa" // Light gray placeholder text for better visibility
        style={styles.searchBar}
      />

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        {/* Profile Picture (Placeholder Image) */}
        {/* Replace the image source with dynamic user data fetched from a backend or local storage */}
        <Image
          source={require('./../../../assets/placeholder.jpg')} // Default placeholder image
          style={styles.userImage}
        />
        {/* Display the username */}
        <Text style={styles.usernameText}>{username || "Guest"}</Text> {/* Fallback to "Guest" if username is not provided */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Distribute space evenly between elements
    alignItems: 'center', // Center items vertically
    backgroundColor: '#1a1a1a', // Dark background for the header
    padding: 15, // Spacing around the container
  },
  logo: {
    width: 50, // Logo width
    height: 50, // Logo height
  },
  searchBar: {
    borderWidth: 1, // Border around the search bar
    borderColor: '#fff', // White border for visibility
    padding: 8, // Inner padding for better spacing
    borderRadius: 25, // Rounded edges for a smooth look
    paddingLeft: 15, // Padding on the left for text alignment
    color: '#fff', // Text color for user input
    width: Dimensions.get('screen').width * 0.5, // Half of the screen width
    backgroundColor: '#333', // Dark gray background
  },
  profileContainer: {
    alignItems: 'center', // Center align items in the profile section
  },
  userImage: {
    width: 50, // Profile image width
    height: 50, // Profile image height
    borderRadius: 25, // Circular image shape
    borderWidth: 2, // Border around the image
    borderColor: '#fff', // White border for contrast
  },
  usernameText: {
    color: '#fff', // White text color for username
    fontSize: 14, // Font size for username
    marginTop: 5, // Spacing above the text
    textAlign: 'center', // Center-align the username
  },
});
