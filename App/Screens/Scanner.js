/**
 * Scanner.js
 * 
 * This screen allows users to identify the waste category of an item by analyzing an image.
 * Users can upload an image, which is processed using Google Cloud Vision API to detect labels.
 * The app matches detected labels with predefined categories to provide suggestions.
 * 
 * Key Features:
 * - Image selection using the device's native Image Picker via Expo ImagePicker.
 * - Image analysis using Google Cloud Vision API for label detection.
 * - Categorization of waste items into predefined categories: Landfill, Recycling, Mixed Paper, and Compost.
 * 
 * Current Implementation:
 * - The app utilizes Expo's `ImagePicker` to provide access to the device's native Image Picker, allowing users to select an image from their gallery.
 * 
 * Future Implementation:
 * - Integration of the device's native camera to allow users to capture images directly from within the app.
 * - Real-time analysis of images captured via the camera to streamline the waste identification process.
 * - Enhanced accuracy by refining the matching algorithm with a more extensive dataset of waste items.
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios'; // For making HTTP requests
import * as ImagePicker from 'expo-image-picker'; // Image selection from device
import * as FileSystem from 'expo-file-system'; // File manipulation for Base64 encoding

export default function Scanner() {
  // State variables
  const [imageUri, setImageUri] = useState(null); // Stores selected image URI
  const [labels, setLabels] = useState([]); // Detected labels from Google Vision API
  const [suggestion, setSuggestion] = useState("Unknown"); // Waste category suggestion

  // Waste categories (predefined)
  const landfill = [
    "plastic bag", "chip bag", "styrofoam cup", "plastic straw", "candy wrapper",
    "disposable diaper", "plastic utensils", "ceramic plate", "broken mirror", "light bulb",
    "ballpoint pen", "toothbrush", "vacuum bag", "polystyrene foam", "frozen food bag",
    "gloves", "single-use razor", "rubber bands", "plastic wrap", "styrofoam packaging",
    "plastic bubble wrap", "non-recyclable plastic", "toothpaste tube", "makeup remover pad",
    "CD", "plastic coffee pod", "foil-lined carton", "empty tube of toothpaste", "shoes",
  ];

  const recycling = [
    "aluminum can", "plastic water bottle", "glass jar", "milk jug", "soda can",
    "steel can", "cardboard box", "cereal box", "clean plastic container", "plastic bottle cap",
    "newspaper", "magazine", "office paper", "junk mail", "clean aluminum foil",
    "metal lid", "glass bottle", "detergent bottle", "food can", "cardboard tube",
    "plastic milk jug", "paper towel roll", "yogurt container", "shampoo bottle",
    "clean food container", "clean jar", "wine bottle", "juice bottle", "laundry detergent bottle",
    "plastic clamshell container", "water bottle", "plastic bottle", "bottle", "straws", "cup", "cutlery"
  ];

  const mixedPaper = [
    "printer paper", "envelope", "notebook", "paper bag", "file folder",
    "index card", "sticky note", "brochure", "catalog", "softcover book",
    "newspaper", "magazine", "advertisement flyer", "greeting card", "copy paper",
    "letterhead", "receipt", "paper napkin", "junk mail", "construction paper",
    "wrapping paper (non-metallic)", "manila folder", "paperboard packaging", "calendar paper",
    "postcard", "lined paper", "colored paper", "fax paper", "legal pad paper", "blueprint", "packaging"
  ];

  const compost = [
    "apple core", "banana peel", "coffee grounds", "tea bag", "vegetable scraps",
    "egg shell", "bread", "rice", "pasta", "corn cob",
    "fruit peel", "leafy greens", "grass clippings", "paper towel", "napkin",
    "wood chips", "compostable plate", "compostable cup", "flowers", "dead leaves",
    "nut shell", "hair", "feathers", "straw (plant-based)", "compostable utensils",
    "potato peels", "avocado skin", "fruit pits", "compostable bag", "shredded paper", "food"
  ];

  /**
   * Opens the image library for user to select an image.
   * Uses Expo's ImagePicker for media selection.
   */
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1, // High-quality image
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri); // Save selected image URI
      }
    } catch (error) {
      console.error('Error picking Image: ', error);
    }
  };

  /**
   * Analyzes the selected image using Google Cloud Vision API.
   * Converts the image to Base64 and sends it to the API for label detection.
   */
  const analyzeImage = async () => {
    try {
      if (!imageUri) {
        alert('Please select an image first.');
        return;
      }

      // API credentials and endpoint
      const apiKey = "AIzaSyCCXpMFpxB3uNStPq8HiQ9ACrUnN3Gm43o";
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      // Convert image to Base64
      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // API request payload
      const requestData = {
        requests: [
          {
            image: { content: base64ImageData },
            features: [{ type: 'LABEL_DETECTION', maxResults: 5 }], // Detect up to 5 labels
          },
        ],
      };

      // Make API call
      const apiResponse = await axios.post(apiURL, requestData);

      // Save labels from API response
      setLabels(apiResponse.data.responses[0].labelAnnotations);
    } catch (error) {
      console.error('Error analyzing image: ', error);
      alert('Error analyzing image. Please try again later.');
    }
  };

  /**
   * Matches the detected labels with predefined waste categories.
   * Updates the `suggestion` state based on the matched category.
   */
  const analyzeLabels = () => {
    if (labels.length > 0) {
      const isRecyclable = labels.some(label => recycling.includes(label.description.toLowerCase()));
      const isLandfill = labels.some(label => landfill.includes(label.description.toLowerCase()));
      const isMixedPaper = labels.some(label => mixedPaper.includes(label.description.toLowerCase()));
      const isCompost = labels.some(label => compost.includes(label.description.toLowerCase()));

      // Set suggestion based on matched category
      if (isRecyclable) {
        setSuggestion("This item is recyclable");
      } else if (isLandfill) {
        setSuggestion("This item is landfill waste");
      } else if (isMixedPaper) {
        setSuggestion("This item is mixed paper");
      } else if (isCompost) {
        setSuggestion("This item is compostable");
      } else {
        setSuggestion("This item does not match any category");
      }
    }
  };

  // Re-run label analysis whenever labels change
  useEffect(() => {
    analyzeLabels();
  }, [labels]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Waste Identifier</Text>
        <Text style={styles.subtitle}>Google Cloud Vision</Text>
      </View>

      {/* Body Section */}
      <View style={styles.body}>
        {/* Display the selected image */}
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}

        {/* Pick Image Button */}
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.text}>Choose an image...</Text>
        </TouchableOpacity>

        {/* Analyze Image Button */}
        <TouchableOpacity onPress={analyzeImage} style={styles.button}>
          <Text style={styles.text}>Analyze Image</Text>
        </TouchableOpacity>

        {/* Display labels and suggestion */}
        {labels.length > 0 && (
          <View>
            <Text style={styles.suggestion}>Suggestion: {suggestion}</Text>
            <Text style={styles.label}>Labels:</Text>
            {labels.map((label) => (
              <Text key={label.mid} style={styles.outputtext}>
                {label.description}
              </Text>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// Styles for the UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d3c6e',
    alignItems: 'center',
  },
  header: {
    width: "100%",
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: "#1d3c6e",
    paddingBottom: 20,
  },
  body: {
    flex: 1,
    width: "100%",
    alignItems: 'center',
    backgroundColor: "#242424",
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "white",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "white",
  },
  button: {
    backgroundColor: "#1d3c6e",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "white",
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 15,
    borderRadius: 10,
  },
  suggestion: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: "white",
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#a6a6a6",
    marginVertical: 5,
  },
  outputtext: {
    fontSize: 14,
    color: "#a6a6a6",
    marginVertical: 2,
  },
});