/**
 * GoogleMap.js
 * 
 * This component provides an interactive map view using `react-native-maps` and `expo-location`.
 * Users can interact with the map to view their current location, add pins, and navigate to trash can locations.
 * 
 * Key Features:
 * - **Current Location Tracking:** Displays the user's real-time location using GPS.
 * - **Pin Placement Mode:** Allows users to place pins on the map representing trash can locations.
 * - **Pin Confirmation and Removal:** Users can confirm, cancel, or mark pins as "removed."
 * - **Journey Pathway:** Displays a path from the user's current location to a selected pin.
 * - **Status Messages:** Displays fade-in/out status messages for user actions like pin confirmation or journey cancellation.
 * 
 * Native Features:
 * - GPS Integration: Tracks the user's current location using the device's GPS.
 * - Interactive Map: Uses the Google Maps interface for map rendering and marker management.
 * - Pin Drop: Allows users to place and confirm pins for trash cans.
 * 
 * User Workflow:
 * 1. Users can enable "Pin Placement Mode" to place a pin on the map for a new trash can location.
 * 2. The app prompts the user to confirm or cancel the pin placement.
 * 3. Once confirmed, the pin becomes a permanent marker for trash can locations.
 * 4. Users can click on a pin to start a journey or mark the trash can as removed.
 * 
 * Future Implementations:
 * - **Database Sync:** Connect with Firebase Realtime Database to save confirmed pins and share them with all users.
 * - **Advanced Navigation:** Integrate turn-by-turn navigation from the user's location to the selected pin.
 * - **Trash Can Categorization:** Allow users to categorize pins as recycling, landfill, or compost.
 * - **User Contributions:** Enable users to view and interact with trash can locations added by other users.
 */

import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function GoogleMap() {
  const [location, setLocation] = useState(null);
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [pathway, setPathway] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [pinPlacementMode, setPinPlacementMode] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const showStatusMessage = (message) => {
    setStatusMessage(message);
    setShowStatus(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowStatus(false));
      }, 2000);
    });
  };

  const handleAddPin = (coordinate) => {
    if (!pinPlacementMode) return;
    if (pins.some((pin) => pin.status === 'placed')) {
      showStatusMessage('Confirm or cancel the current pin first!');
      return;
    }

    const newPin = { coordinate, status: 'placed' };
    setPins([...pins, newPin]);
    promptPinConfirmation(newPin);
  };

  const promptPinConfirmation = (pin) => {
    Alert.alert(
      'Trash Can Location',
      'Confirm this location?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            setPins((prevPins) => prevPins.filter((p) => p !== pin));
            showStatusMessage('Pin removed.');
          },
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            setPins((prevPins) =>
              prevPins.map((p) => (p === pin ? { ...p, status: 'confirmed' } : p))
            );
            setPinPlacementMode(false);
            showStatusMessage('Pin confirmed.');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleMarkerPress = (pin, index) => {
    if (pin.status === 'confirmed') {
      setSelectedPin({ pin, index });
    }
  };

  const handleTrashCanRemoved = () => {
    const updatedPins = pins.map((p, idx) =>
      idx === selectedPin.index ? { ...p, status: 'removed' } : p
    );
    setPins(updatedPins);
    setSelectedPin(null);
    showStatusMessage('Trash can marked as removed.');
  };

  const handleStartJourney = async () => {
    if (!selectedPin) return;

    const { coordinate } = selectedPin.pin;

    const currentLocation = await Location.getCurrentPositionAsync({});
    const userLocation = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    setPathway([userLocation, coordinate]);

    const updatedPins = pins.map((p, idx) =>
      idx === selectedPin.index ? { ...p, status: 'walking' } : p
    );
    setPins(updatedPins);
    setSelectedPin(null);
    showStatusMessage('Journey started!');
  };

  const handleCancelJourney = () => {
    setPathway([]);
    showStatusMessage('Journey cancelled.');
  };

  const centerMapOnUser = async () => {
    const currentLocation = await Location.getCurrentPositionAsync({});
    const userLocation = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setLocation(userLocation);
    mapRef.current.animateToRegion(userLocation, 1000);
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={location}
          showsUserLocation
          showsMyLocationButton={false}
          onPress={(e) => handleAddPin(e.nativeEvent.coordinate)}
        >
          {pins.map((pin, index) => (
            <Marker
              key={index}
              coordinate={pin.coordinate}
              pinColor={
                pin.status === 'placed'
                  ? 'red'
                  : pin.status === 'walking'
                  ? 'blue'
                  : 'grey'
              }
              onPress={() => handleMarkerPress(pin, index)}
            />
          ))}

          {pathway.length > 0 && <Polyline coordinates={pathway} strokeColor="blue" strokeWidth={3} />}
        </MapView>
      )}

      {showStatus && (
        <Animated.View style={[styles.statusContainer, { opacity: fadeAnim }]}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </Animated.View>
      )}

      {selectedPin && (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleTrashCanRemoved}>
            <Text style={styles.actionText}>Trash Can Removed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleStartJourney}>
            <Text style={styles.actionText}>Start Journey</Text>
          </TouchableOpacity>
        </View>
      )}

      {pathway.length > 0 && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelJourney}>
          <Text style={styles.cancelText}>Cancel Journey</Text>
        </TouchableOpacity>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={centerMapOnUser}>
          <Ionicons name="locate" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, pinPlacementMode && styles.activeControlButton]}
          onPress={() => setPinPlacementMode(!pinPlacementMode)}
        >
          <Ionicons name="pin" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  statusContainer: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 10,
  },
  statusText: { color: '#fff', fontWeight: 'bold' },
  actionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  actionButton: { backgroundColor: '#27ae60', padding: 10, borderRadius: 5, marginVertical: 5 },
  actionText: { color: '#fff' },
  cancelButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
  },
  cancelText: { color: '#fff', fontWeight: 'bold' },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    gap: 15,
  },
  controlButton: { backgroundColor: '#27ae60', padding: 10, borderRadius: 5 },
  activeControlButton: { backgroundColor: '#f39c12' },
});
