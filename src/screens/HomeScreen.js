import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import config from '../config/config';
import { useAuth } from '../context/AuthContext';
import { useImages } from '../context/ImageContext';

export default function HomeScreen({ navigation }) {
  const { submitReview, user } = useAuth();
  const { images } = useImages();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [suggestions, setSuggestions] = useState('');

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Uyarı', 'Lütfen bir puan verin');
      return;
    }

    const result = await submitReview(rating, feedback, suggestions);

    if (result.success) {
      Alert.alert(
        'Teşekkürler! 🙏',
        'Değerlendirmeniz başarıyla kaydedildi. Geri bildiriminiz bizim için çok değerli!',
        [{ 
          text: 'Tamam', 
          onPress: () => {
            setShowRatingModal(false);
            setRating(0);
            setFeedback('');
            setSuggestions('');
          }
        }]
      );
    } else {
      Alert.alert('Hata', 'Değerlendirmeniz kaydedilemedi. Lütfen tekrar deneyin.');
    }
  };
  const features = [
    {
      id: 'playarea',
      title: 'Oyun Alanı',
      subtitle: 'Güvenli ve Eğlenceli',
      icon: '🧸',
      gradient: colors.gradients.playArea,
      screen: 'PlayArea',
    },
    {
      id: 'cafe',
      title: 'Cafe Menü',
      subtitle: 'Lezzetli İkramlar',
      icon: '☕',
      gradient: colors.gradients.cafe,
      screen: 'Cafe',
    },
    {
      id: 'workshop',
      title: 'Atölyeler',
      subtitle: 'Eğlenceli Atölyeler',
      icon: '🎨',
      gradient: colors.gradients.workshop,
      screen: 'Workshops',
    },
    {
      id: 'birthday',
      title: 'Doğum Günü',
      subtitle: 'Özel Kutlamalar',
      icon: '🎂',
      gradient: colors.gradients.birthday,
      screen: 'Birthday',
    },
    {
      id: 'womens-workshop',
      title: 'Workshop',
      subtitle: 'Hanımlara Yönelik',
      icon: '✨',
      gradient: ['#F8BBD0', '#FCE4EC'],
      screen: 'WomensWorkshop',
    },
  ];

  return (
    <LinearGradient
      colors={['#F5F0E8', '#F5F0E8']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header - Geri ve Hesabım/Keşfet Butonları */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Splash')}
          >
            <Text style={styles.backButtonText}>‹ Giriş</Text>
          </TouchableOpacity>

          {user && user.role === 'customer' && (
            <TouchableOpacity
              style={styles.accountButton}
              onPress={() => navigation.navigate('CustomerProfile')}
            >
              <Text style={styles.accountButtonText}>👤 Hesabım</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Welcome Button */}
          <View style={styles.welcomeButtonContainer}>
            <LinearGradient
              colors={['#FFB74D', '#FFF59D']}
              style={styles.welcomeButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.welcomeButtonText}>Hoş Geldiniz! 👋</Text>
            </LinearGradient>
          </View>

          {/* Welcome Banner */}
          <LinearGradient
            colors={colors.gradients.splash}
            style={styles.welcomeBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>{config.app.slogan}</Text>
              <Text style={styles.bannerSubtitle}>
                Çocuklarınız için eğlenceli ve güvenli bir ortam
              </Text>
            </View>
            <Text style={styles.bannerEmoji}>🐰</Text>
          </LinearGradient>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Hizmetlerimiz</Text>
            
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(feature.screen)}
              >
                <LinearGradient
                  colors={feature.gradient}
                  style={styles.featureCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <LinearGradient
                    colors={colors.gradients.splash}
                    style={styles.featureIconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.featureIcon}>{feature.icon}</Text>
                  </LinearGradient>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                  </View>
                  <Text style={styles.featureArrow}>›</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Değerlendirme Bölümü */}
          <View style={styles.ratingSection}>
            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={() => setShowRatingModal(true)}
            >
              <LinearGradient
                colors={['#FFE4E1', '#FFF0F5', '#E8EAF6']}
                style={styles.ratingCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.ratingContent}>
                  <Text style={styles.ratingEmoji}>⭐</Text>
                  <View style={styles.ratingTextContainer}>
                    <Text style={styles.ratingTitle}>İşletmemizi Değerlendirin</Text>
                    <Text style={styles.ratingSubtitle}>
                      Görüşleriniz bizim için değerli! Puanlayın ve eksiklerimizi paylaşın.
                    </Text>
                  </View>
                  <Text style={styles.ratingArrow}>›</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <LinearGradient
              colors={colors.gradients.splash}
              style={styles.infoCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LinearGradient
                colors={colors.gradients.splash}
                style={styles.infoIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.infoIcon}>🕐</Text>
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Çalışma Saatleri</Text>
                <Text style={styles.infoText}>Hafta İçi: {config.business.workingHours.weekdays}</Text>
                <Text style={styles.infoText}>Hafta Sonu: {config.business.workingHours.weekend}</Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={colors.gradients.splash}
              style={styles.infoCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LinearGradient
                colors={colors.gradients.splash}
                style={styles.infoIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.infoIcon}>📍</Text>
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Adresimiz</Text>
                <Text style={styles.infoText}>{config.business.address}</Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={colors.gradients.splash}
              style={styles.infoCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LinearGradient
                colors={colors.gradients.splash}
                style={styles.infoIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.infoIcon}>💬</Text>
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>İletişim</Text>
                <Text style={styles.infoText}>WhatsApp: {config.business.whatsapp}</Text>
                <Text style={styles.infoText}>Instagram: {config.business.instagram}</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.footer}>
            <Image
              source={images.mainLogo}
              style={styles.footerLogo}
              resizeMode="contain"
            />
          </View>
        </ScrollView>

        {/* Değerlendirme Modal */}
        <Modal
          visible={showRatingModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowRatingModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={['#FFFFFF', '#FFF9F9']}
                style={styles.modalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>İşletmemizi Değerlendirin</Text>
                  <TouchableOpacity 
                    onPress={() => setShowRatingModal(false)}
                    style={styles.modalCloseButton}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Logo Puanlama */}
                <View style={styles.starsContainer}>
                  <Text style={styles.starsLabel}>İşletmemizi Puanlayın</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        activeOpacity={0.7}
                        style={styles.logoButton}
                      >
                        <View style={[
                          styles.logoContainer,
                          star <= rating && styles.logoContainerActive
                        ]}>
                          <Image
                            source={images.mainLogo}
                            style={[
                              styles.logoImage,
                              star > rating && styles.logoImageInactive
                            ]}
                            resizeMode="contain"
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {rating > 0 && (
                    <Text style={styles.ratingText}>
                      {rating === 1 && '😞 Kötü'}
                      {rating === 2 && '😐 İdare Eder'}
                      {rating === 3 && '🙂 İyi'}
                      {rating === 4 && '😊 Çok İyi'}
                      {rating === 5 && '🤩 Mükemmel'}
                    </Text>
                  )}
                </View>

                {/* Geri Bildirim - 2 Bölüm */}
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackLabel}>Eksiklerimiz</Text>
                  <TextInput
                    style={styles.feedbackInput}
                    placeholder="Neyi geliştirmemizi istersiniz?"
                    placeholderTextColor={colors.textLight}
                    multiline
                    numberOfLines={4}
                    value={feedback}
                    onChangeText={setFeedback}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackLabel}>Önerileriniz</Text>
                  <TextInput
                    style={styles.feedbackInput}
                    placeholder="Önerilerinizi paylaşın..."
                    placeholderTextColor={colors.textLight}
                    multiline
                    numberOfLines={4}
                    value={suggestions}
                    onChangeText={setSuggestions}
                    textAlignVertical="top"
                  />
                </View>

                {/* Gönder Butonu */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSubmitRating}
                >
                  <LinearGradient
                    colors={['#FFB74D', '#FFF59D']}
                    style={styles.submitButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.submitButtonText}>Gönder</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  backButtonContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  accountButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  accountButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  welcomeButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  welcomeButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  welcomeBanner: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 28,
    padding: 22,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 7,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 19,
  },
  bannerEmoji: {
    fontSize: 55,
    marginLeft: 12,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 18,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 22,
    borderRadius: 22,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 34,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  featureSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  featureArrow: {
    fontSize: 38,
    color: colors.textGray,
    marginLeft: 10,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 35,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoIcon: {
    fontSize: 26,
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
    marginBottom: 3,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  footerLogo: {
    width: 280,
    height: 100,
  },
  ratingSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  ratingCard: {
    padding: 20,
    borderRadius: 24,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 182, 193, 0.3)',
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  ratingTextContainer: {
    flex: 1,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  ratingSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  ratingArrow: {
    fontSize: 32,
    color: colors.textLight,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 450,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalGradient: {
    padding: 25,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(93, 64, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 22,
    color: colors.text,
    fontWeight: '600',
  },
  starsContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  bigLogoContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bigLogoImage: {
    width: '100%',
    height: '100%',
  },
  starsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  logoButton: {
    padding: 4,
  },
  logoContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 3,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoContainerActive: {
    borderColor: '#FFB74D',
    backgroundColor: '#FFF',
    shadowColor: '#FFB74D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.05 }],
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logoImageInactive: {
    opacity: 0.25,
  },
  starIcon: {
    fontSize: 44,
  },
  logoEmoji: {
    fontSize: 32,
  },
  logoEmojiInactive: {
    opacity: 0.3,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 12,
  },
  feedbackContainer: {
    marginBottom: 25,
  },
  feedbackLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  feedbackInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 15,
    fontSize: 15,
    color: colors.text,
    minHeight: 100,
    borderWidth: 2,
    borderColor: 'rgba(93, 64, 55, 0.15)',
  },
  submitButton: {
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
});
