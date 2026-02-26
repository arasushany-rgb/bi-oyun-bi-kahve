import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import colors from '../config/colors';
import { globalStyles } from '../config/theme';

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');

  const handleLogin = () => {
    // Firebase authentication burada yapılacak
    if (phoneNumber.length >= 10) {
      navigation.navigate('Home');
    } else {
      alert('Lütfen geçerli bir telefon numarası girin');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo Alanı */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🎈</Text>
            <Text style={styles.appName}>Bi Oyun Bi Kahve</Text>
            <Text style={styles.slogan}>Çocuklar için Eğlence, Aileler için Huzur</Text>
          </View>
        </View>

        {/* Giriş Formu */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Hoş Geldiniz!</Text>
          <Text style={styles.subtitle}>Devam etmek için bilgilerinizi girin</Text>

          <TextInput
            style={styles.input}
            placeholder="Adınız Soyadınız"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Telefon Numaranız (5XX XXX XX XX)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <TouchableOpacity
            style={[globalStyles.button, styles.loginButton]}
            onPress={handleLogin}
          >
            <Text style={globalStyles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>

          <Text style={styles.infoText}>
            Giriş yaparak{' '}
            <Text style={styles.link}>Kullanım Koşulları</Text> ve{' '}
            <Text style={styles.link}>Gizlilik Politikası</Text>'nı kabul etmiş olursunuz.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  logoPlaceholder: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  slogan: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingTop: 35,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 25,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
    color: colors.text,
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
});
