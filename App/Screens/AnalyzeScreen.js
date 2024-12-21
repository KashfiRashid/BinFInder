import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../Services/Firebase';
import { collection, getDocs, setDoc, doc, updateDoc, where, query } from 'firebase/firestore';
import * as Location from "expo-location";
import uuid from "react-native-uuid";
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const AnalyzeScreen = ({ route, navigation }) => {
  const { imageUri, mode } = route.params;
  const [labels, setLabels] = useState([]);
  const [suggestion, setSuggestion] = useState('Click Analyze to start');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [hasLandfill, setHasLandfill] = useState(false);
  const [hasCompost, setHasCompost] = useState(false);
  const [hasRecycle, setHasRecycle] = useState(false);
  const [hasPaper, setHasPaper] = useState(false);

  // Current Date
  const currentDate = new Date().toLocaleDateString();

  // Placeholder Google Vision API Key
  const visionApiKey = 'AIzaSyCCXpMFpxB3uNStPq8HiQ9ACrUnN3Gm43o';

  // Labels
  const landfill = [
    "plastic bag", "chip bag", "styrofoam cup", "plastic straw", "candy wrapper",
    "disposable diaper", "plastic utensils", "ceramic plate", "broken mirror", "light bulb",
    "ballpoint pen", "toothbrush", "vacuum bag", "polystyrene foam", "frozen food bag",
    "gloves", "single-use razor", "rubber bands", "plastic wrap", "styrofoam packaging",
    "plastic bubble wrap", "non-recyclable plastic", "toothpaste tube", "makeup remover pad",
    "CD", "plastic coffee pod", "foil-lined carton", "empty tube of toothpaste", "shoes",
    "pen", "ball pen", "stationary", "laminated paper", "broken ceramics",
    "disposable coffee cups (non-compostable)", "bubble mailers", "clothing with synthetic fibers",
    "packaging peanuts", "plastic film", "PVC pipes", "plastic cutlery",
    "takeout containers with food residue", "broken furniture parts", "vacuum cleaner parts",
    "thermal receipts", "cigarette butts", "drink pouches", "foil bags",
    "aluminum-lined chip bags", "disposable masks", "disposable gloves", "nail polish bottles",
    "cosmetic packaging (non-recyclable)", "deodorant sticks", "sponges",
    "disposable razors", "plastic strapping", "toys with multiple materials",
    "shrink wrap", "disposable lighters", "broken hangers", "electric toothbrush heads",
    "party balloons", "glitter", "artificial flowers", "single-use coffee pods",
    "silica gel packets", "wax paper", "food packaging with foil lining",
    "broken zippers", "plastic stirrers", "fabric scraps", "disposable mop heads",
    "plastic straws", "coffee cups", "pizza box with food", "used toothbrush",
    "razors", "styrofoam", "worn-out clothes", "ceramic or broken glass",
    "sanitary products", "plastic cutlery"
  ];
  
  const compost = [
    "apple core", "banana peel", "coffee grounds", "tea bag", "vegetable scraps",
    "egg shell", "bread", "rice", "pasta", "corn cob",
    "fruit peel", "leafy greens", "grass clippings", "paper towel", "napkin",
    "wood chips", "compostable plate", "compostable cup", "flowers", "dead leaves",
    "nut shell", "hair", "feathers", "straw (plant-based)", "compostable utensils",
    "potato peels", "avocado skin", "fruit pits", "compostable bag", "shredded paper",
    "food", "compostable coffee cups", "soiled paper towels", "tea leaves",
    "biodegradable utensils", "sawdust", "wood shavings", "plant trimmings",
    "spoiled fruits and vegetables", "eggshells", "coffee filters", "compostable food containers",
    "wooden chopsticks", "fallen branches", "pumpkin shells", "compostable baking paper",
    "moldy bread", "expired produce", "herb stems", "peanut shells",
    "flower stems", "used tea bags", "used coffee pods (biodegradable)",
    "wooden chopsticks", "banana peel", "apple scrap", "pizza crust",
    "dry leaves", "moldy food", "nut shells"
  ];
  
  const mixedPaper = [
    "printer paper", "paper", "paper products", "envelope", "notebook", "paper bag", "file folder",
    "index card", "sticky note", "brochure", "catalog", "softcover book",
    "newspaper", "magazine", "advertisement flyer", "greeting card", "copy paper",
    "letterhead", "receipt", "paper napkin", "junk mail", "construction paper",
    "wrapping paper (non-metallic)", "manila folder", "paperboard packaging", "calendar paper",
    "postcard", "lined paper", "colored paper", "fax paper", "legal pad paper",
    "blueprint", "packaging", "packaging and labeling", "cardboards",
    "cereal boxes (remove liner)", "paper egg cartons", "paper shopping bags",
    "corrugated cardboard", "books (without hardcovers)", "phone books",
    "pizza boxes (clean parts only)", "paper envelopes with windows",
    "brown paper bags", "clean napkins", "paper packaging material",
    "clean paper cups", "paper coffee sleeves", "clean paper trays",
    "notepads", "unused disposable placemats", "craft paper", "clean tissue paper",
    "cardboard drink carriers", "clean cardboard sleeves",
    "paper bag", "egg carton", "tetra packs", "cardboard boxes",
    "clamshell boxes", "envelopes", "kraft bag", "old notebooks"
  ];
  
  const recycling = [
    "aluminum can", "plastic water bottle", "glass jar", "milk jug", "soda can",
    "steel can", "cardboard box", "cereal box", "clean plastic container", "plastic bottle cap",
    "newspaper", "magazine", "office paper", "junk mail", "clean aluminum foil",
    "metal lid", "glass bottle", "detergent bottle", "food can", "cardboard tube",
    "plastic milk jug", "paper towel roll", "yogurt container", "shampoo bottle",
    "clean food container", "clean jar", "wine bottle", "juice bottle", "laundry detergent bottle",
    "plastic clamshell container", "water bottle", "plastic bottle", "bottle", "straws",
    "cups (recyclable)", "cutlery (recyclable)", "plastic egg cartons", "tetra packs",
    "clean plastic bags (bundle together)", "tin cans", "beverage cartons", "aluminum pie plates",
    "plastic plant pots", "rigid plastic packaging", "toys made of single-material plastic",
    "clear glass jars", "clean pizza boxes", "empty aerosol cans", "metal tins",
    "clean tin foil trays", "plastic food containers (cleaned)", "paperboard boxes",
    "clean bubble wrap", "recyclable drinking cups", "metal wire hangers",
    "empty pill bottles", "clean aluminum cans", "egg cartons", "jars with labels removed",
    "recyclable lids", "hard plastic takeout containers", "plastic jugs",
    "clean cardboard packaging", "clean cereal liners", "clean yogurt lids",
    "clean film plastic", "clean plastic clamshells",
    "milk gallon", "aluminium can", "glass bottles", "shampoo bottles",
    "soda caps", "bottle caps", "glass jars", "tin containers",
    "aluminium trays"
  ];
  
  const trashCans = [
    "trash can", "recycling bin", "compost bin", "metal bin", "plastic trash can",
    "waste container", "garbage bin", "rubbish bin", "wheelie bin", "dustbin",
    "wastebasket", "indoor trash can", "outdoor trash can", "pedal bin", "swing-top bin",
    "recycling station", "composting station", "three-bin system", "dual compartment bin",
    "trash sorter", "smart trash can", "industrial waste bin", "garden waste bin",
    "public trash can", "street-side bin", "park bin", "office bin",
    "kitchen bin", "bathroom bin", "stainless steel bin", "wooden trash bin",
    "eco-friendly bin", "biodegradable bin", "colored recycling bin", "blue recycling bin",
    "green compost bin", "yellow recycling bin", "red trash can", "black garbage bin",
    "community recycling station", "municipal waste bin", "hazardous waste bin",
    "medical waste bin", "electronic waste bin", "smart waste disposal unit",
    "bin with foot pedal", "urban recycling center bins", "compost tumblers",
    "dog waste bins", "school cafeteria bins", "solar-powered smart bins",
    "office paper recycling bins", "park sorting stations", "customizable compartment bins",
    "bins with smart sensors", "child-friendly trash bins"
  ];

  const toggleTag = (tag) => {
    if (tag === 'Landfill') setHasLandfill(!hasLandfill);
    else if (tag === 'Compost') setHasCompost(!hasCompost);
    else if (tag === 'Recycle') setHasRecycle(!hasRecycle);
    else if (tag === 'Paper') setHasPaper(!hasPaper);
  };

  const user = auth.currentUser;

  const saveImageWithMetadata = async (imageUri, userId) => {
    try {
      // Generate unique ID for the image
      const imageId = uuid.v4();
      const timestamp = new Date().toISOString();
  
      // Reference to Firebase Storage location
      const storageRef = ref(storage, `images/${imageId}.jpg`);
  
      // Convert base64 imageUri to binary format
      const base64Response = await fetch(imageUri);
      const blob = await base64Response.blob();
  
      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, blob);
      
        // Get the download URL for the uploaded image
      const imageUrl = await getDownloadURL(storageRef);
      
      const currentLocation = await Location.getCurrentPositionAsync({});
      // Save metadata to Firestore
      const docRef = await setDoc(doc(db, "pins", imageId), {
        userId: userId,
        imageUrl: imageUrl,
        timestamp: timestamp,
        pinId: imageId,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        landfill: hasLandfill,
        compost: hasCompost,
        recycling: hasRecycle,
        paper: hasPaper,
        confirm: false,
      });
  

      console.log("Image and metadata saved successfully:");
    } catch (error) {
      console.error("Error saving image and metadata:", error);
    }
  };

  const saveData = () => {
    if (!location || !name || !(hasLandfill || hasCompost || hasRecycle || hasPaper)) {
      Alert.alert('Error', 'Please fill all fields and select at least one category');
      return;
    }

    console.log('Saved Data:');
    console.log(`Location: ${location}`);
    console.log(`Name: ${name}`);
    console.log(`Landfill: ${hasLandfill}`);
    console.log(`Compost: ${hasCompost}`);
    console.log(`Recycle: ${hasRecycle}`);
    console.log(`Paper: ${hasPaper}`);
    console.log(`Date: ${currentDate}`);

    saveImageWithMetadata(imageUri, user.uid);


    userDBPins();
    
    Alert.alert('Success', 'Data saved!');
  };

  async function userDBPins() {
    const userRef = collection(db, "pins");

    const q = query(userRef, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const pins = [];
    querySnapshot.forEach((doc) => {
      pins.push({ id: doc.id, ...doc.data() });
    });

    updateUserPins(pins.length+1);
  };

  const updateUserPins = async (pinNum) => {

    const userDocRef = doc(db, "users", user.uid);

    await updateDoc(userDocRef, {
      pins: pinNum,
    });
  };

  const analyzeImage = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'No image provided for analysis.');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`;
      const base64Image = imageUri.replace(/^data:image\/\w+;base64,/, '');

      const requestBody = {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: 'LABEL_DETECTION', maxResults: 10 }],
          },
        ],
      };

      const response = await axios.post(apiUrl, requestBody);
      const annotations = response.data.responses[0]?.labelAnnotations || [];
      setLabels(annotations);

      const descriptions = annotations.map((label) => label.description.toLowerCase());

      let category = 'Unknown';
      if (mode === 'trash') {
        if (descriptions.some((desc) => landfill.includes(desc))) category = 'Landfill';
        else if (descriptions.some((desc) => recycling.includes(desc))) category = 'Recycle';
        else if (descriptions.some((desc) => mixedPaper.includes(desc))) category = 'Paper';
        else if (descriptions.some((desc) => compost.includes(desc))) category = 'Compost';
      } else if (mode === 'trashCan') {
        category = descriptions.some((desc) => trashCans.includes(desc)) ? 'Trash Can Found' : 'No Trash Can Found';
      }

      setSuggestion(category);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze the image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        {isLoading ? (
          <Text style={styles.loadingText}>Analyzing...</Text>
        ) : (
          <>
            <Text style={styles.suggestionText}>Suggestion: {suggestion}</Text>
            {mode === 'trash' && suggestion !== 'Click Analyze to start' && (
              <Text style={styles.categoryText}>This item is categorized as: {suggestion}</Text>
            )}
            {mode === 'trashCan' && suggestion !== 'Click Analyze to start' && (
              <Text style={styles.categoryText}>Trash Can Detection: {suggestion}</Text>
            )}
            <Text style={styles.labelText}>Detected Labels:</Text>
            {labels.length > 0 ? (
              labels.map((label, index) => (
                <Text key={index} style={styles.labelItem}>
                  - {label.description} ({(label.score * 100).toFixed(2)}% confidence)
                </Text>
              ))
            ) : (
              <Text style={styles.noLabelsText}>No labels detected yet</Text>
            )}
          </>
        )}

        {mode === 'trashCan' && (
          <TouchableOpacity
            style={[styles.editButton, editMode && styles.editButtonActive]}
            onPress={() => setEditMode(!editMode)}
          >
            <Ionicons name="create-outline" size={20} color={editMode ? '#fff' : '#000'} />
            <Text style={editMode ? styles.editButtonTextActive : styles.editButtonText}>
              {editMode ? 'Close Manual Input' : 'Edit Manually'}
            </Text>
          </TouchableOpacity>
        )}

        {editMode && mode === 'trashCan' && (
          <>
            <Text style={styles.dateText}>Date: {currentDate}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Location"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
            <View style={styles.tagsContainer}>
              {['Landfill', 'Compost', 'Recycle', 'Paper'].map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tag,
                    (tag === 'Landfill' && hasLandfill) ||
                    (tag === 'Compost' && hasCompost) ||
                    (tag === 'Recycle' && hasRecycle) ||
                    (tag === 'Paper' && hasPaper)
                      ? styles.activeTag
                      : null,
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      (tag === 'Landfill' && hasLandfill) ||
                      (tag === 'Compost' && hasCompost) ||
                      (tag === 'Recycle' && hasRecycle) ||
                      (tag === 'Paper' && hasPaper)
                        ? styles.activeTagText
                        : null,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
            <Ionicons name="analytics-outline" size={20} color="white" />
            <Text style={styles.analyzeButtonText}>Analyze</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack()}>
            <Ionicons name="camera-reverse-outline" size={20} color="white" />
            <Text style={styles.backButtonText}>Retake</Text>
          </TouchableOpacity>
          {editMode && (
            <TouchableOpacity style={styles.saveButton} onPress={saveData}>
              <Ionicons name="save-outline" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#242424' },
  scrollContainer: { paddingBottom: 20, paddingHorizontal: 15 },
  image: { width: '100%', height: 250, marginBottom: 20, borderRadius: 10 },
  loadingText: { fontSize: 16, color: '#fff', textAlign: 'center', marginBottom: 10 },
  suggestionText: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  categoryText: { fontSize: 16, fontWeight: 'bold', color: '#4caf50', marginBottom: 10 },
  labelText: { fontSize: 16, color: '#ccc', marginBottom: 5 },
  labelItem: { fontSize: 14, color: '#d3d3d3' },
  noLabelsText: { fontSize: 14, color: '#ff4444' },
  dateText: { fontSize: 14, color: '#999', marginBottom: 10, textAlign: 'center' },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: '#333',
  },
  tagsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  tag: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#555',
  },
  activeTag: { backgroundColor: '#4caf50' },
  tagText: { color: '#fff' },
  activeTagText: { fontWeight: 'bold' },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  analyzeButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  analyzeButtonText: { color: '#fff', fontSize: 16, marginLeft: 10 },
  actionButton: {
    backgroundColor: '#1d3c6e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButtonText: { color: '#fff', fontSize: 16, marginLeft: 10 },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  saveButtonText: { color: '#fff', fontSize: 16, marginLeft: 10 },
  editButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  editButtonText: { color: '#000', marginLeft: 5 },
  editButtonActive: { backgroundColor: '#4caf50' },
  editButtonTextActive: { color: '#fff' },
});

export default AnalyzeScreen;
