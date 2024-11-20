===================================================================
                          BIN FINDER APP
===================================================================

Welcome to the **BinFinder App**, an innovative waste management solution designed to help users make eco-friendly choices by categorizing waste items correctly. This app combines artificial intelligence, gamification, and user-friendly interfaces to promote sustainability.

-------------------------------------------------------------------
1. APP OVERVIEW
-------------------------------------------------------------------

The **BinFinder App** is designed to:
- Identify and categorize waste items into the correct category (Landfill, Recycling, Mixed Paper, Compost).
- Teach users about waste management through an engaging swipe-based quiz game.
- Provide user authentication and personalized experiences via Firebase.
- Lay the foundation for advanced features like geolocation-based trash bin mapping and live camera integration.

**Key Features**:
1. Waste Identification (Scanner)
2. Gamified Quiz (Quiz)
3. User Profile and Authentication
4. Future Integration with Geolocation and Real-Time Camera

The app aims to empower users to make better waste disposal choices and contribute to a cleaner environment.

-------------------------------------------------------------------
2. DIRECTORY STRUCTURE
-------------------------------------------------------------------

BinFinder/
├── App/
│   ├── Components/
│   │   ├── Home/
│   │   │   ├── GoogleMap.js        # Placeholder for future Google Maps integration.
│   │   │   ├── Header.js           # Displays user profile and search bar.
│   ├── Navigations/
│   │   ├── TabNavigation.js        # Bottom tab navigation between screens.
│   ├── Screens/
│   │   ├── Home.js                 # Home screen for app introduction and navigation.
│   │   ├── Profile.js              # Profile screen for user account management.
│   │   ├── Quiz.js                 # Swipe-based gamified quiz for waste classification.
│   │   ├── Scanner.js              # Allows users to upload and analyze waste images.
│   │   ├── SigninScreen.js         # Login screen for user authentication.
│   │   ├── CreateAccountScreen.js  # Registration screen for new users.
│   ├── Services/
│   │   ├── Firebase.js             # Firebase authentication setup.
│   │   ├── Storage.js              # AsyncStorage for local data storage.
│   ├── Shared/
│   │   ├── Colors.js               # Centralized theme colors for the app.
├── assets/                         # Static assets (e.g., images, logos).
├── App.js                          # Main entry point for the app.
├── app.json                        # App configuration file for Expo.
├── index.js                        # Entry file for starting the app.

-------------------------------------------------------------------
3. FEATURES AND HOW THEY WORK
-------------------------------------------------------------------

### **1. Waste Identification (Scanner)**
   - **What it Does**:
     Upload an image of waste, and the app uses Google Cloud Vision API to identify it and categorize it into Landfill, Recycling, Mixed Paper, or Compost.
   - **Where to Find**: `App/Screens/Scanner.js`
   - **Future Potential**:
     Replace image picker with live camera integration and add a database to store trash bin locations and images.

### **2. Gamified Quiz (Quiz)**
   - **What it Does**:
     A swipe-based game where users match waste items to the correct category. The app keeps track of scores and correct matches.
   - **Where to Find**: `App/Screens/Quiz.js`
   - **Future Potential**:
     Add rewards, leaderboards, and timed challenges to enhance gamification.

### **3. User Profile and Authentication**
   - **What it Does**:
     Users can create accounts, log in, and see their profile. Authentication is managed using Firebase.
   - **Where to Find**: 
     - Authentication: `App/Services/Firebase.js`
     - Profile UI: `App/Screens/Profile.js`
   - **Future Potential**:
     Store personalized data like user history and geotagged bin contributions.

### **4. Navigation System**
   - **What it Does**:
     Users can navigate seamlessly between Home, Scanner, Quiz, and Profile screens using a bottom tab navigation bar.
   - **Where to Find**: `App/Navigations/TabNavigation.js`

### **5. Local Storage**
   - **What it Does**:
     Data is stored locally on the device using AsyncStorage for offline use.
   - **Where to Find**: `App/Services/Storage.js`

-------------------------------------------------------------------
4. FUTURE IMPLEMENTATIONS
-------------------------------------------------------------------

The app is designed with scalability in mind. Planned future features include:
1. **Google Maps Integration**:
   - Add a map to display nearby trash bins.
   - Allow users to upload trash bin locations and images.

2. **Live Camera Integration**:
   - Replace the current image picker with a live camera feed for real-time waste categorization.

3. **Database for Trash Bin Locations**:
   - Use Firebase Firestore to store geotagged bin locations, user contributions, and associated waste data.

4. **Enhanced Gamification**:
   - Introduce rewards, badges, and a leaderboard to motivate users.

5. **Offline Functionality**:
   - Enable offline access to waste data and cached trash bin locations.

-------------------------------------------------------------------
5. HOW TO RUN THE APP
-------------------------------------------------------------------

**Prerequisites**:
1. Install **Node.js** and **npm**.
2. Install **Expo CLI** globally:
