import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  StatusBar, ScrollView, KeyboardAvoidingView, Platform,
  Linking, Alert, AppState,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useCart } from '../context/CartContext';

export default function CheckoutScreen({ navigation }) {
  const { cart, totalPrice, clearCart } = useCart();
  const [focusField, setFocusField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', notes: '',
  });
  
  const appStateRef = useRef(AppState.currentState);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const fields = [
    { key: 'name',    label: 'FULL NAME',       placeholder: 'Salmah Bakari',     type: 'default' },
    { key: 'phone',   label: 'PHONE NUMBER',    placeholder: '0712 345 678',       type: 'phone-pad' },
    { key: 'address', label: 'DELIVERY ADDRESS',placeholder: 'Makongeni',    type: 'default' },
    { key: 'city',    label: 'CITY / TOWN',     placeholder: 'Thika',            type: 'default' },
    { key: 'notes',   label: 'ORDER NOTES',     placeholder: 'Leave at the gate…', type: 'default' },
  ];

  // Generate buyer-oriented WhatsApp message
  const generateWhatsAppMessage = useCallback(() => {
    const deliveryFee = 200;
    const total = totalPrice + deliveryFee;
    
    let message = `Hello Salmah Luxe! 👗✨\n`;
    message += `I'd like to place an order for the following items:\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📋 *MY ORDER DETAILS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `👤 *Customer Information*\n`;
    message += `Name: ${form.name || '________'}\n`;
    message += `Phone: ${form.phone || '________'}\n`;
    message += `Delivery Address: ${form.address || '________'}\n`;
    message += `City/Town: ${form.city || '________'}\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🛍️ *ITEMS I'M ORDERING*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Quantity: ${item.qty} pc(s)\n`;
      message += `   Price: Ksh ${item.price.toLocaleString()} each\n`;
      message += `   Subtotal: Ksh ${(item.price * item.qty).toLocaleString()}\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *ORDER SUMMARY*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Subtotal: Ksh ${totalPrice.toLocaleString()}\n`;
    message += `Delivery Fee: Ksh ${deliveryFee}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*TOTAL AMOUNT: Ksh ${total.toLocaleString()}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (form.notes) {
      message += `📝 *Special Instructions:*\n${form.notes}\n\n`;
    }
    
    message += `💳 *Payment Method:*\n`;
    message += `Cash on Delivery / M-Pesa on Delivery\n\n`;
    
    message += `⏰ *Delivery Preference:*\n`;
    message += `Please deliver as soon as possible\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Thank you! Please confirm my order. 💕\n`;
    message += `━━━━━━━━━━━━━━━━━━━━`;
    
    return encodeURIComponent(message);
  }, [form, cart, totalPrice]);

  // Handle app state changes (when returning from WhatsApp)
  const handleAppStateChange = useCallback((nextAppState) => {
    if (appStateRef.current.match(/active/) && nextAppState === 'active') {
      // App came back from background (user returned from WhatsApp)
      console.log('Returned from WhatsApp');
      // Navigate to home after delay
      setTimeout(() => {
        navigation.navigate('Home');
      }, 500);
    }
    appStateRef.current = nextAppState;
  }, [navigation]);

  const sendWhatsAppOrder = useCallback(async () => {
    // Validate required fields
    if (!form.name || !form.phone || !form.address || !form.city) {
      Alert.alert(
        'Missing Information',
        'Please fill in all delivery details before placing your order.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    
    // Add app state listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    const ownerPhone = '+254717345979';
    const message = generateWhatsAppMessage();
    const url = `whatsapp://send?phone=${ownerPhone}&text=${message}`;
    
    try {
      await Linking.openURL(url);
      clearCart();
      
      // Remove listener and navigate after delay
      setTimeout(() => {
        subscription.remove();
        setLoading(false);
        // Navigate to home after returning from WhatsApp
        navigation.navigate('Home');
      }, 500);
      
    } catch (_error) {
      setLoading(false);
      subscription.remove();
      Alert.alert(
        'Unable to open WhatsApp',
        'Please make sure WhatsApp is installed on your device.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: () => sendWhatsAppOrder() }
        ]
      );
    }
  }, [form, generateWhatsAppMessage, clearCart, handleAppStateChange]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={20} color="#FFFFFF60" />
          </TouchableOpacity>
          <Text style={styles.logoSmall}>CHECKOUT</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.sectionTitle}>DELIVERY DETAILS</Text>

        {fields.map((f) => (
          <View key={f.key} style={styles.fieldWrap}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput
              style={[styles.input, focusField === f.key && styles.inputFocused]}
              placeholder={f.placeholder}
              placeholderTextColor="#3A3A3A"
              value={form[f.key]}
              onChangeText={(v) => set(f.key, v)}
              keyboardType={f.type}
              autoCapitalize={f.key === 'notes' ? 'sentences' : 'words'}
              onFocus={() => setFocusField(f.key)}
              onBlur={() => setFocusField(null)}
              selectionColor="#f0c6c6"
            />
          </View>
        ))}

        {/* Order summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
          {cart.map(item => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={styles.summaryItem}>{item.name} × {item.qty}</Text>
              <Text style={styles.summaryAmt}>Ksh {(item.price * item.qty).toLocaleString()}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryItem}>Delivery</Text>
            <Text style={styles.summaryAmt}>Ksh 200</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalAmt}>Ksh {(totalPrice + 200).toLocaleString()}</Text>
          </View>
        </View>

        {/* WhatsApp Note */}
        <View style={styles.whatsappNote}>
          <FontAwesome name="whatsapp" size={20} color="#25D366" />
          <Text style={styles.whatsappNoteText}>
            You will send this order to Salmah Luxe via WhatsApp
          </Text>
        </View>

        {/* Payment note */}
        <View style={styles.payNote}>
          <Icon name="cash-outline" size={16} color="#FFFFFF60" />
          <Text style={styles.payNoteText}>  Pay on delivery (Cash or M-Pesa)</Text>
        </View>

        <TouchableOpacity
          style={[styles.orderBtn, loading && styles.orderBtnDisabled]}
          onPress={sendWhatsAppOrder}
          activeOpacity={0.8}
          disabled={loading}
        >
          <FontAwesome name="whatsapp" size={18} color="#0A0A0A" />
          <Text style={styles.orderBtnText}>
            {loading ? 'OPENING WHATSAPP...' : 'SEND ORDER VIA WHATSAPP'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.helperText}>
          You will be redirected to WhatsApp to send your order
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 56, paddingBottom: 28,
  },
  logoSmall: { color: '#FFFFFF', fontSize: 12, letterSpacing: 3, fontWeight: '600' },
  sectionTitle: { fontSize: 10, color: '#f0c6c6', letterSpacing: 4, marginBottom: 20 },
  fieldWrap: { marginBottom: 20 },
  label: { fontSize: 10, color: '#f0c6c6', letterSpacing: 3, marginBottom: 8 },
  input: {
    backgroundColor: '#141414', borderWidth: 1, borderColor: '#222',
    color: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, letterSpacing: 0.5,
  },
  inputFocused: { borderColor: '#f0c6c6' },
  summaryBox: {
    backgroundColor: '#141414', borderWidth: 1, borderColor: '#222',
    padding: 16, marginTop: 8, marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryItem: { color: '#FFFFFF80', fontSize: 13 },
  summaryAmt: { color: '#FFFFFF80', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 12 },
  totalLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '500', letterSpacing: 1 },
  totalAmt: { color: '#f0c6c6', fontSize: 16, fontWeight: '600' },
  whatsappNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#25D36630',
    padding: 12,
    marginBottom: 12,
    borderRadius: 2,
  },
  whatsappNoteText: { 
    color: '#FFFFFF80', 
    fontSize: 11, 
    letterSpacing: 1,
  },
  payNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#222',
    padding: 14,
    marginBottom: 24,
  },
  payNoteText: { color: '#FFFFFF60', fontSize: 12, letterSpacing: 1 },
  orderBtn: {
    backgroundColor: '#25D366',
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  orderBtnDisabled: {
    opacity: 0.6,
  },
  orderBtnText: { 
    color: '#0A0A0A', 
    fontSize: 12, 
    letterSpacing: 3, 
    fontWeight: '700' 
  },
  helperText: {
    color: '#FFFFFF40',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 1,
  },
});