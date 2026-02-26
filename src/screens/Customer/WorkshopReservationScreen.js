import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../config/colors';
import config from '../../config/config';
import { useAuth } from '../../context/AuthContext';

export default function WorkshopReservationScreen({ navigation }) {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const { user, createReservation } = useAuth();

  const workshops = config.workshops.types;
  
  // Basit tarih seçenekleri
  const dateOptions = [
    { id: '1', date: '2026-02-01', label: '1 Şubat Cumartesi' },
    { id: '2', date: '2026-02-08', label: '8 Şubat Cumartesi' },
    { id: '3', date: '2026-02-15', label: '15 Şubat Cumartesi' },
    { id: '4', date: '2026-02-22', label: '22 Şubat Cumartesi' },
  ];

  const handleReservation = async () => {
    if (!selectedWorkshop || !selectedDate) {
      Alert.alert('Uyarı', 'Lütfen atölye ve tarih seçin');
      return;
    }

    const hasPackage = user?.packages && user.packages.some(p => {
      const remaining = p.total - p.used;
      return remaining > 0;
    });
    if (!hasPackage) {
      Alert.alert('Uyarı', 'Rezervasyon yapmak için aktif paketiniz olmalıdır');
      return;
    }

    Alert.alert(
      'Rezervasyon Onayı',
      `${selectedWorkshop.name}\n${selectedDate.label} - 14:00\n\nRezervasyonu onaylıyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Onayla',
          onPress: async () => {
            const result = await createReservation(
              selectedWorkshop.name,
              selectedDate.date,
              '14:00'
            );
            
            if (result.success) {
              Alert.alert(
                'Rezervasyon Başarılı! 🎉',
                `${selectedWorkshop.name} atölyesine ${selectedDate.label} - 14:00 saatinde rezervasyon yaptırdınız.\n\n⚠️ İşletmemize gelip atölyeye katılım sağladığınız zaman kalan hakkınız azalacaktır.`,
                [
                  { text: 'Tamam', onPress: () => navigation.goBack() }
                ]
              );
            } else {
              Alert.alert('Hata', result.error);
            }
          }
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={colors.gradients.splash}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Rezervasyon</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Atölye Seçimi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Atölye Seçin</Text>
            
            {workshops.map((workshop, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => setSelectedWorkshop(workshop)}
              >
                <LinearGradient
                  colors={
                    selectedWorkshop?.name === workshop.name
                      ? ['#FFB74D', '#FFF59D']
                      : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']
                  }
                  style={[
                    styles.workshopCard,
                    selectedWorkshop?.name === workshop.name && styles.selectedCard,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.workshopIcon}>{workshop.icon}</Text>
                  <View style={styles.workshopContent}>
                    <Text style={styles.workshopName}>{workshop.name}</Text>
                    <Text style={styles.workshopDescription}>{workshop.description}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tarih Seçimi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tarih Seçin</Text>
            
            {dateOptions.map((dateOption) => (
              <TouchableOpacity
                key={dateOption.id}
                activeOpacity={0.8}
                onPress={() => setSelectedDate(dateOption)}
              >
                <LinearGradient
                  colors={
                    selectedDate?.id === dateOption.id
                      ? ['#F5F0E8', '#F5F0E8']
                      : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']
                  }
                  style={[
                    styles.dateCard,
                    selectedDate?.id === dateOption.id && styles.selectedCard,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.dateIcon}>🗓️</Text>
                  <View style={styles.dateContent}>
                    <Text style={styles.dateLabel}>{dateOption.label}</Text>
                    <Text style={styles.dateTime}>14:00 - 16:00</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleReservation}
            disabled={!selectedWorkshop || !selectedDate}
          >
            <LinearGradient
              colors={
                !selectedWorkshop || !selectedDate
                  ? ['#CCCCCC', '#999999']
                  : ['#FFB74D', '#FFF59D']
              }
              style={[
                styles.confirmButton,
                (!selectedWorkshop || !selectedDate) && styles.confirmButtonDisabled,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.confirmButtonText}>Rezervasyonu Onayla</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer} />
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
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 50,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  workshopCard: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  workshopIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  workshopContent: {
    flex: 1,
  },
  workshopName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  workshopDescription: {
    fontSize: 13,
    color: colors.textLight,
  },
  dateCard: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  dateIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  dateContent: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: colors.textLight,
  },
  confirmButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  footer: {
    height: 30,
  },
});
