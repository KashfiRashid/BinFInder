// /App/Services/Firebase.js

/**
 * Firebase.js
 * 
 * This file initializes and configures Firebase for the BinFinder app.
 * Firebase is currently used for user authentication.
 * 
 * Key Features:
 * - Firebase initialization using `initializeApp` from the Firebase SDK.
 * - Authentication functionality using `getAuth`.
 * - Ready for extension to include Firestore, Storage, and other Firebase services in the future.
 * 
 * Current Use Case:
 * - User authentication for login and account management.
 * 
 * Future Potential:
 * - **User-Specific Databases:** Using Firestore to store user-specific data, such as preferences, activity logs, and saved pins for favorite trashcan locations.
 * - **Trashcan Location Management:** A centralized Firestore database for storing trashcan locations, each with attributes like GPS coordinates, images, and user-contributed details.
 * - **Real-Time Updates:** Firestore can enable real-time updates to display newly added trashcan locations on the map or changes made by users.
 * - **Image Storage:** Firebase Storage to manage images uploaded by users, such as photos of trashcan locations or profile pictures.
 * - **Data Integration:** Connecting trashcan location data, user activity, and images into a cohesive system to enhance the user experience.
 * - **Notifications:** Firebase Cloud Messaging to notify users of new trashcan locations, updates, or gamification rewards.
 */

// Your web app's Firebase configuration
// Replace these credentials with your Firebase project details
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8gFZ5nC7JNFO7RtOP1JvyR-reLTgIUf0",
  authDomain: "binfinder-7806c.firebaseapp.com",
  projectId: "binfinder-7806c",
  storageBucket: "binfinder-7806c.firebasestorage.app",
  messagingSenderId: "738996297668",
  appId: "1:738996297668:web:adca3ea1f2a45203510e91",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

