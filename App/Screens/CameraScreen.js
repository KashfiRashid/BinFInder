/**
 * CameraScreen.js
 * 
 * Provides a camera interface to capture images or pick from the gallery for analysis.
 * Supports toggling between two modes: Trash Mode and Trash Can Mode. The captured
 * or selected images are sent to the "Analyze" screen with the selected mode as data.
 * 
 * Key Features:
 * - Requests camera and gallery permissions on initial load.
 * - Switches between two modes: Trash Mode (default) and Trash Can Mode.
 * - Allows users to capture a picture using the camera or pick an image from the gallery.
 * - Displays the appropriate icons and text for the selected mode.
 * - Navigates to the "Analyze" screen with the image data and mode.
 */

import React, { useState, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Camera, CameraView } from "expo-camera"; // Importing camera functionality from expo-camera
import * as ImagePicker from "expo-image-picker"; // Importing image picker from expo-image-picker
import { Ionicons } from "@expo/vector-icons"; // Importing icons for UI
import { useNavigation } from "@react-navigation/native"; // Importing navigation for navigating between screens

const CameraScreen = ({ navigation }) => {
  const navigate = useNavigation(); // Hook to access navigation functionality
  const [hasCameraPermission, setHasCameraPermission] = useState(null); // State for camera permission
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null); // State for gallery permission
  const [mode, setMode] = useState("trash"); // Default mode set to 'trash'
  const [modeText, setModeText] = useState("Switched to Trash Mode"); // Text displaying current mode
  const cameraRef = useRef(null); // Reference for camera

  // Request permissions for camera and gallery when the component mounts
  React.useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync(); // Request camera permission
      setHasCameraPermission(cameraStatus.status === "granted"); // Update camera permission state
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Request gallery permission
      setHasGalleryPermission(galleryStatus.status === "granted"); // Update gallery permission state
    })();
  }, []);

  // Function to capture a picture using the camera
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true }); // Capture photo with base64 encoding
      navigation.navigate("Analyze", { imageUri: `data:image/jpg;base64,${photo.base64}`, mode }); // Navigate to Analyze screen with image and mode
    }
  };

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow image selection
      allowsEditing: true, // Allow editing of the image
      aspect: [4, 3], // Aspect ratio for cropping
      quality: 1, // Highest quality for the image
      base64: true, // Encode the image to base64
    });

    if (!result.canceled) {
      navigation.navigate("Analyze", { imageUri: `data:image/jpg;base64,${result.assets[0].base64}`, mode }); // Navigate to Analyze screen with selected image and mode
    }
  };

  // Toggle between Trash Mode and Trash Can Mode
  const toggleMode = () => {
    const newMode = mode === "trash" ? "trashCan" : "trash"; // Switch mode
    setMode(newMode); // Set the new mode
    setModeText(newMode === "trash" ? "Switched to Trash Mode" : "Switched to Trash Can Mode"); // Update the mode text
  };

  // If permissions are still being requested, show a loading message
  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <Text>Requesting permissions...</Text>;
  }

  // If permissions are denied, show an error message
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera or gallery.</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera}>
        {/* Display the current mode text */}
        <Text style={styles.modeText}>{modeText}</Text>

        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigate.goBack()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>

        {/* Left Toggle Button for Trash Mode */}
        <TouchableOpacity
          style={[styles.toggleButton, styles.toggleButtonLeft, mode === "trash" && styles.activeToggleButton]}
          onPress={toggleMode} // Toggle mode when pressed
        >
          <Ionicons name="trash-bin-outline" size={30} color={mode === "trash" ? "black" : "white"} />
        </TouchableOpacity>

        {/* Capture Button in the center */}
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureInnerCircle} />
        </TouchableOpacity>

        {/* Right Toggle Button for Trash Can Mode */}
        <TouchableOpacity
          style={[styles.toggleButton, styles.toggleButtonRight, mode === "trashCan" && styles.activeToggleButton]}
          onPress={toggleMode} // Toggle mode when pressed
        >
          <Ionicons name="trash-outline" size={30} color={mode === "trashCan" ? "black" : "white"} />
        </TouchableOpacity>

        {/* Gallery Picker Button */}
        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={30} color="white" />
        </TouchableOpacity>
      </CameraView>
    </SafeAreaView>
  );
};

export default CameraScreen;

// Styles for the CameraScreen components
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" }, // Full-screen container with black background
  camera: { flex: 1, justifyContent: "flex-end", alignItems: "center" }, // Camera view styling

  // Mode text displayed in the bottom center
  modeText: {
    position: "absolute",
    bottom: 140,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: "center",
  },

  // Toggle buttons for Trash and Trash Can Modes (left and right)
  toggleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  activeToggleButton: { backgroundColor: "#4caf50" }, // Green color for active mode

  // Left Toggle Button for Trash Mode
  toggleButtonLeft: { position: "absolute", bottom: 40, left: 40 },

  // Right Toggle Button for Trash Can Mode
  toggleButtonRight: { position: "absolute", bottom: 40, right: 40 },

  // Capture Button (centered)
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    marginBottom: 20,
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },

  // Gallery Picker Button
  galleryButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 10,
    borderRadius: 30,
  },

  // Back Button (top left)
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 10,
    borderRadius: 30,
  },
});
