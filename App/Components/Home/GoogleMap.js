/**
 * GoogleMap Component
 *
 * This component renders a map interface with the ability to:
 * 1. Display user's current location and nearby markers on a map using `react-native-maps`.
 * 2. Allow users to add custom markers, confirm markers, and remove them.
 * 3. Navigate to selected markers and show a route path.
 * 4. Highlight and animate a selected marker with a pulsating effect.
 * 5. Find the nearest marker based on the user's location.
 * 6. Integrate with Firebase Firestore for real-time pin data updates and Firebase-based user information retrieval.
 * 7. Manage state for user actions and location updates, with status messages displayed for various actions.
 *
 * Key Features:
 * - Marker management: Add, confirm, and remove markers.
 * - Real-time updates with Firebase Firestore.
 * - Route navigation to selected markers.
 * - Animated UI feedback with pulsating effects on the selected marker.
 * - Status message display for user actions.
 * - Nearest marker finder based on distance calculation.
 * - User interface designed for mobile usability with intuitive buttons and overlays.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Image,
} from "react-native";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons
import { saveData, loadData } from "../../Services/Storage"; // AsyncStorage helpers
import { db } from "../../Services/Firebase";
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from "@react-navigation/native";

export default function GoogleMap() {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [markerMap, setMarkerMap] = useState([]); // Key-value store for markers
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [path, setPath] = useState([]);
  const [nearestMarker, setNearestMarker] = useState(null);
  const [distanceToNearest, setDistanceToNearest] = useState(null);
  const [isFindingNearest, setIsFindingNearest] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // To display user actions
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(0)).current; // Pulsating animation scale
  const pulseOpacity = useRef(new Animated.Value(0)).current; // Pulsating animation opacity
  const mapRef = useRef(null);

  const [pins, setPins] = useState([]);
  const [pinsUsername, setPinsUsername] = useState("");
  const navigation = useNavigation(); // Get the navigation object

  const fetchPath = async (origin, destination) => {
    return [
      origin,
      {
        latitude: (origin.latitude + destination.latitude) / 2,
        longitude: (origin.longitude + destination.longitude) / 2,
      },
      destination,
    ];
  };

  useEffect(() => {
    (async () => {
      const savedMarkers = await loadData("markers");
      if (savedMarkers) {
        setMarkers(savedMarkers);
        setMarkerMap(
          savedMarkers.map((marker, index) => ({
            key: `#${index + 1}`,
            value: marker.id,
          }))
        );
        console.log("Loaded markers:", savedMarkers);
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      console.log("Current location:", currentLocation);
    })();
  }, []);

  useEffect(() => {
    // Real-time listener for changes to pins
    const unsubscribe = onSnapshot(collection(db, "pins"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPins(data);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  useEffect(() => {
    if (selectedMarker) {
      Animated.loop(
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.5,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseScale.setValue(0);
      pulseOpacity.setValue(1);
    }
  }, [selectedMarker]);

  const updateStatus = (message) => {
    setStatusMessage(message);
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
        }).start();
      }, 2000);
    });
  };

  const handleAddMarker = (coordinate) => {
    const newMarker = { id: Date.now(), coordinate, confirmed: false };
    setMarkers((prevMarkers) => {
      const updatedMarkers = [...prevMarkers, newMarker];
      saveData("markers", updatedMarkers);
      setMarkerMap((prevMap) => [
        ...prevMap,
        { key: `#${prevMarkers.length + 1}`, value: newMarker.id },
      ]);
      console.log("Added marker:", newMarker);
      return updatedMarkers;
    });
    updateStatus("Marker added!");
  };

  const confirmMarker = (markerId) => {
    const updatedMarkers = markers.map((marker) =>
      marker.id === markerId ? { ...marker, confirmed: true } : marker
    );
    setMarkers(updatedMarkers);
    saveData("markers", updatedMarkers);

    const markerKey = markerMap.find((entry) => entry.value === markerId)?.key;
    updateStatus(`Confirmed Marker ${markerKey}`);
    console.log("Marker confirmed:", markerId);
  };

  const navigateToMarker = async (marker) => {
    const currentLocation = await Location.getCurrentPositionAsync({});
    const origin = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    const routePath = await fetchPath(origin, marker.coordinate);
    setPath(routePath);

    const markerKey = markerMap.find((entry) => entry.value === marker.id)?.key;
    updateStatus(`Navigating to Marker ${markerKey}`);
    console.log("Navigation started to marker:", marker.id);
  };

  const cancelJourney = () => {
    setPath([]);
    updateStatus("Journey canceled.");
    console.log("Journey canceled.");
  };

  const removeMarker = (markerId) => {
    const updatedMarkers = markers.filter((marker) => marker.id !== markerId);
    setMarkers(updatedMarkers);
    saveData("markers", updatedMarkers);
    setMarkerMap((prevMap) => prevMap.filter((entry) => entry.value !== markerId));

    const markerKey = markerMap.find((entry) => entry.value === markerId)?.key;
    updateStatus(`Removed Marker ${markerKey}`);
    console.log("Marker removed:", markerId);
    setSelectedMarker(null);
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
    console.log("Centered map on user.");
  };

  const findNearestMarker = async () => {
    setIsFindingNearest(true);
    const currentLocation = await Location.getCurrentPositionAsync({});
    const userLocation = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    let nearest = null;
    let minDistance = Infinity;

    markers.forEach((marker) => {
      const distance = Math.sqrt(
        Math.pow(marker.coordinate.latitude - userLocation.latitude, 2) +
          Math.pow(marker.coordinate.longitude - userLocation.longitude, 2)
      );
      if (distance < minDistance) {
        nearest = marker;
        minDistance = distance;
      }
    });

    setNearestMarker(nearest);
    setSelectedMarker(nearest);
    setDistanceToNearest((minDistance * 111).toFixed(2)); // Convert degrees to km (~111km/degree)
    if (nearest) {
      const markerKey = markerMap.find((entry) => entry.value === nearest.id)?.key;
      updateStatus(`Nearest Marker ${markerKey} (${distanceToNearest} km)`);
      console.log("Nearest marker:", nearest);
    } else {
      updateStatus("No markers available.");
      console.log("No markers available.");
    }
    setIsFindingNearest(false);
  };

  const getPinUserName = async (pin) => {
        const userRef = doc(db, "users", pin.userId);
        const userDoc = await getDoc(userRef);
        setPinsUsername(userDoc.data().username);
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={location}
          showsUserLocation
          onPress={(e) => {
            setSelectedMarker(null);
            //handleAddMarker(e.nativeEvent.coordinate);
          }}
        >
          {pins.map(pin => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.latitude,
              longitude: pin.longitude,
            }}
            // title="Image Location"
            // description={`Uploaded by: ${pinsUsername}`}
            onCalloutPress={() => console.log(`Image URL: ${pin.imageUrl}`)} // Action on marker press
            onPress={() => {
              getPinUserName(pin)
              setSelectedMarker(pin);
              const markerKey = pin.id;
              updateStatus(`Selected Marker ${markerKey}`);
              navigation.navigate("BinDetails", pin);
            }}
          />
        ))}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              onPress={() => {
                setSelectedMarker(marker);
                const markerKey = markerMap.find((entry) => entry.value === marker.id)?.key;
                updateStatus(`Selected Marker ${markerKey}`);
                console.log("Marker selected:", marker.id);
              }}
            >
              {selectedMarker?.id === marker.id && (
                <Animated.View
                  style={[
                    styles.pulseCircle,
                    {
                      opacity: pulseOpacity,
                      transform: [{ scale: pulseScale }],
                    },
                  ]}
                />
              )}
              <Ionicons
                name="location-sharp"
                size={30}
                color={
                  marker.id === selectedMarker?.id
                    ? "blue"
                    : marker.confirmed
                    ? "green"
                    : "grey"
                }
              />
            </Marker>
          ))}
          {path.length > 0 && (
            <Polyline coordinates={path} strokeColor="blue" strokeWidth={3} />
          )}
        </MapView>
      )}

      <Animated.Text style={[styles.statusMessage, { opacity: fadeAnim }]}>
        {statusMessage}
      </Animated.Text>

      {selectedMarker && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              confirmMarker(selectedMarker.id);
              setSelectedMarker(null);
            }}
          >
            <Text style={styles.actionText}>Confirm Trash Can</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              navigateToMarker(selectedMarker);
              setSelectedMarker(null);
            }}
          >
            <Text style={styles.actionText}>Navigate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => removeMarker(selectedMarker.id)}
          >
            <Text style={styles.actionText}>Remove Trash Can</Text>
          </TouchableOpacity>
        </View>
      )}

      {path.length > 0 && (
        <TouchableOpacity style={styles.cancelButton} onPress={cancelJourney}>
          <Text style={styles.cancelText}>Cancel Journey</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.centerButton} onPress={centerMapOnUser}>
        <Text style={styles.centerText}>Center</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.nearestButton,
          isFindingNearest ? styles.disabledButton : null,
        ]}
        onPress={findNearestMarker}
        disabled={isFindingNearest}
      >
        <Text style={styles.nearestText}>Find Nearest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA", // Light background for a clean, modern aesthetic
    position: "relative",
  },
  map: {
    flex: 1,
  },
  statusMessage: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  actions: {
    position: "absolute",
    bottom: 80,
    left: 15,
    right: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    elevation: 10, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#2D9CDB", // Primary button color
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#27AE60", // Green for confirm
  },
  navigateButton: {
    backgroundColor: "#2D9CDB", // Blue for navigation
  },
  removeButton: {
    backgroundColor: "#EB5757", // Red for remove
  },
  cancelButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#EB5757", // Red for cancel
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  cancelText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
  centerButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#6C63FF", // Purple for centering
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  centerText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
  nearestButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#27AE60", // Green for find nearest
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    bottom:200,
  },
  disabledButton: {
    backgroundColor: "#BDC3C7", // Grey for disabled button
  },
  nearestText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
  pulseCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    backgroundColor: "rgba(41, 128, 185, 0.3)", // Light blue for pulsating animation
    borderRadius: 40,
  },
});

