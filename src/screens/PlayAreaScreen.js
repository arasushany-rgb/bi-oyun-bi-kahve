import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import config from '../config/config';
import { useImages } from '../context/ImageContext';

export default function PlayAreaScreen({ navigation }) {
  const { images } = useImages();
  return (
    <LinearGradient
      colors={colors.gradients.splash}
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
          <Text style={styles.title}>Oyun Alanı</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Kapak Görseli */}
          <View style={styles.coverImageContainer}>
            <Image 
              source={images.playAreaImage} 
              style={{width: '100%', height: 200, borderRadius: 28}} 
            />
          </View>

          {/* Kapak Banner - Yeşil-Sarı Gradyan */}
          <LinearGradient
            colors={colors.gradients.splash}
            style={styles.coverBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.coverIcon}>🧸</Text>
            <Text style={styles.coverTitle}>Güvenli Oyun Alanı</Text>
            <Text style={styles.coverText}>{config.playArea.description}</Text>
          </LinearGradient>

          {/* Özellikler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Özelliklerimiz</Text>
            
            {config.playArea.features.map((feature, index) => (
              <LinearGradient
                key={index}
                colors={colors.gradients.splash}
                style={styles.featureItem}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  style={styles.checkContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.featureIcon}>✓</Text>
                </LinearGradient>
                <Text style={styles.featureText}>{feature}</Text>
              </LinearGradient>
            ))}
          </View>

          {/* Fiyatlar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fiyat Bilgileri</Text>
            
            {config.playArea.packages.map((pkg, index) => (
              <LinearGradient
                key={index}
                colors={colors.gradients.splash}
                style={styles.priceCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.priceInfo}>
                  <Text style={styles.priceName}>{pkg.name}</Text>
                  <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    style={styles.priceBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.priceAmount}>{pkg.price}</Text>
                  </LinearGradient>
                </View>
              </LinearGradient>
            ))}
            
            <Text style={styles.packageContactText}>{config.playArea.contactForPackages}</Text>
          </View>

          {/* Bilgilendirme */}
          <View style={styles.infoSection}>
            {[
              { icon: '🎯', title: 'Nasıl Çalışır?', text: '• İşletme de kayıt olun\n• Çocuğunuz için süre paketini seçin\n• Oyun ablası eşliğinde eğlence başlasın!\n• Siz cafe alanında rahatlayın' },
              { icon: '⏰', title: 'Süre Bilgileri', text: 'Seçtiğiniz süre sonunda çocuğunuzu teslim alabilirsiniz. Süre uzatmak isterseniz işletmeden bilgi alabilirsiniz.' },
              { icon: '👶', title: 'Yaş Aralığı', text: 'Oyun alanımız 3-12 yaş arası çocuklar için uygundur. Farklı yaş grupları için uygun aktiviteler bulunmaktadır.' },
              { icon: '🧼', title: 'Hijyen', text: 'Tüm oyun malzemelerimiz düzenli olarak temizlenir ve dezenfekte edilir. Çocuklarınızın sağlığı bizim önceliğimizdir.' },
            ].map((info, index) => (
              <LinearGradient
                key={index}
                colors={colors.gradients.splash}
                style={styles.infoCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.infoIcon}>{info.icon}</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>{info.title}</Text>
                  <Text style={styles.infoText}>{info.text}</Text>
                </View>
              </LinearGradient>
            ))}
          </View>

          {/* CTA */}
          <LinearGradient
            colors={colors.gradients.splash}
            style={styles.ctaCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.ctaEmoji}>🎈</Text>
            <Text style={styles.ctaTitle}>Hemen Gelin!</Text>
            <Text style={styles.ctaText}>
              Çocuklarınızla birlikte eğlenceli bir gün geçirmek için bizi ziyaret edin.
            </Text>
            <View style={styles.ctaInfo}>
              <Text style={styles.ctaInfoText}>📍 {config.business.address}</Text>
              <Text style={styles.ctaInfoText}>💬 {config.business.whatsapp}</Text>
            </View>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverImageContainer: {
    margin: 20,
    marginBottom: 0,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
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
  coverImageContainer: {
    margin: 20,
    marginBottom: 0,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  coverBanner: {
    margin: 20,
    padding: 30,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  coverIcon: {
    fontSize: 70,
    marginBottom: 15,
  },
  coverTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  coverText: {
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
  featureItem: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.cardBg,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  priceCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  priceBadge: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  priceAmount: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.text,
  },
  packageContactText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
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
  ctaCard: {
    marginHorizontal: 20,
    marginBottom: 35,
    padding: 28,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaEmoji: {
    fontSize: 55,
    marginBottom: 14,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  ctaText: {
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },
  ctaInfo: {
    alignItems: 'center',
  },
  ctaInfoText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 5,
  },
});
