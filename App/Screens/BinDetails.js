/**
 * BinDetails.js
 * 
 * Displays detailed information about a specific waste bin based on the data passed
 * from the previous screen. It shows the bin's image, username of the uploader, and
 * associated tags like landfill, compost, paper, and recycling.
 * 
 * Key Features:
 * - Fetches and displays the username of the user who uploaded the bin data.
 * - Displays the tags based on the bin's properties: landfill, compost, paper, recycling.
 * - Provides a back button to return to the previous screen.
 * - Dynamically applies styles to the tags based on their state (active/inactive).
 */

import { useNavigation, useRoute } from "@react-navigation/native"; // Import hooks for navigation and accessing route params
import { useEffect, useState } from "react"; // Import React hooks for state and side effects
import { SafeAreaView, Text, Image, StyleSheet, View, TouchableOpacity } from "react-native"; // Core React Native components
import { db } from "../Services/Firebase"; // Import Firebase database service
import { doc, getDoc } from "firebase/firestore"; // Firebase functions to get document from Firestore

export default function BinDetails({ route }) {
  // Extract the 'pin' data passed through navigation params
  const pin = route.params;
  const landfill = pin.landfill; // Tag for landfill category
  const compost = pin.compost; // Tag for compost category
  const paper = pin.paper; // Tag for paper category
  const recycling = pin.recycling; // Tag for recycling category

  // Navigation hook to go back to the previous screen
  const navigate = useNavigation();

  // State variable to store the username of the person who uploaded the pin
  const [pinsUsername, setPinsUsername] = useState("");

  // Effect hook to run the function to fetch the username when the 'pin' data is available
  useEffect(() => {
    getPinUserName(pin); // Fetch the username for the uploaded pin
  }, [pin]); // Dependency array ensures this effect runs when 'pin' changes

  // Function to fetch the username associated with the uploaded pin from Firebase
  const getPinUserName = async (pin) => {
    const userRef = doc(db, "users", pin.userId); // Reference to the user document in Firestore
    const userDoc = await getDoc(userRef); // Fetch the user document
    setPinsUsername(userDoc.data().username); // Set the username in state
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Display Image of the bin */}
      <Image
        source={{ uri: pin.imageUrl }} // The image URL from the pin data
        style={styles.image}
        resizeMode="cover" // Cover the entire image area while maintaining aspect ratio
      />

      {/* Display the uploaded username */}
      <Text style={styles.uploadedByText}>Uploaded by: {pinsUsername}</Text>

      {/* Display the tags (landfill, compost, paper, recycling) */}
      <View style={styles.tagsContainer}>
        {/* Render each tag based on the presence of the respective property */}
        <TouchableOpacity
          style={[styles.tag, landfill ? styles.activeTag : null]} // If landfill is true, apply activeTag style
        >
          <Text
            style={[
              styles.tagText,
              landfill ? styles.activeTagText : null, // If landfill is true, apply active tag text style
            ]}
          >
            Landfill
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tag, compost ? styles.activeTag : null]} // If compost is true, apply activeTag style
        >
          <Text
            style={[
              styles.tagText,
              compost ? styles.activeTagText : null, // If compost is true, apply active tag text style
            ]}
          >
            Compost
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tag, paper ? styles.activeTag : null]} // If paper is true, apply activeTag style
        >
          <Text
            style={[
              styles.tagText,
              paper ? styles.activeTagText : null, // If paper is true, apply active tag text style
            ]}
          >
            Paper
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tag, recycling ? styles.activeTag : null]} // If recycling is true, apply activeTag style
        >
          <Text
            style={[
              styles.tagText,
              recycling ? styles.activeTagText : null, // If recycling is true, apply active tag text style
            ]}
          >
            Recycling
          </Text>
        </TouchableOpacity>
      </View>

      {/* Go back button to navigate to the previous screen */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigate.goBack()} // Navigate back to the previous screen
      >
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles for the BinDetails screen components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full screen
    alignItems: "center", // Center items horizontally
    justifyContent: "center", // Center items vertically
    padding: 16, // Padding around the container
    backgroundColor: "#F7F8FA", // Light background color
  },
  image: {
    width: 300, // Set the width of the image
    height: 200, // Set the height of the image
    borderRadius: 10, // Rounded corners for the image
    marginBottom: 16, // Bottom margin for spacing
  },
  uploadedByText: {
    fontSize: 16, // Font size for the uploaded by text
    color: "#333", // Text color
    marginBottom: 20, // Margin bottom to separate from the tags
  },
  tagsContainer: {
    flexDirection: "row", // Arrange tags horizontally
    flexWrap: "wrap", // Allow wrapping of tags onto new lines if necessary
    justifyContent: "center", // Center the tags horizontally
    marginBottom: 30, // Margin at the bottom
  },
  tag: {
    backgroundColor: "#555", // Default background color for tags
    paddingHorizontal: 15, // Horizontal padding for tags
    paddingVertical: 10, // Vertical padding for tags
    borderRadius: 20, // Rounded corners for tags
    margin: 5, // Margin between tags
  },
  activeTag: {
    backgroundColor: "#4CAF50", // Active tag background color (green)
  },
  tagText: {
    color: "#FFF", // Text color for tags
    fontSize: 14, // Font size for tag text
  },
  activeTagText: {
    fontWeight: "bold", // Bold text for active tags
  },
  backButton: {
    backgroundColor: "#007BFF", // Blue background for the back button
    paddingVertical: 12, // Vertical padding for the back button
    paddingHorizontal: 20, // Horizontal padding for the back button
    borderRadius: 10, // Rounded corners for the button
    alignItems: "center", // Center button content horizontally
    justifyContent: "center", // Center button content vertically
  },
  backButtonText: {
    color: "#FFF", // White text color for the back button text
    fontSize: 16, // Font size for the back button text
    fontWeight: "bold", // Bold text for the back button text
  },
});
