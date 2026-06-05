import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  // Animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const blushCircleScale = useRef(new Animated.Value(0)).current;
  const whiteGlowOpacity = useRef(new Animated.Value(0)).current;
  const imageLogoScale = useRef(new Animated.Value(0.8)).current;
  const imageLogoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(logoY, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.spring(blushCircleScale, { toValue: 1, friction: 8, useNativeDriver: true }),
        // Image logo animations
        Animated.spring(imageLogoScale, { toValue: 1, friction: 8, useNativeDriver: true }),
        Animated.timing(imageLogoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(lineWidth, { toValue: 120, duration: 500, useNativeDriver: false }),
        Animated.timing(whiteGlowOpacity, { toValue: 0.6, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(btnOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [logoOpacity, logoY, blushCircleScale, imageLogoScale, imageLogoOpacity, lineWidth, whiteGlowOpacity, taglineOpacity, btnOpacity]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* Premium Blush + White Decorative Elements */}
      
      {/* Large Blush Orb - Back */}
      <Animated.View 
        style={[
          styles.blushOrbLarge,
          { transform: [{ scale: blushCircleScale }] }
        ]} 
      />
      
      {/* White Glow Center */}
      <Animated.View 
        style={[
          styles.whiteGlow,
          { opacity: whiteGlowOpacity }
        ]} 
      />
      
      {/* Blush Ring - Top Right */}
      <View style={styles.blushRingTop} />
      
      {/* White Ring - Bottom Left */}
      <View style={styles.whiteRingBottom} />
      
      {/* Blush Particles */}
      <View style={styles.blushParticle1} />
      <View style={styles.blushParticle2} />
      <View style={styles.blushParticle3} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo Section - Original preserved + Image logo added */}
        <Animated.View 
          style={[
            styles.logoContainer,
            { 
              opacity: logoOpacity, 
              transform: [{ translateY: logoY }] 
            }
          ]}
        >
          {/* ADDED: Image Logo - appears above the crown */}
          <Animated.View 
            style={[
              styles.imageLogoWrapper,
              {
                opacity: imageLogoOpacity,
                transform: [{ scale: imageLogoScale }]
              }
            ]}
          >
            <Image 
              source={require('../assets/images/logo.png')}
              style={styles.imageLogo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Original Crown Icon */}
          {/* <View style={styles.crownWrapper}>
            <Text style={styles.crown}>♛</Text>
            <View style={styles.crownAccent} />
          </View> */}
          
          {/* Original Main Logo */}
          <Text style={styles.logo}>SALMAH&apos;S</Text>
          <View style={styles.logoLine} />
          <Text style={styles.logoSub}>L U X E</Text>
        </Animated.View>

        {/* Animated Divider - Blush & White blend */}
        <Animated.View style={[styles.dividerContainer]}>
          <Animated.View style={[styles.dividerBlush, { width: lineWidth }]} />
          <Animated.View style={[styles.dividerWhite, { width: lineWidth, opacity: 0.5 }]} />
        </Animated.View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Curated for the refined woman
        </Animated.Text>
        
        {/* Subtle Blush Dot */}
        <Animated.View style={[styles.blushDot, { opacity: taglineOpacity }]} />
      </View>

      {/* CTA Section */}
      <Animated.View style={[styles.btnWrap, { opacity: btnOpacity }]}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.btnText}>SHOP NOW</Text>
          <View style={styles.btnBlushAccent} />
        </TouchableOpacity>
        
        <View style={styles.finePrint}>
          <View style={styles.fineLine} />
          <Text style={styles.fine}>Exclusive. Elegant. Yours.</Text>
          <View style={styles.fineLine} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    overflow: 'hidden',
  },
  
  // Premium Blush Decorative Elements
  blushOrbLarge: {
    position: 'absolute',
    top: height * 0.2,
    right: -width * 0.3,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#f0c6c615',
    borderWidth: 1,
    borderColor: '#f0c6c630',
  },
  
  whiteGlow: {
    position: 'absolute',
    top: height * 0.35,
    left: -width * 0.2,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: '#FFFFFF08',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.3,
    shadowRadius: 50,
    elevation: 10,
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
  
  blushParticle1: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#f0c6c680',
  },
  
  blushParticle2: {
    position: 'absolute',
    bottom: '25%',
    right: '15%',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#f0c6c660',
  },
  
  blushParticle3: {
    position: 'absolute',
    top: '40%',
    right: '8%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#f0c6c640',
  },
  
  // Content Section
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  
  logoContainer: {
    alignItems: 'center',
  },
  
  // ADDED: Image Logo Styles
  imageLogoWrapper: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  imageLogo: {
    width: width * 0.9,
    height: width * 0.9,
    maxWidth: 300,
    maxHeight: 100,
  },
  
  crownWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  
  crown: {
    fontSize: 52,
    color: '#f0c6c6',
    textAlign: 'center',
    textShadowColor: '#f0c6c680',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  
  crownAccent: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    width: 30,
    height: 1,
    backgroundColor: '#FFFFFF30',
    transform: [{ translateX: -15 }],
  },
  
  logo: {
    fontSize: 44,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 18,
    textAlign: 'center',
    marginTop: 8,
    textShadowColor: '#FFFFFF20',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  
  logoLine: {
    width: 50,
    height: 1,
    backgroundColor: '#f0c6c660',
    alignSelf: 'center',
    marginVertical: 12,
  },
  
  logoSub: {
    fontSize: 12,
    fontWeight: '400',
    color: '#f0c6c6',
    letterSpacing: 12,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  
  // Animated Dividers
  dividerContainer: {
    alignItems: 'center',
    marginVertical: 32,
    position: 'relative',
  },
  
  dividerBlush: {
    height: 1,
    backgroundColor: '#f0c6c6',
    alignSelf: 'center',
  },
  
  dividerWhite: {
    position: 'absolute',
    top: 0,
    height: 1,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
  },
  
  tagline: {
    fontSize: 13,
    color: '#FFFFFF90',
    letterSpacing: 3,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  blushDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#f0c6c6',
    marginTop: 20,
  },
  
  // Button Section
  btnWrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 2,
  },
  
  btn: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f0c6c6',
    paddingVertical: 18,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  btnBlushAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#f0c6c6',
  },
  
  btnText: {
    color: '#f0c6c6',
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '500',
  },
  
  finePrint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  
  fineLine: {
    width: 20,
    height: 1,
    backgroundColor: '#FFFFFF20',
    marginHorizontal: 12,
  },
  
  fine: {
    color: '#FFFFFF40',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '300',
  },
});