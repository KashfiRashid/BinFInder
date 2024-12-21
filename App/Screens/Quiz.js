/*
  SwipeCard Component

  This component implements a swipe-based card game where users categorize items into four categories: 
  Landfill, Compost, Recycle, and Mixed Paper. The game displays cards with images and labels, and 
  the user interacts with the cards by swiping them in the correct direction corresponding to the category. 
  The component tracks the number of correct matches and total swipes, updating the user's progress 
  in Firebase in real-time. Additionally, it provides a modal that displays instructions for playing the game.

  Key Features:
  - Swipe functionality with PanResponder and Animated API for interactive card movement.
  - Firebase integration to store user progress (correct matches and total swipes).
  - Random card generation with unique labels and images based on pre-defined categories (Landfill, Compost, Recycle, Paper).
  - Real-time feedback to the user on the correctness of their swipe (displaying "Correct!" or "Wrong!").
  - Modal to display rules/instructions on how to play the game.
  - Option to reset the game, generating a new set of cards and restarting the swipe count.

  Functions:
  - **generateCards:** Randomly selects 10 unique cards (with labels and images) from predefined categories 
    (Landfill, Compost, Recycle, Paper). Ensures that no duplicate images are selected.
  - **removeItem:** Called when a card is swiped in a direction. It checks if the swipe matches the correct category 
    and updates the user's Firebase document with the new progress (correct matches and total swipes). 
    The card is then removed from the screen.
  - **resetGame:** Resets the game state, including generating new cards and resetting the swipe count. 
    Clears previously used images and allows for a new game session.
  - **renderRulesModal:** Displays a modal with instructions for playing the game, showing how to swipe each card 
    to its correct category. It also includes a checkbox to allow the user to opt-out of showing the instructions again.
*/

import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Back button icon
import { imageMap } from "../Shared/imageMap";
import { auth, db } from "../Services/Firebase";
import { doc, updateDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

const user = auth.currentUser;

// Predefined arrays for card labels
const landfillArray = [
  "Plastic Straws", "Coffee Cups", "Pizza Box with Food", "Used Toothbrush",
  "Razors", "Styrofoam", "Worn Out Clothes", "Ceramic or Broken Glass",
  "Sanitary Products", "Plastic Cutlery",
];
const compostArray = [
  "Wooden Chopsticks", "Banana Peel", "Apple Scrap", "Pizza Crust",
  "Egg Shell", "Tea Bags", "Vegetable Peels", "Dry Leaves",
  "Mould Food", "Nut Shells",
];
const paperArray = [
  "Paper Bag", "Egg Carton", "Tetra Packs", "Cardboard Boxes",
  "Clamshell Boxes", "Envelopes", "Newspapers", "Magazines",
  "Kraft Bag", "Old Notebooks",
];
const recycleArray = [
  "Milk Gallon", "Plastic Bottle", "Aluminium Can", "Glass Bottles",
  "Shampoo Bottles", "Soda Caps", "Bottle Caps", "Glass Jars",
  "Tin Containers", "Aluminium Trays",
];

// Define card types with directions, categories, and folders
const cardTypes = [
  { direction: "left", category: "Landfill", folder: "Landfill", labels: landfillArray },
  { direction: "right", category: "Compost", folder: "Compost", labels: compostArray },
  { direction: "bottom", category: "Recycle", folder: "Recycle", labels: recycleArray },
  { direction: "top", category: "Mixed Paper", folder: "Paper", labels: paperArray },
];

// Initialize a set to track used images
let usedImages = new Set();

// Generate a random set of cards without duplicates
const generateCards = () => {
  let cards = [];
  while (cards.length < 10) {
    const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    const randomImageNumber = Math.floor(Math.random() * 10) + 1;
    const imageKey = `${randomType.folder[0].toUpperCase()}${randomImageNumber}`;

    if (!usedImages.has(imageKey)) {
      usedImages.add(imageKey);

      const imagePath = imageMap[randomType.folder][imageKey];
      const label = randomType.labels[randomImageNumber - 1];

      cards.push({
        ...randomType,
        image: imagePath,
        label,
      });
    }
  }
  return cards;
};

export default class SwipeCard extends Component {
  constructor() {
    super();
    this.state = {
      data: generateCards(),
      swipeCounts: { top: 0, right: 0, bottom: 0, left: 0 },
      correctMatches: 0,
      totalSwipes: 0,
      showRules: true,
      dontShowAgain: false,
      status: "",
      statusColor: "",
    };
  }

  removeItem = async (direction) => {
    const { data, swipeCounts, correctMatches } = this.state;
    const [currentCard, ...remainingCards] = data;

    const isCorrect = currentCard.direction === direction;

    if (isCorrect && user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        correctMatches: correctMatches + 1,
        totalSwipes: this.state.totalSwipes + 1,
      });
    }

    this.setState({
      data: remainingCards,
      swipeCounts: {
        ...swipeCounts,
        [direction]: swipeCounts[direction] + 1,
      },
      correctMatches: correctMatches + (isCorrect ? 1 : 0),
      totalSwipes: this.state.totalSwipes + 1,
      status: isCorrect ? "Correct!" : "Wrong!",
      statusColor: isCorrect ? "green" : "red",
    });

    setTimeout(() => this.setState({ status: "", statusColor: "" }), 1000);
  };

  resetGame = () => {
    usedImages.clear();
    this.setState({
      data: generateCards(),
      swipeCounts: { top: 0, right: 0, bottom: 0, left: 0 },
      correctMatches: 0,
      totalSwipes: 0,
    });

    if (!this.state.dontShowAgain) {
      this.setState({ showRules: true });
    }
  };

  renderRulesModal = () => {
    const { showRules, dontShowAgain } = this.state;

    return (
      <Modal transparent={true} visible={showRules} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How to Play</Text>
            <Text style={styles.modalText}>
              Match the items to their correct categories by swiping:
            </Text>
            <Text style={styles.modalText}>🟡 Top: Mixed Paper</Text>
            <Text style={styles.modalText}>⚫ Left: Landfill</Text>
            <Text style={styles.modalText}>🟢 Right: Compost</Text>
            <Text style={styles.modalText}>🔵 Bottom: Recycle</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => this.setState({ showRules: false })}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => this.setState({ dontShowAgain: !dontShowAgain })}
            >
              <Text style={styles.checkbox}>
                {dontShowAgain ? "☑" : "☐"} Don't show again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    const { data, swipeCounts, correctMatches, status, statusColor } = this.state;
    const cardsLeft = data.length;

    return (
      <ImageBackground
        source={require("./QuizBackground.png")}
        style={styles.background}
      >
        {this.renderRulesModal()}
        {status !== "" && (
          <View style={[styles.statusPopup, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()} >
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.totalCounter}>Cards Left: {cardsLeft}</Text>
        <Text style={styles.correctCounter}>Correct: {correctMatches}</Text>
        <View style={styles.container}>
          {data.map((item, index) => (
            <Card
              key={`${item.category}-${index}`}
              item={item}
              index={index}
              removeItem={this.removeItem}
            />
          ))}
          {cardsLeft === 0 && (
            <View style={styles.playAgainContainer}>
              <TouchableOpacity onPress={this.resetGame}>
                <Text style={styles.playAgainButton}>Play Again</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.glassCounter}>
            <Text style={styles.counterText}>
              T: {swipeCounts.top} | R: {swipeCounts.right} | B: {swipeCounts.bottom} | L: {swipeCounts.left}
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

class Card extends Component {
  constructor() {
    super();
    this.pan = new Animated.ValueXY({ x: 0, y: 0 });
    this.rotate = this.pan.x.interpolate({
      inputRange: [-width, 0, width],
      outputRange: ["-40deg", "0deg", "40deg"],
    });
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: this.pan.x, dy: this.pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, g) => {
        const { removeItem, item } = this.props;
        const angle = Math.atan2(g.dy, g.dx) * (180 / Math.PI);
        let direction = null;

        if (angle >= -45 && angle <= 45) {
          direction = "right";
        } else if (angle > 45 && angle < 135) {
          direction = "bottom";
        } else if (angle >= 135 || angle <= -135) {
          direction = "left";
        } else if (angle < -45 && angle > -135) {
          direction = "top";
        }

        if (direction) {
          Animated.spring(this.pan, {
            toValue: {
              x: (direction === "right" ? width : direction === "left" ? -width : 0) * 2,
              y: (direction === "bottom" ? height : direction === "top" ? -height : 0) * 2,
            },
            useNativeDriver: true,
          }).start(() => {
            removeItem(direction);
            this.pan.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(this.pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    });
  }

  render() {
    const { item, index } = this.props;
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.center,
          {
            zIndex: 10 - index,
          },
        ]}
      >
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[
            styles.item,
            {
              transform: [
                { translateX: this.pan.x },
                { translateY: this.pan.y },
                { rotate: this.rotate },
              ],
              width: width * 0.6,
              height: height * 0.4,
            },
          ]}
        >
          <View style={styles.cardBackground}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.imageLabel}>{item.label}</Text>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    borderWidth: 1,
    borderColor: "#00000055",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  cardBackground: {
    backgroundColor: "#f2f8f2",
    borderRadius: 12,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "95%",
    height: "70%",
    borderRadius: 12,
    overflow: "hidden",
  },
  backButton : {
    top: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxContainer: {
    marginTop: 10,
  },
  checkbox: {
    fontSize: 16,
    color: "#333",
  },
  statusPopup: {
    position: "absolute",
    top: height * 0.75,
    left: width * 0.2,
    width: width * 0.6,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.8)", // Fallback color
  },
  statusText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  totalCounter: {
    position: "absolute",
    top: 80,
    left: 20,
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 5,
    borderRadius: 5,
  },
  correctCounter: {
    position: "absolute",
    top: 80,
    right: 20,
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 5,
    borderRadius: 5,
  },
  glassCounter: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  counterText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  playAgainContainer: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
  },
  playAgainButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
  },
    backButton: {
      position: "absolute",
      top: 20,
      left: 20,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      padding: 10,
      borderRadius: 30,
      zIndex: 1000, // Ensures it stays above all other components
    },
});

