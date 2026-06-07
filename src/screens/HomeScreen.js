import { useCallback, useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Ionicons";
import products from "../assets/products.json";

import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 56) / 2;

function ProductCard({ item, index }) {
  const { addToCart } = useCart();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;

  const runAnimation = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 500,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeIn, slideUp, index]);

  useEffect(() => {
    runAnimation();
  }, [runAnimation]);

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity: fadeIn, transform: [{ translateY: slideUp }] },
      ]}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardBody}>
        <Text style={styles.category}>{item.category.toUpperCase()}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>Ksh {item.price.toLocaleString()}</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => addToCart(item)}
            activeOpacity={0.7}
          >
            <Icon name="add" size={18} color="#0A0A0A" />
            
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const { totalItems } = useCart();
  const headerFade = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(0)).current;

  const runHeaderAnimation = useCallback(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerFade, fabScale]);

  useEffect(() => {
    runHeaderAnimation();
  }, [runHeaderAnimation]);

  const openWhatsApp = () => {
    // Replace with your WhatsApp number
    const phoneNumber = "+254717345979";
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "WhatsApp is not installed");
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Animated.View style={[styles.header, { opacity: headerFade }]}>
            <View style={styles.topBar}>
              {/* Logo Image instead of text */}
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Image
                  source={require("../assets/images/logo.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <View style={styles.topActions}>
                <TouchableOpacity
                  style={styles.cartBtn}
                  onPress={() => navigation.navigate("Cart")}
                  activeOpacity={0.8}
                >
                  <Icon name="bag-outline" size={22} color="#FFFFFF" />
                  {totalItems > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{totalItems}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.profileBtn}
                  onPress={() => navigation.navigate("Profile")}
                  activeOpacity={0.8}
                >
                  <Icon name="person-outline" size={16} color="#f0c6c6" />
                  <Text style={styles.profileBtnText}>PROFILE</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.hero}>
              <Text style={styles.heroSub}>NEW ARRIVALS</Text>
              <Text style={styles.heroTitle}>The Edit</Text>
              <Text style={styles.heroTagline}>
                Pieces selected for the woman who knows exactly who she is.
              </Text>
            </View>
            <View style={styles.pinkDivider} />
            <Text style={styles.sectionLabel}>
              ALL ITEMS — {products.length} PIECES
            </Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <ProductCard item={item} index={index} />
        )}
      />

      {/* WhatsApp FAB */}
      <Animated.View
        style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={openWhatsApp}
          activeOpacity={0.8}
        >
          <FontAwesome name="whatsapp" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  listContent: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, paddingTop: 56 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
  },

  // Logo Image
  logoImage: {
    width: 100,
    height: 40,
  },

  topActions: { flexDirection: "row", alignItems: "center", gap: 16 },
  cartBtn: { position: "relative", padding: 4 },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#f0c6c6",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#0A0A0A", fontSize: 10, fontWeight: "700" },
  profileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#f0c6c6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
  },
  profileBtnText: {
    color: "#f0c6c6",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "500",
  },

  hero: { marginBottom: 28 },
  heroSub: {
    fontSize: 10,
    color: "#f0c6c6",
    letterSpacing: 4,
    marginBottom: 8,
    fontWeight: "500",
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "200",
    color: "#FFFFFF",
    letterSpacing: 2,
    marginBottom: 10,
  },
  heroTagline: {
    fontSize: 13,
    color: "#FFFFFF60",
    fontStyle: "italic",
    lineHeight: 20,
  },
  pinkDivider: {
    height: 1,
    backgroundColor: "#f0c6c640",
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 9,
    color: "#FFFFFF40",
    letterSpacing: 3,
    marginBottom: 20,
    fontWeight: "500",
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#222",
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 140 },
  cardBody: { padding: 12 },
  category: {
    fontSize: 8,
    color: "#f0c6c6",
    letterSpacing: 2,
    marginBottom: 5,
    fontWeight: "600",
  },
  productName: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "500",
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    color: "#FFFFFF60",
    lineHeight: 15,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 11,
    color: "#f0c6c6",
    fontWeight: "600",
  },
  addBtn: {
    backgroundColor: "#f0c6c6",
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
  },

  // WhatsApp FAB
  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 20,
    zIndex: 999,
  },
  fab: {
    backgroundColor: "#25D366",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
