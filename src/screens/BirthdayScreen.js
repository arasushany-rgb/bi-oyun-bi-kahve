import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import config from '../config/config';
import { useAuth } from '../context/AuthContext';
import { useImages } from '../context/ImageContext';

export default function BirthdayScreen({ navigation }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { images } = useImages();

  const handleReservation = () => {
    if (!selectedPackage) {
      Alert.alert('Uyarı', 'Lütfen bir paket seçin');
      return;
    }

    // GİRİŞ KONTROLÜ YOK - Direkt rezervasyon formuna git
    navigation.navigate('ReservationForm', { 
      package: selectedPackage,
      type: 'birthday'
    });
  };

  return (
    <LinearGradient
      colors={['#F5F0E8', '#F5F0E8']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Doğum Günü</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Banner */}
          <ImageBackground
            source={images.birthdayImage}
            style={styles.banner}
            imageStyle={styles.bannerImage}
          />

          {/* Paket 1 - Temel */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temel Paket</Text>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedPackage({
                id: 'basic',
                name: config.birthday.concept1.name,
                weekday: config.birthday.concept1.prices.weekday,
                weekend: config.birthday.concept1.prices.weekend,
              })}
            >
              <LinearGradient
                colors={colors.gradients.birthday}
                style={[
                  styles.packageCard,
                  selectedPackage?.id === 'basic' && styles.packageCardSelected,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.packageHeader}>
                  <Text style={styles.packageIcon}>🎈</Text>
                  <View style={styles.packageTitleContainer}>
                    <Text style={styles.packageName}>{config.birthday.concept1.name}</Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedPackage?.id === 'basic' && styles.radioButtonSelected,
                  ]}>
                    {selectedPackage?.id === 'basic' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </View>

              <View style={styles.featuresContainer}>
                {config.birthday.concept1.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureBullet}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {config.birthday.concept1.extras && (
                <View style={styles.extrasBox}>
                  <Text style={styles.extrasIcon}>💡</Text>
                  <Text style={styles.extrasText}>{config.birthday.concept1.extras}</Text>
                </View>
              )}

              <View style={styles.priceSection}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Hafta İçi:</Text>
                  <Text style={styles.priceAmount}>{config.birthday.concept1.prices.weekday}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Hafta Sonu:</Text>
                  <Text style={styles.priceAmount}>{config.birthday.concept1.prices.weekend}</Text>
                </View>
              </View>
            </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Paket 2 - Premium */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Premium Paket</Text>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedPackage({
                id: 'premium',
                name: config.birthday.concept2.name,
                price: config.birthday.concept2.price,
              })}
            >
              <LinearGradient
                colors={colors.gradients.birthday}
                style={[
                  styles.packageCard,
                  styles.premiumCard,
                  selectedPackage?.id === 'premium' && styles.packageCardSelected,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.packageHeader}>
                  <Text style={styles.packageIcon}>👑</Text>
                  <View style={styles.packageTitleContainer}>
                    <Text style={styles.packageName}>{config.birthday.concept2.name}</Text>
                    <Text style={styles.packageSubtitle}>{config.birthday.concept2.subtitle}</Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedPackage?.id === 'premium' && styles.radioButtonSelected,
                  ]}>
                    {selectedPackage?.id === 'premium' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </View>

              <View style={styles.featuresContainer}>
                {config.birthday.concept2.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureBullet}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {/* Menü */}
              <View style={styles.menuSection}>
                <Text style={styles.menuTitle}>Menü İçeriği</Text>
                
                <View style={styles.menuCategory}>
                  <Text style={styles.menuCategoryTitle}>🥗 Salatalar</Text>
                  {config.birthday.concept2.menu.salads.map((item, index) => (
                    <Text key={index} style={styles.menuItem}>• {item}</Text>
                  ))}
                </View>

                <View style={styles.menuCategory}>
                  <Text style={styles.menuCategoryTitle}>🍽️ Ana Yemekler</Text>
                  {config.birthday.concept2.menu.mains.map((item, index) => (
                    <Text key={index} style={styles.menuItem}>• {item}</Text>
                  ))}
                </View>

                <View style={styles.menuCategory}>
                  <Text style={styles.menuCategoryTitle}>🥤 İçecekler</Text>
                  {config.birthday.concept2.menu.drinks.map((item, index) => (
                    <Text key={index} style={styles.menuItem}>• {item}</Text>
                  ))}
                </View>
              </View>

              <View style={styles.premiumPriceSection}>
                <Text style={styles.premiumPrice}>{config.birthday.concept2.price}</Text>
                <Text style={styles.premiumPriceNote}>35 kişi kapasite dahil</Text>
                <Text style={styles.premiumPriceNote}>Ekstra kişi başı 300₺</Text>
              </View>
            </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Bilgilendirme */}
          <View style={styles.infoSection}>
            <LinearGradient
              colors={colors.gradients.birthday}
              style={styles.infoCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.infoIcon}>📞</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Rezervasyon İçin</Text>
                <Text style={styles.infoText}>WhatsApp: {config.business.whatsapp}</Text>
                <Text style={styles.infoText}>Instagram: {config.business.instagram}</Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={colors.gradients.birthday}
              style={styles.infoCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.infoIcon}>ℹ️</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Önemli Bilgiler</Text>
                <Text style={styles.infoText}>
                  • Rezervasyon için en az 1 hafta önceden iletişime geçiniz{'\n'}
                  • Müsaitlik durumuna göre tarih belirlenecektir{'\n'}
                  • Kendi pastanızı getirebilirsiniz (Premium pakette maket pasta dahil){'\n'}
                  • İptal durumunda en geç 3 gün önce bildirim gereklidir
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Rezervasyon Butonu */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleReservation}
            disabled={!selectedPackage}
          >
            <LinearGradient
              colors={!selectedPackage ? ['#CCCCCC', '#999999'] : ['#FFB74D', '#FFF59D']}
              style={[
                styles.reservationButton,
                !selectedPackage && styles.reservationButtonDisabled,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.reservationButtonText}>
                {selectedPackage ? 'Rezervasyon Yap' : 'Paket Seçin'}
              </Text>
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
    color: '#000',
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
  partyImageBox: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  partyImage: {
    width: '100%',
    height: 280,
  },
  heroImageContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  imageContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  birthdayImage: {
    width: '100%',
    height: 400,
  },
  banner: {
    margin: 20,
    height: 350,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  bannerIcon: {
    fontSize: 70,
    marginBottom: 15,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  bannerText: {
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  packageCard: {
    padding: 24,
    borderRadius: 24,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  premiumCard: {
    borderWidth: 2,
    borderColor: 'rgba(129, 199, 132, 0.3)',
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  packageIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  packageTitleContainer: {
    flex: 1,
  },
  packageName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  packageSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  featureBullet: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  extrasBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  extrasIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  extrasText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  priceSection: {
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: 'rgba(93, 64, 55, 0.1)',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  menuSection: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 16,
    borderRadius: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 14,
  },
  menuCategory: {
    marginBottom: 14,
  },
  menuCategoryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  menuItem: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
    marginLeft: 10,
  },
  premiumPriceSection: {
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: 'rgba(93, 64, 55, 0.1)',
    alignItems: 'center',
  },
  premiumPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  premiumPriceNote: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 22,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 7,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 21,
  },
  packageCardSelected: {
    borderWidth: 2,
    borderColor: 'rgba(129, 199, 132, 0.5)',
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
    backgroundColor: '#000',
  },
  bannerImage: {
    borderRadius: 18,
    resizeMode: 'cover',
  },
  bannerIcon: {
    fontSize: 50,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  bannerText: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  reservationButton: {
    marginHorizontal: 20,
    marginBottom: 30,
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
  reservationButtonDisabled: {
    opacity: 0.5,
  },
  reservationButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  footer: {
    height: 30,
  },
});
