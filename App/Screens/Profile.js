/**
 * Profile Screen:
 * - Displays the user's profile information, including their email address and a placeholder profile picture.
 * - Fetches and displays the user's stats such as "Points" (cardScore) and "Pins" from Firebase Firestore.
 * - Provides a clean and intuitive card-based layout for displaying user details and statistics.
 * - Includes a "Sign Out" button that logs the user out and redirects them to the Sign-In screen.
 * - Includes a "Back" button that allows the user to navigate back to the previous screen.
 * - Data fetching happens on component mount, ensuring the profile and stats are up-to-date.
 * - The screen features a responsive design, adjusting to different device sizes for a consistent user experience.
 * - The "Sign Out" and "Back" buttons provide easy navigation and interaction for the user.
 * 
 * Key Features:
 * - **Profile Card**: Displays the user's email (if authenticated) and a placeholder profile image.
 * - **User Stats**: Shows the user's points (cardScore) and pins with icons for easy recognition.
 * - **Sign Out**: A button for logging out the current user, redirecting them to the Sign-In screen.
 * - **Responsive Layout**: The screen is optimized for various screen sizes, ensuring a consistent layout across devices.
 * 
 * Navigation:
 * - Utilizes **React Navigation** to handle screen transitions such as navigating back to the previous screen and redirecting to the Sign-In screen.
 * 
 * Firebase Integration:
 * - Fetches user data (score and pins) from Firebase Firestore using the user's UID to provide real-time information.
 */



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../Services/Firebase";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icon usage
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

const { width, height } = Dimensions.get("window"); // Get screen dimensions for responsive layout

export default function Profile() {
  const [score, setScore] = useState(0); // State to store the user's score (points)
  const [pins, setPins] = useState(0); // State to store the user's pins
  const navigation = useNavigation(); // Initialize navigation hook to handle navigation

  // Fetch user data from Firebase on component mount
  useEffect(() => {
    const fetchUserScore = async () => {
      const user = auth.currentUser; // Get the current authenticated user
      if (user) {
        // Access the user data from Firebase Firestore using the user's UID
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // Update the score and pins state from the fetched Firestore data
          setScore(userDoc.data().cardScore || 0); 
          setPins(userDoc.data().pins || 0); 
        }
      }
    };

    fetchUserScore(); // Call the function to fetch the user score and pins
  }, []);

  // Function to handle sign out logic
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the current user from Firebase Auth
      navigation.replace("SignIn"); // Redirect to Sign-In screen after sign out
    } catch (error) {
      console.error("Error signing out:", error.message); // Log any errors during sign out
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // Go back to the previous screen
      >
        <Ionicons name="chevron-back" size={30} color="#4B774E" /> {/* Chevron icon for back button */}
      </TouchableOpacity>

      {/* User Profile Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image for user profile picture
          style={styles.profileImage} // Style for profile image
        />
        <Text style={styles.nameText}>
          {auth.currentUser?.email || "Guest User"} {/* Display user's email or 'Guest User' if not authenticated */}
        </Text>
      </View>

      {/* User Stats Section */}
      <View style={styles.statsContainer}>
        {/* Points Card */}
        <View style={styles.statCard}>
          <Ionicons name="star-outline" size={30} color="#FFD700" /> {/* Star icon for points */}
          <Text style={styles.statValue}>{score}</Text> {/* Display the user's score */}
          <Text style={styles.statLabel}>Points</Text> {/* Label for points */}
        </View>
        {/* Pins Card */}
        <View style={styles.statCard}>
          <Ionicons name="pin-outline" size={30} color="#4B774E" /> {/* Pin icon for pins */}
          <Text style={styles.statValue}>{pins}</Text> {/* Display the user's pins */}
          <Text style={styles.statLabel}>Pins</Text> {/* Label for pins */}
        </View>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={24} color="#fff" /> {/* Log-out icon */}
        <Text style={styles.signOutText}>Sign Out</Text> {/* Text for sign-out */}
      </TouchableOpacity>
    </View>
  );
}

// Styling for the Profile screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4B774E", // Background color for the entire screen
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50, // Padding to give space from the top
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Background color with slight transparency
    borderRadius: 50, // Circular button
    padding: 8,
    elevation: 5, // Shadow for the button
  },
  card: {
    width: width * 0.9, // Responsive width
    backgroundColor: "#FFFFFF", // White background for the profile card
    borderRadius: 15, // Rounded corners for the card
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, // Subtle shadow for a soft elevation effect
    shadowRadius: 5,
    elevation: 5, // Elevation for Android
    marginTop: 20, // Space from the top
  },
  profileImage: {
    width: 100, // Image width
    height: 100, // Image height
    borderRadius: 50, // Circular image
    marginBottom: 15, // Space below the image
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Dark color for the name text
    marginBottom: 10, // Space below the name
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Equal spacing between stats
    marginTop: 20,
    width: "100%", // Full width for stats container
  },
  statCard: {
    width: "45%", // Width of each stat card
    backgroundColor: "#FFFFFF", // White background for the stat cards
    borderRadius: 10, // Rounded corners
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Soft shadow effect
    shadowRadius: 5,
    elevation: 3, // Elevation for Android
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Dark color for stat values
    marginTop: 8, // Space above the value
  },
  statLabel: {
    fontSize: 14,
    color: "#666", // Lighter color for the stat label
    marginTop: 5, // Space above the label
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40, // Space from the stats section
    backgroundColor: "#E74C3C", // Red background for the sign-out button
    padding: 15,
    borderRadius: 10,
    width: width * 0.8, // Responsive width for the button
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Soft shadow effect
    shadowRadius: 5,
    elevation: 3, // Elevation for Android
  },
  signOutText: {
    color: "white", // White text color for sign-out
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10, // Space between icon and text
  },
});
