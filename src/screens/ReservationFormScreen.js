import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import { globalStyles } from '../config/theme';
import { useAuth } from '../context/AuthContext';

export default function ReservationFormScreen({ route, navigation }) {
  const { package: selectedPackage, type } = route.params;
  const { purchasePackage, user } = useAuth();
  
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    childAge: '',
    phone: '',
    email: '',
    preferredDate: '',
    notes: '',
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.parentName || !formData.childName || !formData.phone || !formData.preferredDate) {
      Alert.alert('Uyarı', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    // PAKET KONTROLÜ KALDIRILDI - Giriş yapılmadan da kullanılabilir
    
    // Rezervasyon talebini kaydet (eğer user varsa purchasePackage çağır)
    let result = { success: true };
    
    if (user) {
      // Giriş yapmışsa paketi satın al
      result = await purchasePackage(selectedPackage);
    }
    
    if (result.success) {
      const packagePrice = type === 'birthday' 
        ? (selectedPackage.weekday ? `${selectedPackage.weekday}₺ (Hafta İçi) / ${selectedPackage.weekend}₺ (Hafta Sonu)` : `${selectedPackage.price}₺`)
        : selectedPackage.price;

      // Başarılı mesajı
      const birthdayMessage = `Sayın ${formData.parentName},\n\n${selectedPackage.name} için rezervasyon talebiniz alınmıştır.\n\nFiyat: ${packagePrice}\nTercih Edilen Tarih: ${formData.preferredDate}\n\nEn kısa sürede sizinle iletişime geçeceğiz.\n\nTeşekkürler! 🎂`;
      
      const workshopMessage = `Sayın ${formData.parentName},\n\n${selectedPackage.name} için rezervasyon talebiniz alınmıştır.\n\nFiyat: ${packagePrice}\nTercih Edilen Tarih: ${formData.preferredDate}\n\n⚠️ Hakkınız henüz azalmadı. İşletmemize gelip atölyeye katılım sağladığınızda hakkınız azalacaktır.\n\nTeşekkürler! 🎨`;

      Alert.alert(
        'Rezervasyon Talebi Alındı! ✅',
        type === 'birthday' ? birthdayMessage : workshopMessage,
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } else {
      Alert.alert('Hata', 'Rezervasyon talebi gönderilemedi.');
    }
  };

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Rezervasyon Formu</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Package Info */}
          <LinearGradient
            colors={type === 'birthday' ? colors.gradients.splash : colors.gradients.workshop}
            style={styles.packageInfo}
          >
            <Text style={styles.packageInfoIcon}>{type === 'birthday' ? '🎂' : '🎨'}</Text>
            <View style={styles.packageInfoContent}>
              <Text style={styles.packageInfoTitle}>Seçilen Paket</Text>
              <Text style={styles.packageInfoName}>{selectedPackage.name}</Text>
              <Text style={styles.packageInfoPrice}>
                {type === 'birthday' 
                  ? (selectedPackage.weekday ? `${selectedPackage.weekday}₺ (Hafta İçi) / ${selectedPackage.weekend}₺ (Hafta Sonu)` : `${selectedPackage.price}₺`)
                  : `${selectedPackage.price}₺`
                }
              </Text>
            </View>
          </LinearGradient>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>İletişim Bilgileri</Text>

          <Text style={styles.label}>
            Veli Adı Soyadı <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: Ayşe Yılmaz"
            value={formData.parentName}
            onChangeText={(text) => setFormData({ ...formData, parentName: text })}
            autoCapitalize="words"
          />

          <Text style={styles.label}>
            Çocuğun Adı Soyadı <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: Ali Yılmaz"
            value={formData.childName}
            onChangeText={(text) => setFormData({ ...formData, childName: text })}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Çocuğun Yaşı</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 7"
            value={formData.childAge}
            onChangeText={(text) => setFormData({ ...formData, childAge: text })}
            keyboardType="number-pad"
            maxLength={2}
          />

          <Text style={styles.label}>
            Telefon Numarası <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="5XX XXX XX XX"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            placeholder="ornek@email.com"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>
            Tercih Edilen Tarih <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 15 Şubat 2026 veya Hafta sonu"
            value={formData.preferredDate}
            onChangeText={(text) => setFormData({ ...formData, preferredDate: text })}
          />

          <Text style={styles.label}>Notlar / Özel İstekler</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Varsa eklemek istediğiniz notlar..."
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Formu gönderdikten sonra tarafınızla iletişime geçerek rezervasyon detaylarını netleştireceğiz.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFB74D', '#FFF59D']}
              style={styles.submitButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.submitButtonText}>Rezervasyon Talebi Gönder</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.requiredNote}>
            <Text style={styles.required}>*</Text> Zorunlu alanlar
          </Text>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 50,
  },
  packageInfo: {
    flexDirection: 'row',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  packageInfoIcon: {
    fontSize: 50,
    marginRight: 15,
  },
  packageInfoContent: {
    flex: 1,
  },
  packageInfoTitle: {
    fontSize: 13,
    color: colors.textGray,
    marginBottom: 4,
  },
  packageInfoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  packageInfoPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.workshop,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  required: {
    color: colors.error,
    fontSize: 16,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    padding: 15,
    borderRadius: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  submitButton: {
    marginTop: 25,
    marginBottom: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  requiredNote: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: 'center',
    marginTop: 10,
  },
});
