import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';

const MENU_ITEMS = [
  { icon: 'cube-outline', label: 'My Orders', iconType: 'Ionicons' },
  { icon: 'heart-outline', label: 'Wishlist', iconType: 'Ionicons' },
  { icon: 'location-outline', label: 'Delivery Address', iconType: 'Ionicons' },
  { icon: 'card-outline', label: 'Payment Methods', iconType: 'Ionicons' },
  { icon: 'notifications-outline', label: 'Notifications', iconType: 'Ionicons' },
  { icon: 'settings-outline', label: 'Settings', iconType: 'Ionicons' },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout, isLoading } = useAuth();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Error', 'Failed to sign out');
            }
            // No navigation needed! The auth state change will automatically
            // switch from App Stack to Auth Stack
          }
        }
      ]
    );
  };

  const renderIcon = (item) => {
    if (item.iconType === 'Ionicons') {
      return <Icon name={item.icon} size={20} color="#f0c6c6" />;
    }
    return <FontAwesome name={item.icon} size={20} color="#f0c6c6" />;
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'S';
  };

  const getMemberSince = () => {
    if (user?.memberSince) {
      return new Date(user.memberSince).getFullYear();
    }
    return '2024';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Top bar */}
        <Animated.View style={[styles.topBar, { opacity: fadeIn }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Icon name="arrow-back-outline" size={20} color="#FFFFFF60" />
          </TouchableOpacity>
          <Image 
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Icon name="home-outline" size={20} color="#FFFFFF60" />
          </TouchableOpacity>
        </Animated.View>

        {/* Avatar & info */}
        <Animated.View style={[styles.profileSection, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
            <View style={styles.badge}>
              <FontAwesome name="diamond" size={10} color="#0A0A0A" />
            </View>
          </View>
          <Text style={styles.memberTag}>PINK MEMBER • SINCE {getMemberSince()}</Text>
          <Text style={styles.name}>{user?.name || 'Salmah'}</Text>
          <Text style={styles.email}>{user?.email || 'salmah@example.com'}</Text>
          <Text style={styles.phone}>{user?.phone || '0712 345 678'}</Text>
        </Animated.View>

        {/* Stats row */}
        <Animated.View style={[styles.statsRow, { opacity: fadeIn }]}>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statValue}>{user?.ordersCount || '12'}</Text>
            <Text style={styles.statLabel}>ORDERS</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statValue}>{user?.wishlistCount || '5'}</Text>
            <Text style={styles.statLabel}>WISHLIST</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.loyaltyPoints || '840'}</Text>
            <Text style={styles.statLabel}>LOYALTY PTS</Text>
          </View>
        </Animated.View>

        {/* Pink divider */}
        <View style={styles.divider} />

        {/* Menu */}
        <Animated.View style={[styles.menu, { opacity: fadeIn }]}>
          <Text style={styles.menuHeader}>ACCOUNT</Text>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuRow} activeOpacity={0.6}>
              <View style={styles.menuIcon}>
                {renderIcon(item)}
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Icon name="chevron-forward-outline" size={18} color="#FFFFFF30" />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Logout */}
        <Animated.View style={[styles.logoutWrap, { opacity: fadeIn }]}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Icon name="log-out-outline" size={16} color="#f0c6c6" />
            <Text style={styles.logoutText}>{isLoading ? 'SIGNING OUT...' : 'SIGN OUT'}</Text>
          </TouchableOpacity>
          <Text style={styles.version}>Salmah Luxe v1.0 · Demo</Text>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
  },
  back: {},
  logoImage: { 
    width: 80, 
    height: 35,
  },

  profileSection: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20 },
  avatarWrap: { position: 'relative', marginBottom: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#141414',
    borderWidth: 2,
    borderColor: '#f0c6c6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 32, color: '#f0c6c6', fontWeight: '200' },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#f0c6c6',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  memberTag: { fontSize: 9, color: '#f0c6c6', letterSpacing: 3, marginBottom: 8 },
  name: { fontSize: 26, fontWeight: '200', color: '#FFFFFF', letterSpacing: 3, marginBottom: 4 },
  email: { fontSize: 13, color: '#FFFFFF60', fontStyle: 'italic', marginBottom: 2 },
  phone: { fontSize: 12, color: '#FFFFFF40', letterSpacing: 1 },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#222',
  },
  statItem: { flex: 1, paddingVertical: 18, alignItems: 'center' },
  statBorder: { borderRightWidth: 1, borderRightColor: '#222' },
  statValue: { fontSize: 20, fontWeight: '300', color: '#f0c6c6', marginBottom: 4 },
  statLabel: { fontSize: 8, color: '#FFFFFF60', letterSpacing: 2 },

  divider: { height: 1, backgroundColor: '#222', marginVertical: 28, marginHorizontal: 20 },

  menu: { paddingHorizontal: 20, marginBottom: 16 },
  menuHeader: { fontSize: 9, color: '#FFFFFF40', letterSpacing: 4, marginBottom: 16 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#141414',
  },
  menuIcon: { marginRight: 16, width: 28 },
  menuLabel: { flex: 1, fontSize: 14, color: '#FFFFFF', letterSpacing: 0.5 },
  menuArrow: { fontSize: 22, color: '#FFFFFF30' },

  logoutWrap: { paddingHorizontal: 20, paddingBottom: 48, alignItems: 'center' },
  logoutBtn: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: '#f0c6c6',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutText: { color: '#f0c6c6', fontSize: 11, letterSpacing: 4 },
  version: { fontSize: 10, color: '#FFFFFF20', letterSpacing: 2 },
});