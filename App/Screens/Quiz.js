/**
 * Quiz.js
 *
 * This screen serves as a base for a swiping quiz game. Each card holds an image (currently represented by colors) 
 * that users swipe in the correct direction to accumulate points.
 *
 * Key Features:
 * - Random card generation with swipe directions.
 * - Animated swipe interactions using `PanResponder` and `Animated`.
 * - Tracks user scores and swipe accuracy.
 * - Reset functionality for replayability.
 *
 * Planned Enhancements:
 * - Replace colored cards with actual images.
 * - Add scoring logic based on images and matched directions.
 * - Provide feedback animations or sounds for correct and incorrect swipes.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

// Placeholder card types with swipe directions (replace colors with images in the future)
const cardTypes = [
  { color: 'black', direction: 'left' },
  { color: 'green', direction: 'right' },
  { color: 'blue', direction: 'bottom' },
  { color: '#8B8000', direction: 'top' },
];

// Function to generate random cards
const generateCards = () => {
  let cards = [];
  for (let i = 0; i < 10; i++) {
    const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    cards.push(randomType);
  }
  return cards;
};

const Quiz = () => {
  // State for managing cards, swipe counts, and scores
  const [data, setData] = useState(generateCards());
  const [swipeCounts, setSwipeCounts] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [correctMatches, setCorrectMatches] = useState(0);
  const [totalSwipes, setTotalSwipes] = useState(0);

  /**
   * Handles card removal and checks if the swipe was correct.
   * @param {string} direction - The direction the user swiped.
   */
  const removeItem = (direction) => {
    const [currentCard, ...remainingCards] = data;

    const isCorrect = currentCard.direction === direction;
    setData(remainingCards); // Remove the swiped card
    setSwipeCounts((prev) => ({
      ...prev,
      [direction]: prev[direction] + (isCorrect ? 1 : 0), // Update swipe counts
    }));
    setCorrectMatches((prev) => prev + (isCorrect ? 1 : 0)); // Update correct matches
    setTotalSwipes((prev) => prev + 1); // Increment total swipes
  };

  /**
   * Resets the game by regenerating cards and resetting counters.
   */
  const resetGame = () => {
    setData(generateCards());
    setSwipeCounts({ top: 0, right: 0, bottom: 0, left: 0 });
    setCorrectMatches(0);
    setTotalSwipes(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.totalCounter}>Cards Left: {data.length}</Text>
      <Text style={styles.correctCounter}>Correct: {correctMatches}</Text>

      <View style={styles.swipeContainer}>
        {/* Render swipeable cards */}
        {data.map((item, index) => (
          <SwipeableCard
            key={`${item.color}-${index}`}
            item={item}
            index={index}
            removeItem={removeItem}
          />
        ))}

        {/* Show reset button when all cards are swiped */}
        {data.length === 0 && (
          <View style={styles.playAgainContainer}>
            <TouchableOpacity onPress={resetGame} style={styles.playAgainButton}>
              <Text style={styles.playAgainText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Display swipe counters */}
        <View style={styles.glassCounter}>
          <Text style={styles.counterText}>
            T: {swipeCounts.top} | R: {swipeCounts.right} | B: {swipeCounts.bottom} | L: {swipeCounts.left}
          </Text>
        </View>
      </View>
    </View>
  );
};

const SwipeableCard = ({ item, index, removeItem }) => {
  // State for managing animations
  const pan = new Animated.ValueXY({ x: 0, y: 0 });
  const rotate = pan.x.interpolate({ inputRange: [-width, 0, width], outputRange: ['-40deg', '0deg', '40deg'] });

  // PanResponder for handling swipe gestures
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, g) => {
      const angle = Math.atan2(g.dy, g.dx) * (180 / Math.PI); // Calculate swipe angle
      let direction = null;

      // Determine swipe direction based on angle
      if (angle >= -45 && angle <= 45) direction = 'right';
      else if (angle > 45 && angle < 135) direction = 'bottom';
      else if (angle >= 135 || angle <= -135) direction = 'left';
      else if (angle < -45 && angle > -135) direction = 'top';

      if (direction) {
        // Animate the swipe and remove the card
        Animated.spring(pan, {
          toValue: {
            x: (direction === 'right' ? width : direction === 'left' ? -width : 0) * 2,
            y: (direction === 'bottom' ? height : direction === 'top' ? -height : 0) * 2,
          },
          useNativeDriver: true,
          bounciness: 0,
        }).start(() => {
          removeItem(direction);
          pan.setValue({ x: 0, y: 0 });
        });
      } else {
        // Return card to original position if no valid swipe
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.center,
        { zIndex: 10 - index, top: index * 10 },
      ]}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            backgroundColor: item.color, // Replace this with `item.image` when adding images
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { rotate },
            ],
            width: width * 0.6,
            height: height * 0.4,
          },
        ]}
      >
        <Text style={styles.cardText}>Swipe {item.direction}!</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  swipeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#00000055',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassCounter: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalCounter: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  correctCounter: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  playAgainContainer: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
  },
  playAgainButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
  },
  playAgainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Quiz;
