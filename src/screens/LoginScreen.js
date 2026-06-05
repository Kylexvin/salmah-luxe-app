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

export default function LoginScreen({ navigation }) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

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

const handleLogin = async () => {
  const result = await login(email, password);
  if (result.success) {
    // No navigation needed! Auth state change will automatically switch to App Stack
    // The navigator will show Home screen as the initial screen
  } else {
    Alert.alert('Login Failed', result.error || 'Invalid credentials');
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
          
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your boutique</Text>
        </Animated.View>

        <Animated.View style={[styles.form, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={[styles.input, emailFocus && styles.inputFocused]}
              placeholder="salmah@example.com"
              placeholderTextColor="#3A3A3A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              selectionColor="#f0c6c6"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={[styles.input, passFocus && styles.inputFocused]}
              placeholder="••••••••"
              placeholderTextColor="#3A3A3A"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => setPassFocus(true)}
              onBlur={() => setPassFocus(false)}
              selectionColor="#f0c6c6"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.loginText}>
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerText}>CREATE AN ACCOUNT</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 40 },
  header: { paddingTop: 60, alignItems: 'center', marginBottom: 48 },
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
  form: { flex: 1 },
  fieldWrap: { marginBottom: 24 },
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
  loginBtn: {
    backgroundColor: '#f0c6c6',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginText: { 
    color: '#0A0A0A',
    fontSize: 12, 
    letterSpacing: 4, 
    fontWeight: '700' 
  },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#222' },
  orText: { color: '#FFFFFF40', marginHorizontal: 16, fontSize: 12 },
  registerBtn: {
    borderWidth: 1,
    borderColor: '#f0c6c6',
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerText: { 
    color: '#f0c6c6',
    fontSize: 11, 
    letterSpacing: 3 
  },
});