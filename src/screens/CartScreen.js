import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, increment, decrement, totalItems, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={20} color="#FFFFFF60" />
          </TouchableOpacity>
          <Text style={styles.logoSmall}>CART</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyWrap}>
          <Icon name="bag-outline" size={56} color="#f0c6c6" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add something beautiful</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.shopBtnText}>CONTINUE SHOPPING</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={20} color="#FFFFFF60" />
        </TouchableOpacity>
        <Text style={styles.logoSmall}>CART ({totalItems})</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="home-outline" size={20} color="#FFFFFF60" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemCategory}>{item.category.toUpperCase()}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>Ksh {(item.price * item.qty).toLocaleString()}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => decrement(item.id)}>
                  <Icon name="remove-outline" size={16} color="#f0c6c6" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => increment(item.id)}>
                  <Icon name="add-outline" size={16} color="#f0c6c6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
                  <Icon name="trash-outline" size={14} color="#FFFFFF40" />
                  <Text style={styles.removeBtnText}>REMOVE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.summary}>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>SUBTOTAL</Text>
              <Text style={styles.summaryValue}>Ksh {totalPrice.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>DELIVERY</Text>
              <Text style={styles.summaryValue}>Ksh 200</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>Ksh {(totalPrice + 200).toLocaleString()}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate('Checkout')}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutBtnText}>PROCEED TO CHECKOUT</Text>
              <Icon name="arrow-forward-outline" size={14} color="#0A0A0A" />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20,
  },
  backText: { color: '#FFFFFF60', fontSize: 11, letterSpacing: 3 },
  logoSmall: { color: '#FFFFFF', fontSize: 12, letterSpacing: 3, fontWeight: '600' },

  // Empty
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyTitle: { fontSize: 20, fontWeight: '200', color: '#FFFFFF', letterSpacing: 2, marginBottom: 8, marginTop: 20 },
  emptySubtitle: { fontSize: 12, color: '#FFFFFF60', fontStyle: 'italic', marginBottom: 36 },
  shopBtn: { borderWidth: 1, borderColor: '#f0c6c6', paddingHorizontal: 32, paddingVertical: 14 },
  shopBtnText: { color: '#f0c6c6', fontSize: 11, letterSpacing: 4 },

  // List
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  cartItem: {
    flexDirection: 'row', marginBottom: 20,
    backgroundColor: '#141414', borderWidth: 1, borderColor: '#222',
  },
  itemImage: { width: 100, height: 120 },
  itemInfo: { flex: 1, padding: 12 },
  itemCategory: { fontSize: 8, color: '#f0c6c6', letterSpacing: 2, marginBottom: 4 },
  itemName: { fontSize: 14, color: '#FFFFFF', fontWeight: '500', marginBottom: 6 },
  itemPrice: { fontSize: 13, color: '#f0c6c6', fontWeight: '600', marginBottom: 10 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    backgroundColor: '#1A1A1A', width: 28, height: 28,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 2,
  },
  qtyText: { color: '#FFFFFF', fontSize: 14, minWidth: 20, textAlign: 'center' },
  removeBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', gap: 6 },
  removeBtnText: { color: '#FFFFFF40', fontSize: 9, letterSpacing: 2 },

  // Summary
  summary: { marginTop: 10 },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: '#FFFFFF60', fontSize: 11, letterSpacing: 2 },
  summaryValue: { color: '#FFFFFF80', fontSize: 13 },
  totalLabel: { color: '#FFFFFF', fontSize: 13, letterSpacing: 2, fontWeight: '500' },
  totalValue: { color: '#f0c6c6', fontSize: 16, fontWeight: '600' },
  checkoutBtn: {
    backgroundColor: '#f0c6c6', paddingVertical: 18,
    alignItems: 'center', marginTop: 24, flexDirection: 'row',
    justifyContent: 'center', gap: 8,
  },
  checkoutBtnText: { color: '#0A0A0A', fontSize: 12, letterSpacing: 4, fontWeight: '700' },
});