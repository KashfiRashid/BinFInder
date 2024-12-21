/**
 * InfoPage Screen:
 * - Displays detailed information about various waste categories: Compost, Landfill, Paper, and Recycle.
 * - Features a sidebar with category selection, where each category is represented by a dot icon.
 * - The active category's details, including a description, extra information, and examples, are displayed in the main content area.
 * - A smooth animated transition shows the active category as the user scrolls through the sidebar.
 * - The sidebar includes an animated indicator that moves when a category is selected.
 * - Extra information and examples for each category can be toggled on/off with a button, providing more insights.
 * - A button at the bottom allows users to open a webpage with more details on the selected category.
 * - The screen is designed to make it easy for users to understand different waste categories and their importance.
 */


import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
  LayoutAnimation,
  Platform,
  ScrollView,
  UIManager,
  Image,
  StyleSheet
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

// Enable LayoutAnimation for Android to animate layout changes
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Asset imports for category images
const images = {
  CompostV1: require("../../assets/Info/Compost.png"),
  LandfillV1: require("../../assets/Info/Landfill.png"),
  PaperV1: require("../../assets/Info/MixedPaper.png"),
  RecycleV1: require("../../assets/Info/Recycle.png"),
  CompostV2: require("../../assets/Info/CompostV2.png"),
  LandfillV2: require("../../assets/Info/LandfillV2.png"),
  PaperV2: require("../../assets/Info/MixedPaperV2.png"),
  RecycleV2: require("../../assets/Info/RecycleV2.png"),
};

// Categories data: each category has an id, name, images, descriptions, and examples
const categories = [
  {
    id: 1,
    name: "Compost",
    imageV2: images.CompostV2,
    dotImage: images.CompostV1,
    description:
      "Composting turns organic waste into nutrient-rich soil. It reduces waste sent to landfills and lowers methane emissions.",
    extraInfo:
      "Composting is a crucial step to fight climate change by turning food scraps into a valuable resource. Ensure proper segregation to prevent contamination.",
    examples: ["Fruit peels", "Vegetable scraps", "Eggshells", "Yard trimmings"],
  },
  {
    id: 2,
    name: "Landfill",
    imageV2: images.LandfillV2,
    dotImage: images.LandfillV1,
    description:
      "Landfills are sites for waste that cannot be recycled or composted. They are designed to minimize environmental impact.",
    extraInfo:
      "Items sent to landfills are often non-recyclable and take years to decompose. Reducing landfill use requires proper segregation and conscious consumption.",
    examples: ["Plastic bags", "Styrofoam", "Sanitary products", "Broken ceramics"],
  },
  {
    id: 3,
    name: "Paper",
    imageV2: images.PaperV2,
    dotImage: images.PaperV1,
    description:
      "Recycling paper reduces deforestation and saves energy. It helps create new products from discarded items.",
    extraInfo:
      "Recycling paper reduces the demand for virgin materials, helping conserve forests and reduce landfill waste. Always clean paper before recycling.",
    examples: ["Newspapers", "Cardboard", "Office paper", "Paper packaging"],
  },
  {
    id: 4,
    name: "Recycle",
    imageV2: images.RecycleV2,
    dotImage: images.RecycleV1,
    description:
      "Recycling processes materials like plastics and metals into reusable products, conserving resources and reducing pollution.",
    extraInfo:
      "Proper recycling conserves energy and raw materials. Items such as plastics, metals, and glass must be cleaned and sorted before recycling.",
    examples: ["Plastic bottles", "Aluminum cans", "Glass jars", "Electronics"],
  },
];

// Dynamic layout calculations for spacing
const sidebarHeight = height * 0.9; // 90% of the screen height for the sidebar
const totalDotsHeight = height * 0.1 * categories.length; // Height of all dots
const availableSpace = sidebarHeight - totalDotsHeight; // Available space for dots
const gapBetweenDots = availableSpace / (categories.length + 1); // Dynamic gap calculation

export default function InfoPage() {
  const navigation = useNavigation(); // Hook to navigate between screens
  const [activeCategory, setActiveCategory] = useState(categories[0]); // State to track the active category
  const [showExamples, setShowExamples] = useState(false); // State to control showing examples
  const animationValue = useSharedValue(gapBetweenDots); // Shared value for animation

  // Handle category press and update the active category, with animation
  const handleCategoryPress = (category, index) => {
    setActiveCategory(category);
    setShowExamples(false); // Hide examples when a new category is selected
    animationValue.value = withTiming(
      gapBetweenDots + index * (height * 0.1 + gapBetweenDots),
      { duration: 500 }
    ); // Animate the active indicator to the new category
  };

  // Animated style for the active indicator (moves vertically)
  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animationValue.value }],
  }));

  // Toggle showing the examples with animation
  const toggleExamples = () => {
    LayoutAnimation.easeInEaseOut(); // Smooth transition for the example list
    setShowExamples((prev) => !prev); // Toggle state
  };

  // Open the external website for more details
  const openMoreDetails = () => {
    Linking.openURL("https://www.bcrecycles.ca/");
  };

  return (
    <View style={styles.container}>
      {/* Back Button to navigate to the previous screen */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="white" />
      </TouchableOpacity>

      {/* Sidebar displaying the category dots */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarBackground}>
          {/* Animated active indicator */}
          <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle]} />
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.dotContainer, { top: gapBetweenDots + index * (height * 0.1 + gapBetweenDots) }]}
              onPress={() => handleCategoryPress(category, index)}
            >
              {/* Dot for each category */}
              <Image source={category.dotImage} style={styles.dotImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main content area */}
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {/* Display the image for the active category */}
          <Image source={activeCategory.imageV2} style={styles.image} resizeMode="cover" />
        </View>
        <Text style={styles.categoryTitle}>{activeCategory.name}</Text>
        <ScrollView>
          {/* Description and extra information for the selected category */}
          <Text style={styles.description}>{activeCategory.description}</Text>
          <Text style={styles.extraInfo}>{activeCategory.extraInfo}</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleExamples}>
            <Text style={styles.toggleText}>
              {showExamples ? "Hide Examples ↑" : "Show Examples ↓"}
            </Text>
          </TouchableOpacity>
          {/* Show examples when toggled on */}
          {showExamples && (
            <View style={styles.examplesContainer}>
              {activeCategory.examples.map((example, index) => (
                <Text key={index} style={styles.exampleText}>
                  • {example}
                </Text>
              ))}
            </View>
          )}
        </ScrollView>
        {/* Link to more details on the web */}
        <TouchableOpacity style={styles.moreDetailsButton} onPress={openMoreDetails}>
          <Text style={styles.moreDetailsText}>More details on web →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#4B774E",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 10,
    borderRadius: 30,
    zIndex: 10,
  },
  sidebar: {
    width: width * 0.25,
    height: height,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  sidebarBackground: {
    width: "100%",
    height: sidebarHeight,
    backgroundColor: "#D9D9D9",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: height * 0.05,
    position: "relative",
    alignItems: "center",
  },
  activeIndicator: {
    position: "absolute",
    width: width * 0.3,
    height: height * 0.1,
    backgroundColor: "#4B774E",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    left: (width * 0.25 - width * 0.3) / 2,
  },
  dotContainer: {
    position: "absolute",
    left: (width * 0.25 - height * 0.1) / 2,
  },
  dotImage: {
    width: height * 0.1,
    height: height * 0.1,
    borderRadius: height * 0.05,
    backgroundColor: "#fff",
    elevation: 5,
  },
  content: {
    flex: 1,
    marginLeft: width * 0.1,
    padding: 18,
    marginTop: 20,
  },
  imageContainer: {
    width: "100%",
    height: height * 0.25,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  categoryTitle: {
    fontSize: width * 0.07,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  description: {
    fontSize: width * 0.045,
    color: "#FFFFFF",
    lineHeight: height * 0.03,
    marginTop: 10,
  },
  extraInfo: {
    fontSize: width * 0.045,
    color: "#FFFFFF",
    marginTop: 10,
  },
  toggleButton: {
    marginTop: 10,
  },
  toggleText: {
    fontSize: width * 0.05,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  examplesContainer: {
    marginTop: 10,
  },
  exampleText: {
    fontSize: width * 0.045,
    color: "#FFFFFF",
  },
  moreDetailsButton: {
    marginTop: 20,
  },
  moreDetailsText: {
    fontSize: width * 0.05,
    color: "#FFD700",
    textDecorationLine: "underline",
  },
});
