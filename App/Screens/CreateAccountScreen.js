/**
 * CreateAccountScreen.js
 * 
 * This screen allows users to create a new account for the BinFinder app.
 * Users can input their username, email, and password, and the screen performs
 * validations for passwords while checking for input correctness.
 * 
 * Key Features:
 * - Validates password strength with criteria (length, uppercase, number).
 * - Displays error messages for mismatched or invalid inputs.
 * - Integrates with Firebase to create a new user and update their profile.
 * - Provides navigation to the Sign-In screen for existing users.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../Services/Firebase'; // Firebase authentication service
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Firebase methods for user creation and profile updates

export default function CreateAccountScreen({ navigation }) {
  // State variables for user inputs and error handling
  const [username, setUsername] = useState(''); // Tracks the entered username
  const [email, setEmail] = useState(''); // Tracks the entered email
  const [password, setPassword] = useState(''); // Tracks the entered password
  const [confirmPassword, setConfirmPassword] = useState(''); // Tracks the confirm password input
  const [errorMessage, setErrorMessage] = useState(''); // Displays errors related to form submission
  const [passwordError, setPasswordError] = useState(''); // Displays password-specific errors
  const [showCriteria, setShowCriteria] = useState(false); // Toggles the display of password criteria

  // Password strength criteria for validation
  const passwordCriteria = {
    length: password.length >= 8, // Password should be at least 8 characters
    uppercase: /[A-Z]/.test(password), // Password should have at least one uppercase letter
    number: /\d/.test(password), // Password should include at least one number
  };

  // Validates the entered password against the defined criteria
  const validatePassword = (password) => {
    const allValid = passwordCriteria.length && passwordCriteria.uppercase && passwordCriteria.number;
    if (allValid) {
      setPasswordError(''); // Clears any password errors
      setShowCriteria(false); // Hides the criteria display
    } else {
      setPasswordError('Password does not meet the required criteria.');
      setShowCriteria(true); // Displays password criteria for user reference
    }
  };

  // Handles account creation with Firebase
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.'); // Error if passwords do not match
      return;
    }
    try {
      // Firebase method to create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Updates the user's display name in their profile
      await updateProfile(user, { displayName: username });

      alert('Account created successfully!');
      navigation.replace('SignIn'); // Redirects to the Sign-In screen
    } catch (error) {
      console.error('Error creating account:', error.message); // Logs error for debugging
      // Handles specific Firebase error codes
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Email already in use.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email address.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password should be at least 6 characters.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  // Checks if the form is valid (all fields completed, no errors)
  const isFormValid =
    username && email && password && confirmPassword && !passwordError && !errorMessage;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Create a BinFinder Account</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        {/* Username Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={(value) => setUsername(value)}
          />
          {username === '' && <Text style={styles.required}>*</Text>} {/* Required field indicator */}
        </View>

        {/* Email Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setErrorMessage(''); // Clears error messages when input changes
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {email === '' && <Text style={styles.required}>*</Text>}
        </View>

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              validatePassword(value); // Validates password as user types
            }}
            secureTextEntry
          />
          {(password === '' || passwordError) && <Text style={styles.required}>*</Text>}
        </View>

        {/* Password Criteria Display */}
        {showCriteria && (
          <View style={styles.criteriaContainer}>
            <Text
              style={[
                styles.criteriaText,
                passwordCriteria.length ? styles.criteriaMet : styles.criteriaNotMet,
              ]}
            >
              • At least 8 characters
            </Text>
            <Text
              style={[
                styles.criteriaText,
                passwordCriteria.uppercase ? styles.criteriaMet : styles.criteriaNotMet,
              ]}
            >
              • At least 1 uppercase letter
            </Text>
            <Text
              style={[
                styles.criteriaText,
                passwordCriteria.number ? styles.criteriaMet : styles.criteriaNotMet,
              ]}
            >
              • At least 1 number
            </Text>
          </View>
        )}

        {/* Confirm Password Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setErrorMessage('');
            }}
            secureTextEntry
          />
          {confirmPassword === '' && <Text style={styles.required}>*</Text>}
        </View>

        {/* Error Message Display */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isFormValid ? '#27ae60' : '#555' }]}
          onPress={handleSignUp}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Navigation to Sign-In */}
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles for the screen
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 50,
  },
  headerText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputContainer: { position: 'relative', marginBottom: 15 },
  input: { backgroundColor: '#333', color: '#fff', padding: 12, borderRadius: 8 },
  required: {
    position: 'absolute',
    right: 10,
    top: 12,
    color: '#e74c3c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: { padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
  link: { marginTop: 20 },
  linkText: { color: '#27ae60', textAlign: 'center' },
  criteriaContainer: { marginBottom: 10 },
  criteriaText: { fontSize: 14, marginLeft: 10 },
  criteriaMet: { color: '#27ae60' },
  criteriaNotMet: { color: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 14, marginBottom: 10, textAlign: 'center' },
});
