import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  StatusBar, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useCart } from '../context/CartContext';

export default function CheckoutScreen({ navigation }) {
  const { cart, totalPrice, clearCart } = useCart();
  const [focusField, setFocusField] = useState(null);
  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', notes: '',
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const fields = [
    { key: 'name',    label: 'FULL NAME',       placeholder: 'Salmah Wanjiru',     type: 'default' },
    { key: 'phone',   label: 'PHONE NUMBER',    placeholder: '0712 345 678',       type: 'phone-pad' },
    { key: 'address', label: 'DELIVERY ADDRESS',placeholder: 'Street / Estate',    type: 'default' },
    { key: 'city',    label: 'CITY / TOWN',     placeholder: 'Nairobi',            type: 'default' },
    { key: 'notes',   label: 'ORDER NOTES',     placeholder: 'Leave at the gate…', type: 'default' },
  ];

  const placeOrder = useCallback(() => {
    clearCart();
    navigation.replace('OrderConfirmed', { name: form.name || 'Valued Customer' });
  }, [clearCart, navigation, form.name]);

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
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>
          <Text style={styles.logoSmall}>♛ CHECKOUT</Text>
          <View style={{ width: 60 }} />
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
              selectionColor="#C9A84C"
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
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalAmt}>Ksh {(totalPrice + 200).toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment note */}
        <View style={styles.payNote}>
          <Text style={styles.payNoteText}>💳  Pay on delivery (Cash or M-Pesa)</Text>
        </View>

        <TouchableOpacity
          style={styles.orderBtn}
          onPress={placeOrder}
          activeOpacity={0.8}
        >
          <Text style={styles.orderBtnText}>PLACE ORDER</Text>
        </TouchableOpacity>

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
  backText: { color: '#555', fontSize: 11, letterSpacing: 3 },
  logoSmall: { color: '#C9A84C', fontSize: 12, letterSpacing: 3, fontWeight: '600' },
  sectionTitle: { fontSize: 10, color: '#C9A84C', letterSpacing: 4, marginBottom: 20 },
  fieldWrap: { marginBottom: 20 },
  label: { fontSize: 10, color: '#C9A84C', letterSpacing: 3, marginBottom: 8 },
  input: {
    backgroundColor: '#141414', borderWidth: 1, borderColor: '#222',
    color: '#F5F0E8', paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, letterSpacing: 0.5,
  },
  inputFocused: { borderColor: '#C9A84C' },
  summaryBox: {
    backgroundColor: '#111', borderWidth: 1, borderColor: '#1A1A1A',
    padding: 16, marginTop: 8, marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryItem: { color: '#888', fontSize: 13 },
  summaryAmt: { color: '#888', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#1A1A1A', marginVertical: 12 },
  totalLabel: { color: '#F5F0E8', fontSize: 13, fontWeight: '500', letterSpacing: 1 },
  totalAmt: { color: '#C9A84C', fontSize: 16, fontWeight: '600' },
  payNote: {
    backgroundColor: '#111', borderWidth: 1, borderColor: '#1A1A1A',
    padding: 14, marginBottom: 24,
  },
  payNoteText: { color: '#666', fontSize: 12, letterSpacing: 1 },
  orderBtn: { backgroundColor: '#C9A84C', paddingVertical: 18, alignItems: 'center' },
  orderBtnText: { color: '#0A0A0A', fontSize: 12, letterSpacing: 4, fontWeight: '700' },
});