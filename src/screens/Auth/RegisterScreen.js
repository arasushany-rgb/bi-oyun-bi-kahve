import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../config/colors';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!parentName || !childName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Uyarı', 'Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Uyarı', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    // Veli ve çocuk ismini birleştirerek kaydet
    const fullName = `${parentName} (Çocuk: ${childName})`;
    const result = await register(email, password, fullName, phone, childName);
    setLoading(false);

    if (result.success) {
      Alert.alert('Başarılı', 'Hesabınız oluşturuldu!', [
        { text: 'Tamam', onPress: () => navigation.replace('CustomerProfile') }
      ]);
    } else {
      Alert.alert('Hata', result.error || 'Kayıt başarısız');
    }
  };

  return (
    <LinearGradient
      colors={colors.gradients.splash}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <Text style={styles.title}>Kayıt Ol</Text>
              <Text style={styles.subtitle}>Hesap Oluştur</Text>

              <View style={styles.form}>
                <Text style={styles.label}>Veli Adı Soyadı *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ayşe Yılmaz"
                  value={parentName}
                  onChangeText={setParentName}
                  autoCapitalize="words"
                />

                <Text style={styles.label}>Çocuk Adı Soyadı *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ali Yılmaz"
                  value={childName}
                  onChangeText={setChildName}
                  autoCapitalize="words"
                />

                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ornek@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Text style={styles.label}>Telefon *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+90 5XX XXX XX XX"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />

                <Text style={styles.label}>Şifre *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="En az 6 karakter"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <Text style={styles.label}>Şifre Tekrar *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#FFB74D', '#FFF59D']}
                    style={styles.registerButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.registerButtonText}>
                      {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.loginLink}>Giriş Yap</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
    marginBottom: 40,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(129, 199, 132, 0.2)',
    color: colors.text,
  },
  registerButton: {
    padding: 18,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 15,
    color: colors.textLight,
  },
  loginLink: {
    fontSize: 15,
    color: colors.text,
    fontWeight: 'bold',
  },
});
