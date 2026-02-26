import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import { useAuth } from '../context/AuthContext';

export default function WomensWorkshopReservationScreen({ route, navigation }) {
  const { workshop } = route.params;
  const { user, submitWomensWorkshopReservation, workshopDates } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    notes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert(
        'Giriş Gerekli',
        'Rezervasyon yapmak için giriş yapmalısınız.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Giriş Yap', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    if (!formData.name || !formData.phone || !formData.preferredDate) {
      Alert.alert('Uyarı', 'Lütfen zorunlu alanları doldurun (Ad Soyad, Telefon, Tarih)');
      return;
    }

    const result = await submitWomensWorkshopReservation({
      workshop: workshop.name,
      ...formData,
    });

    if (result.success) {
      Alert.alert(
        'Rezervasyon Alındı! ✨',
        `${workshop.name} workshopuna ${formData.preferredDate} tarihinde rezervasyon yaptırdınız.\n\n⚠️ İşletmemize gelip workshopa katılım sağladığınız zaman kalan hakkınız azalacaktır.\n\nEn kısa sürede sizinle iletişime geçeceğiz.`,
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } else {
      Alert.alert('Hata', result.error || 'Rezervasyon alınamadı. Lütfen tekrar deneyin.');
    }
  };

  return (
    <LinearGradient
      colors={['#F5F0E8', '#F5F0E8']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rezervasyon Formu</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <LinearGradient
              colors={['#F5F0E8', '#F5F0E8']}
              style={styles.workshopBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.workshopIcon}>{workshop.icon}</Text>
              <Text style={styles.workshopName}>{workshop.name}</Text>
              <Text style={styles.workshopPrice}>{workshop.price}</Text>
            </LinearGradient>

            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>

              <Text style={styles.label}>Ad Soyad *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Adınız ve soyadınız"
                placeholderTextColor={colors.textLight}
              />

              <Text style={styles.label}>Telefon *</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="05XX XXX XX XX"
                placeholderTextColor={colors.textLight}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>E-posta (Opsiyonel)</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="ornek@email.com"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Tercih Edilen Tarih *</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[
                  styles.datePickerText,
                  !formData.preferredDate && styles.datePickerPlaceholder
                ]}>
                  {formData.preferredDate || 'Tarih seçin'}
                </Text>
                <Text style={styles.datePickerIcon}>🗓️</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Not (Opsiyonel)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Eklemek istediğiniz notlar..."
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSubmit}
              >
                <LinearGradient
                  colors={['#F5F0E8', '#F5F0E8']}
                  style={styles.submitButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitButtonText}>Rezervasyon Talebi Gönder</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.infoText}>
                * İşaretli alanlar zorunludur. Rezervasyon talebiniz admin paneline düşecek ve en kısa sürede sizinle iletişime geçilecektir.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Tarih Seçim Modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Tarih Seçin</Text>
              
              {workshopDates.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dateOption}
                  onPress={() => {
                    setFormData({ ...formData, preferredDate: date });
                    setShowDatePicker(false);
                  }}
                >
                  <LinearGradient
                    colors={
                      formData.preferredDate === date
                        ? ['#F5F0E8', '#F5F0E8']
                        : ['#F5F5F5', '#FFFFFF']
                    }
                    style={styles.dateOptionGradient}
                  >
                    <Text style={[
                      styles.dateOptionText,
                      formData.preferredDate === date && styles.dateOptionTextActive
                    ]}>
                      {date}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.modalCloseText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    padding: 20,
  },
  workshopBanner: {
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  workshopIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  workshopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  workshopPrice: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
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
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: colors.text,
    borderWidth: 2,
    borderColor: 'rgba(255, 182, 193, 0.3)',
  },
  textArea: {
    minHeight: 100,
  },
  submitButton: {
    marginTop: 25,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  infoText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 18,
  },
  datePickerButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: colors.text,
    borderWidth: 2,
    borderColor: 'rgba(255, 182, 193, 0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 15,
    color: colors.text,
  },
  datePickerPlaceholder: {
    color: colors.textLight,
  },
  datePickerIcon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateOption: {
    marginBottom: 12,
  },
  dateOptionGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  dateOptionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  dateOptionTextActive: {
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
});
