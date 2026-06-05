import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusField, setFocusField] = useState(null);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;
  const logoSacle = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.spring(logoSacle, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

const handleRegister = async () => {
  const result = await register(name, email, password);
  if (result.success) {
    Alert.alert('Success', 'Account created successfully!', [
      { 
        text: 'OK', 
        onPress: () => {
          // No navigation needed! Auth state change will automatically switch to App Stack
        }
      }
    ]);
  } else {
    Alert.alert('Registration Failed', result.error || 'Please check your details');
  }
};
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <Animated.View style={[styles.header, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>
          
          <Animated.View style={[styles.logoWrapper, { transform: [{ scale: logoSacle }] }]}>
            <Image 
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
          
          <Text style={styles.title}>Join the Club</Text>
          <Text style={styles.subtitle}>Create your member account</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={[styles.input, focusField === 'name' && styles.inputFocused]}
              placeholder="Salmah Bakari"
              placeholderTextColor="#3A3A3A"
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusField('name')}
              onBlur={() => setFocusField(null)}
              selectionColor="#f0c6c6"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={[styles.input, focusField === 'email' && styles.inputFocused]}
              placeholder="salmah@example.com"
              placeholderTextColor="#3A3A3A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusField('email')}
              onBlur={() => setFocusField(null)}
              selectionColor="#f0c6c6"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={[styles.input, focusField === 'password' && styles.inputFocused]}
              placeholder="••••••••"
              placeholderTextColor="#3A3A3A"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField(null)}
              selectionColor="#f0c6c6"
            />
          </View>

          <TouchableOpacity
            style={[styles.registerBtn, isLoading && styles.registerBtnDisabled]}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.registerText}>
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>Already a member? Sign in →</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 40 },
  header: { paddingTop: 60, alignItems: 'center', marginBottom: 40 },
  back: { alignSelf: 'flex-start', marginBottom: 32 },
  backText: { color: '#FFFFFF60', fontSize: 11, letterSpacing: 3 },
  
  logoWrapper: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 80,
    maxWidth: 180,
    maxHeight: 95,
  },
  
  title: { 
    fontSize: 28, 
    fontWeight: '200', 
    color: '#FFFFFF',
    letterSpacing: 4 
  },
  subtitle: { 
    fontSize: 12, 
    color: '#FFFFFF60',
    letterSpacing: 2, 
    marginTop: 8, 
    fontStyle: 'italic' 
  },
  fieldWrap: { marginBottom: 22 },
  label: { 
    fontSize: 10, 
    color: '#f0c6c6',
    letterSpacing: 3, 
    marginBottom: 10 
  },
  input: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#222',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    letterSpacing: 1,
  },
  inputFocused: { borderColor: '#f0c6c6' },
  registerBtn: {
    backgroundColor: '#f0c6c6',
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerBtnDisabled: {
    opacity: 0.6,
  },
  registerText: { 
    color: '#0A0A0A',
    fontSize: 12, 
    letterSpacing: 4, 
    fontWeight: '700' 
  },
  loginLink: { alignItems: 'center' },
  loginLinkText: { 
    color: '#FFFFFF40',
    fontSize: 12, 
    letterSpacing: 1 
  },
});