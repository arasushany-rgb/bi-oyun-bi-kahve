import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import colors from '../config/colors';
import config from '../config/config';
import { globalStyles } from '../config/theme';

export default function CheckInScreen({ navigation }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [childName, setChildName] = useState('');

  const handleCheckIn = () => {
    if (!selectedPackage) {
      Alert.alert('Uyarı', 'Lütfen bir süre paketi seçin');
      return;
    }

    // Firebase'e kayıt işlemi burada yapılacak
    const checkInTime = new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    Alert.alert(
      'Check-In Başarılı! ✅',
      `Çocuğunuz ${selectedPackage.name} için kayıt edildi.\n\nGiriş Saati: ${checkInTime}\n\nSüre dolmadan 10 dakika önce bildirim alacaksınız.`,
      [
        {
          text: 'Tamam',
          onPress: () => navigation.navigate('PlayAreaTracking', {
            packageInfo: selectedPackage,
            checkInTime: new Date(),
          }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹ Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Oyun Alanı Check-In</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🎮</Text>
          <Text style={styles.infoTitle}>Oyun Alanına Hoş Geldiniz!</Text>
          <Text style={styles.infoText}>
            Lütfen kalacağınız süreyi seçin. Süre dolmadan önce size bildirim göndereceğiz.
          </Text>
        </View>

        {/* Paket Seçimi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Süre Seçimi</Text>
          
          {config.playArea.packages.map((pkg, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.packageCard,
                selectedPackage?.hours === pkg.hours && styles.packageCardSelected,
              ]}
              onPress={() => setSelectedPackage(pkg)}
            >
              <View style={styles.packageInfo}>
                <View style={styles.packageHeader}>
                  <Text style={[
                    styles.packageName,
                    selectedPackage?.hours === pkg.hours && styles.packageNameSelected,
                  ]}>
                    {pkg.name}
                  </Text>
                  {pkg.discount && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>%{pkg.discount} İndirim</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.packagePrice}>{pkg.price} ₺</Text>
                {pkg.discount && (
                  <Text style={styles.originalPrice}>
                    {(pkg.hours * config.playArea.hourlyRate)} ₺
                  </Text>
                )}
              </View>
              
              <View style={[
                styles.radioButton,
                selectedPackage?.hours === pkg.hours && styles.radioButtonSelected,
              ]}>
                {selectedPackage?.hours === pkg.hours && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bilgilendirme */}
        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>⏰</Text>
          <View style={styles.warningTextContainer}>
            <Text style={styles.warningTitle}>Hatırlatma</Text>
            <Text style={styles.warningText}>
              Süreniz dolmadan {config.playArea.warningMinutes} dakika önce size bildirim göndereceğiz.
              Devam etmek isterseniz sürenizi uzatabilirsiniz.
            </Text>
          </View>
        </View>

        {/* Check-In Butonu */}
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.checkInButton,
            !selectedPackage && styles.checkInButtonDisabled,
          ]}
          onPress={handleCheckIn}
          disabled={!selectedPackage}
        >
          <Text style={globalStyles.buttonText}>
            Check-In Yap {selectedPackage && `(${selectedPackage.price} ₺)`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  infoCard: {
    backgroundColor: colors.playArea,
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  packageCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  packageCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F5F0E8',
  },
  packageInfo: {
    flex: 1,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 10,
  },
  packageNameSelected: {
    color: colors.primary,
  },
  discountBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  packagePrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textGray,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  radioButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  warningIcon: {
    fontSize: 30,
    marginRight: 12,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 3,
  },
  warningText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  checkInButton: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  checkInButtonDisabled: {
    opacity: 0.5,
  },
});
