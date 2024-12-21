/**
 * SignInScreen.js
 * 
 * This screen handles user sign-in functionality for the BinFinder app.
 * Users can input their email and password, and optionally enable the "Remember Me" feature.
 * The screen integrates Firebase for authentication and custom storage utilities to persist user credentials.
 * 
 * Key Features:
 * - Firebase Authentication for secure sign-in.
 * - Remember Me feature to save and auto-fill credentials.
 * - Error handling for common authentication issues.
 * - Navigation to the Create Account screen for new users.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../Services/Firebase'; // Firebase service for authentication
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase method for signing in users
import { saveData, loadData, clearData } from '../Services/Storage'; // Utility functions for local storage
import { useNavigation } from '@react-navigation/native';

export default function SignInScreen({ navigation }) {
  // State variables
  const [email, setEmail] = useState(''); // Tracks the user's email input
  const [password, setPassword] = useState(''); // Tracks the user's password input
  const [rememberMe, setRememberMe] = useState(false); // Toggles the "Remember Me" feature
  const [errorMessage, setErrorMessage] = useState(''); // Displays authentication error messages
  const [isFormValid, setIsFormValid] = useState(false); // Tracks whether the form is valid
  const { navigate } = useNavigation();

  // Effect: Load saved credentials if "Remember Me" is enabled
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedCredentials = await loadData('user'); // Fetch stored credentials from local storage
        if (savedCredentials) {
          setEmail(savedCredentials.email); // Pre-fill email
          setPassword(savedCredentials.password); // Pre-fill password
          setRememberMe(true); // Enable "Remember Me" toggle
        }
      } catch (error) {
        console.error('Error loading saved credentials:', error); // Log error for debugging
      }
    };
    loadSavedCredentials();
  }, []);

  // Effect: Enable the sign-in button only if both email and password are valid
  useEffect(() => {
    setIsFormValid(email.trim() !== '' && password.trim() !== ''); // Form validation
  }, [email, password]);

  // Handles the sign-in process
  const handleSignIn = async () => {
    if (!isFormValid) return; // Prevents submission if form is invalid

    try {
      // Sign in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        await saveData('user', { email, password }); // Save credentials if "Remember Me" is enabled
      } else {
        await clearData('user'); // Clear saved credentials if not enabled
      }
      navigate('Main', {} ); // Navigate to the main TabNavigation screen
    } catch (error) {
      // Handle common Firebase authentication errors
      if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email address.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('No account found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect password.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>BinFinder Sign In</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={(value) => {
              setEmail(value); // Update email state
              setErrorMessage(''); // Clear error message when input changes
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {email === '' && <Text style={styles.required}>*</Text>} {/* Required field indicator */}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={(value) => {
              setPassword(value); // Update password state
              setErrorMessage(''); // Clear error message when input changes
            }}
            secureTextEntry // Hides input text for security
          />
          {password === '' && <Text style={styles.required}>*</Text>} {/* Required field indicator */}
        </View>

        {/* Error Message Display */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {/* Remember Me Toggle */}
        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={() => setRememberMe(!rememberMe)} // Toggles the "Remember Me" state
        >
          <Text style={styles.rememberText}>
            {rememberMe ? '✓ Remember Me' : 'Remember Me'}
          </Text>
        </TouchableOpacity>

        {/* Sign-In Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isFormValid ? '#27ae60' : '#555' }, // Dynamic button color
          ]}
          onPress={handleSignIn} // Calls the sign-in handler
          disabled={!isFormValid} // Disables button if form is invalid
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Navigation to Sign-Up Screen */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateAccount')} // Navigate to CreateAccountScreen
          style={styles.link}
        >
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles for the Sign-In screen
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' }, // Full-screen dark background
  header: {
    backgroundColor: '#fff',
    paddingVertical: 40, // Adds vertical padding to header
    paddingHorizontal: 20, // Adds horizontal padding
    borderBottomLeftRadius: 50, // Rounded bottom-left corner
  },
  headerText: {
    color: '#000',
    fontSize: 30, // Large header font size
    fontWeight: 'bold',
    textAlign: 'left', // Aligns text to the left
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20, // Padding around form fields
  },
  inputContainer: { marginBottom: 15, position: 'relative' }, // Input spacing
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12, // Padding inside input field
    borderRadius: 8, // Rounded input corners
  },
  required: {
    position: 'absolute',
    right: 10,
    top: 12,
    color: '#e74c3c',
    fontSize: 18, // Red star for required fields
  },
  button: { padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
  link: { marginTop: 20 },
  linkText: { color: '#27ae60', textAlign: 'center' },
  rememberContainer: { marginTop: 10 },
  rememberText: { color: '#aaa', textAlign: 'center' },
  errorText: { color: '#e74c3c', fontSize: 14, marginBottom: 10, textAlign: 'center' },
});
