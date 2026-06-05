// src/navigation/AppNavigator.js
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProfileScreen from '../screens/ProfileScreen';

const { width, height } = Dimensions.get('window');
const Stack = createNativeStackNavigator();

function LoadingScreen() {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the orb
    Animated.loop(
      Animated.sequence([
        Animated.spring(pulseScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(pulseScale, {
          toValue: 0.8,
          friction: 5,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Blush Orb - matching splash screen */}
      <View style={styles.blushOrbLarge} />
      <View style={styles.blushRingTop} />
      <View style={styles.whiteRingBottom} />
      
      {/* Animated center element */}
      <Animated.View 
        style={[
          styles.centerGlow,
          {
            opacity: fadeIn,
            transform: [{ scale: pulseScale }]
          }
        ]} 
      />
      
      {/* Minimal blush dot */}
      <Animated.View 
        style={[
          styles.blushDot,
          { opacity: fadeIn }
        ]} 
      />
    </View>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A0A0A' },
        animation: 'fade',
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  
  // Matching splash screen elements
  blushOrbLarge: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: '#f0c6c615',
    borderWidth: 1,
    borderColor: '#f0c6c630',
    top: height * 0.25,
    alignSelf: 'center',
  },
  
  blushRingTop: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: '#f0c6c640',
    backgroundColor: 'transparent',
  },
  
  whiteRingBottom: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: '#FFFFFF20',
    backgroundColor: 'transparent',
  },
  
  centerGlow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0c6c6',
    opacity: 0.3,
    shadowColor: '#f0c6c6',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  
  blushDot: {
    position: 'absolute',
    bottom: '20%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#f0c6c6',
    opacity: 0.5,
  },
});