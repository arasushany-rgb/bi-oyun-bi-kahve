import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../config/colors';
import { useAuth } from '../../context/AuthContext';
import { useImages } from '../../context/ImageContext';

export default function CustomerProfileScreen({ navigation, route }) {
  const { user, logout, addStamp, useFreeEntry, refreshUserData, submitReview } = useAuth();
  const { images } = useImages();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const scrollViewRef = useRef(null);
  const packageSectionRef = useRef(null);

  // Eğer route params'dan scrollToPackages varsa, paket bölümüne scroll et
  useEffect(() => {
    if (route?.params?.scrollToPackages && packageSectionRef.current) {
      setTimeout(() => {
        packageSectionRef.current.measureLayout(
          scrollViewRef.current,
          (x, y) => {
            scrollViewRef.current.scrollTo({ y: y - 20, animated: true });
          }
        );
      }, 100);
    }
  }, [route?.params?.scrollToPackages]);

  // Sadakat kartı tamamlanınca kutlama göster
  useEffect(() => {
    if (user?.loyaltyCard?.stamps === 0 && user?.loyaltyCard?.freeEntries > 0) {
      // Kartın yeni tamamlanıp tamamlanmadığını kontrol et
      const lastCheck = user?.loyaltyCard?.lastCelebration || 0;
      const now = Date.now();
      
      // 5 saniye içinde gösterilmemişse göster
      if (now - lastCheck > 5000) {
        setShowCelebration(true);
        
        // Animasyon başlat
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();

        // 5 saniye sonra kapat
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setShowCelebration(false);
          });
        }, 5000);
      }
    }
  }, [user?.loyaltyCard]);

  // Ücretsiz giriş kodu kullan
  const handleUseCode = () => {
    if (!user?.loyaltyCard?.redemptionCode) {
      Alert.alert('Hata', 'Kullanılabilir kod bulunamadı');
      return;
    }

    Alert.alert(
      'Kodu Kullan',
      `Ücretsiz giriş kodunuzu kullanmak istediğinize emin misiniz?\n\nKod: ${user.loyaltyCard.redemptionCode}`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kullan',
          onPress: async () => {
            const result = await useFreeEntry(user.loyaltyCard.redemptionCode);
            if (result.success) {
              await refreshUserData();
              Alert.alert('Başarılı!', 'Ücretsiz giriş hakkınız kullanıldı! 🎉');
            } else {
              Alert.alert('Hata', result.error || 'Kod kullanılamadı');
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          onPress: async () => {
            await logout();
            navigation.replace('Splash');
          }
        },
      ]
    );
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Uyarı', 'Lütfen bir puan verin');
      return;
    }

    // Değerlendirmeyi Firestore'a kaydet
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
      Alert.alert('Hata', result.error || 'Değerlendirme gönderilemedi');
    }
  };

  const totalRemaining = user?.packages?.reduce((sum, pkg) => {
    // DOĞRU MANTIK: Kalan = Satın Alınan - Kullanılan
    const remaining = pkg.total - pkg.used;
    return sum + remaining;
  }, 0) || 0;
  const totalUsed = user?.packages?.reduce((sum, pkg) => sum + pkg.used, 0) || 0;
  const totalPurchased = user?.packages?.reduce((sum, pkg) => sum + pkg.total, 0) || 0;

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
            onPress={() => navigation.navigate('Splash')}
          >
            <Text style={styles.backButtonText}>‹ Giriş</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profilim</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>🔍 Keşfet</Text>
          </TouchableOpacity>
        </View>

        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
          {/* Kullanıcı Bilgileri */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.cardIcon}>👤</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userPhone}>{user?.phone}</Text>
          </LinearGradient>

          {/* Özet Kartı */}
          <View style={styles.summaryContainer}>
            <LinearGradient
              colors={['#FFB74D', '#FFF59D']}
              style={styles.summaryCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.summaryLabel}>Kalan Hak</Text>
              <Text style={styles.summaryValue}>{totalRemaining}</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#F5F0E8', '#F5F0E8']}
              style={styles.summaryCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.summaryLabel}>Kullanılan</Text>
              <Text style={styles.summaryValue}>{totalUsed}</Text>
            </LinearGradient>
          </View>

          {/* Değerlendirme Bölümü */}
          <View style={styles.section}>
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

          {/* Oyun Alanı Sadakat Kartı */}
          {user?.loyaltyCard && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎁 Oyun Alanı Sadakat Kartı</Text>
              <LinearGradient
                colors={['#FFE4E1', '#FFF8DC']}
                style={styles.loyaltyCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.loyaltyTitle}>9 Alana 1 Bedava!</Text>
                <Text style={styles.loyaltySubtitle}>
                  9 defa oyun alanına geldiğinizde 10. giriş ücretsiz
                </Text>

                {/* Damgalar */}
                <View style={styles.stampsContainer}>
                  {[...Array(9)].map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.stamp,
                        index < user.loyaltyCard.stamps && styles.stampFilled
                      ]}
                    >
                      <Text style={styles.stampText}>
                        {index < user.loyaltyCard.stamps ? '✓' : (index + 1)}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Progress */}
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${(user.loyaltyCard.stamps / 9) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {user.loyaltyCard.stamps}/9 Damga
                  </Text>
                </View>

                {/* Ücretsiz Girişler */}
                {user.loyaltyCard.freeEntries > 0 && (
                  <View style={styles.freeEntriesBox}>
                    <Text style={styles.freeEntriesText}>
                      🎉 {user.loyaltyCard.freeEntries} Ücretsiz Giriş Hakkınız Var!
                    </Text>
                    
                    {/* Kullanım Kodu */}
                    {user.loyaltyCard.redemptionCode && (
                      <View style={styles.codeBox}>
                        <Text style={styles.codeLabel}>Kullanım Kodunuz:</Text>
                        <Text style={styles.codeValue}>{user.loyaltyCard.redemptionCode}</Text>
                        <Text style={styles.codeHint}>
                          ⚠️ Bu kodu gelişinizde personele söyleyin
                        </Text>
                        
                        {/* Kodu Kullan Butonu */}
                        <TouchableOpacity
                          style={styles.useCodeButton}
                          onPress={handleUseCode}
                        >
                          <LinearGradient
                            colors={['#4CAF50', '#66BB6A']}
                            style={styles.useCodeGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >
                            <Text style={styles.useCodeText}>✓ Kodu Kullan</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </LinearGradient>
            </View>
          )}

          {/* Doğum Günü Paketlerim */}
          {user?.birthdayPackages && user.birthdayPackages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎂 Doğum Günü Paketlerim</Text>
              
              {user.birthdayPackages.map((pkg, index) => (
                <LinearGradient
                  key={index}
                  colors={['#FFE4E1', '#FFB6C1']}
                  style={styles.birthdayCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.birthdayHeader}>
                    <Text style={styles.birthdayIcon}>🎂</Text>
                    <View style={styles.birthdayInfo}>
                      <Text style={styles.birthdayName}>{pkg.packageName}</Text>
                      <Text style={styles.birthdayDate}>Tarih: {pkg.date}</Text>
                      <Text style={styles.birthdayGuests}>👥 Misafir: {pkg.guests} kişi</Text>
                    </View>
                  </View>
                  
                  <View style={styles.birthdayFooter}>
                    <Text style={styles.birthdayPrice}>{pkg.price}</Text>
                    <View style={[
                      styles.birthdayBadge,
                      { backgroundColor: pkg.isPaid ? '#4CAF50' : '#FF9800' }
                    ]}>
                      <Text style={styles.birthdayBadgeText}>
                        {pkg.isPaid ? 'Ödendi' : 'Ödenmedi'}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              ))}
            </View>
          )}

          {/* Bekleyen Rezervasyonlar */}
          {user?.reservations && user.reservations.filter(r => r.status === 'pending').length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bekleyen Rezervasyonlar</Text>
              
              {user.reservations
                .filter(r => r.status === 'pending')
                .map((reservation) => (
                  <LinearGradient
                    key={reservation.id}
                    colors={['#FFF9C4', '#FFFDE7']}
                    style={styles.reservationCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.reservationHeader}>
                      <Text style={styles.reservationWorkshop}>🎨 {reservation.workshopName}</Text>
                      <View style={[
                        styles.reservationStatus,
                        { backgroundColor: '#FF9800' }
                      ]}>
                        <Text style={styles.reservationStatusText}>Bekliyor</Text>
                      </View>
                    </View>
                    
                    <View style={styles.reservationDetails}>
                      <Text style={styles.reservationDate}>{reservation.date}</Text>
                      <Text style={styles.reservationTime}>🕐 {reservation.time}</Text>
                    </View>
                    
                    <View style={styles.reservationNote}>
                      <Text style={styles.reservationNoteText}>
                        ℹ️ Rezervasyonunuz onaylandı. Atölyeye geldiğinizde hakkınız azalacaktır.
                      </Text>
                    </View>
                  </LinearGradient>
                ))}
            </View>
          )}

          {/* Paketlerim */}
          <View ref={packageSectionRef} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Paketlerim</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('PurchasePackage')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFB74D', '#FFF59D']}
                  style={styles.addButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.addButtonText}>+ Paket Al</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {user?.packages && user.packages.length > 0 ? (
              user.packages.map((pkg, index) => (
                <LinearGradient
                  key={index}
                  colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                  style={styles.packageCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.packageHeader}>
                    <Text style={styles.packageName}>{pkg.name}</Text>
                    <View style={[
                      styles.paymentBadge,
                      { backgroundColor: pkg.isPaid ? '#4CAF50' : '#FF9800' }
                    ]}>
                      <Text style={styles.paymentBadgeText}>
                        {pkg.isPaid ? 'Ödendi' : 'Ödenmedi'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.packageProgress}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${(pkg.used / pkg.total) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {pkg.used}/{pkg.total} Kullanıldı
                    </Text>
                  </View>

                  <View style={styles.packageFooter}>
                    <Text style={styles.packagePrice}>{pkg.price} ₺</Text>
                    <Text style={styles.packageDate}>{pkg.purchaseDate}</Text>
                  </View>
                </LinearGradient>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Henüz paket almadınız</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PurchasePackage')}>
                  <Text style={styles.emptyStateLink}>İlk paketinizi alın</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Katılım Geçmişi */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Katılım Geçmişim</Text>
              {totalRemaining > 0 && (
                <TouchableOpacity onPress={() => navigation.navigate('WorkshopReservation')}>
                  <Text style={styles.addButton}>+ Rezervasyon</Text>
                </TouchableOpacity>
              )}
            </View>

            {user?.workshopHistory && user.workshopHistory.length > 0 ? (
              user.workshopHistory.map((workshop, index) => (
                <LinearGradient
                  key={index}
                  colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                  style={styles.historyCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.historyIcon}>🎨</Text>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyName}>{workshop.workshopName}</Text>
                    <Text style={styles.historyDate}>{workshop.date} • {workshop.time}</Text>
                  </View>
                </LinearGradient>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Henüz atölyeye katılmadınız</Text>
              </View>
            )}
          </View>

          {/* Çıkış Butonu */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>

          <View style={styles.footer} />
        </ScrollView>

        {/* 🎉 Havai Fişek Kutlama Modal */}
        {showCelebration && (
          <Animated.View style={[styles.celebrationOverlay, { opacity: fadeAnim }]}>
            <View style={styles.celebrationContent}>
              <Text style={styles.fireworks}>🎆🎇✨🎉</Text>
              <Text style={styles.celebrationTitle}>TEBRİKLER!</Text>
              <Text style={styles.celebrationMessage}>
                9 kere oyun alanımıza geldiğiniz için{'\n'}
                bir dahaki gelişiniz bizden! 🎁
              </Text>
              <Text style={styles.celebrationSubtext}>
                Ücretsiz giriş hakkınızı kullanabilirsiniz
              </Text>
            </View>
          </Animated.View>
        )}

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
                            source={images.ratingLogo}
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
    color: colors.text,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  exploreButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5252',
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  card: {
    margin: 20,
    padding: 25,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 15,
    color: colors.textLight,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  packageCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  paymentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paymentBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  packageProgress: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  loyaltyCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 182, 193, 0.5)',
  },
  loyaltyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 5,
  },
  loyaltySubtitle: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  stampsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  stamp: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stampFilled: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  stampText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  progressBarContainer: {
    marginBottom: 15,
  },
  freeEntriesBox: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  freeEntriesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  packageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(93, 64, 55, 0.1)',
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  packageDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  historyCard: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  historyIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  historyContent: {
    flex: 1,
  },
  historyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 10,
  },
  emptyStateLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    height: 30,
  },
  reservationCard: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reservationWorkshop: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  reservationStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  reservationStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  reservationDetails: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 15,
  },
  reservationDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  reservationTime: {
    fontSize: 14,
    color: colors.textLight,
  },
  reservationNote: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  reservationNoteText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  birthdayCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  birthdayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  birthdayIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  birthdayInfo: {
    flex: 1,
  },
  birthdayName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  birthdayDate: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 3,
  },
  birthdayGuests: {
    fontSize: 14,
    color: colors.textLight,
  },
  birthdayFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(93, 64, 55, 0.1)',
  },
  birthdayPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  birthdayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  birthdayBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logoImageInactive: {
    opacity: 0.3,
  },
  logoEmoji: {
    fontSize: 32,
  },
  logoEmojiInactive: {
    opacity: 0.3,
  },
  starIcon: {
    fontSize: 44,
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
  // Havai Fişek Kutlama Stilleri
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  celebrationContent: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  fireworks: {
    fontSize: 60,
    marginBottom: 20,
  },
  celebrationTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFB74D',
    marginBottom: 20,
    textAlign: 'center',
  },
  celebrationMessage: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 26,
  },
  celebrationSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Kod Stilleri
  codeBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
  },
  codeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  codeValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 8,
  },
  codeHint: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  useCodeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  useCodeGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  useCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
