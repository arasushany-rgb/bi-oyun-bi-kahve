import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import config from '../config/config';

export default function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={colors.gradients.splash}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View style={[
        styles.content,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        {/* Logo Area */}
        <Image 
          source={require('../../assets/images/splash-logo.png')} 
          style={styles.logoImage} 
        />

        {/* Slogan */}
        <Text style={styles.slogan}>{config.app.slogan}</Text>
        <Text style={styles.location}>{config.business.address}</Text>

        {/* Enter Button - Gradyanlı */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.replace('Home')}
        >
          <LinearGradient
            colors={colors.gradients.button}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Keşfet</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>

        {/* Social */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>Instagram: {config.business.instagram}</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoImage: {
    width: 240,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  logoEmoji: {
    fontSize: 50,
  },
  logoTextBi: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 2,
  },
  logoTextOyun: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#FFB74D',
    letterSpacing: 2,
  },
  logoTextKahve: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#FF9800',
    letterSpacing: 2,
    marginTop: -8,
  },
  bunnyContainer: {
    position: 'absolute',
    left: -65,
    top: 55,
  },
  bunny: {
    fontSize: 75,
  },
  slogan: {
    fontSize: 17,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  location: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: 45,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 65,
    borderRadius: 30,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 15,
  },
  buttonText: {
    color: colors.text,
    fontSize: 21,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginButton: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(129, 199, 132, 0.4)',
    marginBottom: 30,
  },
  loginButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    fontSize: 15,
    color: colors.textLight,
    fontWeight: '600',
  },
});
