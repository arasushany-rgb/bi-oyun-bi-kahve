import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import config from '../config/config';
import { globalStyles } from '../config/theme';
import { useAuth } from '../context/AuthContext';
import { useImages } from '../context/ImageContext';

export default function WorkshopsScreen({ navigation }) {
  const { images } = useImages();
  const { user, createReservation, refreshUserData } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');

  const handleReservation = () => {
    if (!selectedPackage) {
      Alert.alert('Uyarı', 'Lütfen bir paket seçin');
      return;
    }

    if (user) {
      Alert.alert(
        'Paket Satın Alma',
        'Paket satın almak için Hesabım kısmına gidin.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Hesabıma Git', onPress: () => navigation.navigate('Profile') },
        ]
      );
      return;
    }

    navigation.navigate('ReservationForm', {
      package: selectedPackage,
      type: 'workshop'
    });
  };

  const openReservationModal = (workshop) => {
    if (user) {
      Alert.alert(
        'Katılım Rezervasyonu',
        'Atölye rezervasyonu için Hesabım kısmına gidin.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Hesabıma Git', onPress: () => navigation.navigate('Profile') },
        ]
      );
      return;
    }

    navigation.navigate('ReservationForm', {
      package: {
        id: 'workshop-single',
        name: workshop.name,
        price: '0₺',
        count: 1
      },
      type: 'workshop'
    });
  };

  const submitReservation = async () => {
    if (!reservationDate || !reservationTime) {
      Alert.alert('Eksik Bilgi', 'Lütfen tarih ve saat seçin');
      return;
    }

    const result = await createReservation(selectedWorkshop.name, reservationDate, reservationTime);
    
    if (result.success) {
      setModalVisible(false);
      Alert.alert(
        'Rezervasyon Başarılı! 🎉',
        `${selectedWorkshop.name} atölyesine ${reservationDate} tarihinde ${reservationTime} saatinde rezervasyon yaptırdınız.\n\n⚠️ İşletmemize gelip atölyeye katılım sağladığınız zaman kalan hakkınız azalacaktır.`,
        [{ text: 'Tamam', onPress: () => refreshUserData() }]
      );
    } else {
      Alert.alert('Hata', result.error || 'Rezervasyon oluşturulamadı');
    }
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
          <Text style={styles.title}>Atölyeler</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Kapak Görseli */}
        <View style={styles.coverImageContainer}>
          <Image 
            source={images.workshopImage} 
            style={{width: '100%', height: 200, borderRadius: 28}} 
          />
        </View>

        {/* Banner */}
        <LinearGradient
          colors={colors.gradients.workshop}
          style={styles.banner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.bannerIcon}>🎨</Text>
          <Text style={styles.bannerTitle}>Eğlenceli Atölyeler</Text>
          <Text style={styles.bannerText}>
            {config.workshops.description}
          </Text>
        </LinearGradient>

        {/* Atölye Çeşitleri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atölye Çeşitlerimiz</Text>
          
          {config.workshops.types.map((type, index) => (
            <LinearGradient
              key={index}
              colors={colors.gradients.workshopSubtle}
              style={styles.workshopCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.workshopHeader}>
                <Text style={styles.workshopIcon}>{type.icon}</Text>
                <View style={styles.workshopTitleContainer}>
                  <Text style={styles.workshopName}>{type.name}</Text>
                  <Text style={styles.workshopDescription}>{type.description}</Text>
                </View>
              </View>
              
              <View style={styles.workshopDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>👶</Text>
                  <Text style={styles.detailText}>{type.ageRange}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>⏱️</Text>
                  <Text style={styles.detailText}>{type.duration}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>👥</Text>
                  <Text style={styles.detailText}>
                    Kontenjan: {type.currentParticipants}/{type.maxCapacity} kişi
                  </Text>
                </View>
                <View style={styles.bonusRow}>
                  <Text style={styles.bonusIcon}>🎁</Text>
                  <Text style={styles.bonusText}>{type.bonus}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.reserveButton}
                onPress={() => openReservationModal(type)}
                disabled={type.currentParticipants >= type.maxCapacity}
              >
                <LinearGradient
                  colors={type.currentParticipants >= type.maxCapacity ? ['#CCCCCC', '#999999'] : ['#4CAF50', '#66BB6A']}
                  style={styles.reserveButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.reserveButtonText}>
                    {type.currentParticipants >= type.maxCapacity ? '❌ Kontenjan Dolu' : '📆 Rezervasyon Yap'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          ))}

          {/* Instagram Notu */}
          <LinearGradient
            colors={['#F5F0E8', '#F5F0E8']}
            style={styles.instagramNote}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.instagramText}>
              {config.workshops.note}
            </Text>
          </LinearGradient>
        </View>

        {/* Paketler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atölye Paketleri</Text>
          <Text style={styles.sectionSubtitle}>
            Size uygun paketi seçin ve rezervasyon yapın
          </Text>
          
          {config.workshops.packages.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              onPress={() => setSelectedPackage(pkg)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={selectedPackage?.id === pkg.id ? colors.gradients.workshop : colors.gradients.workshopSubtle}
                style={[
                  styles.packageCard,
                  selectedPackage?.id === pkg.id && styles.packageCardSelected,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.packageHeader}>
                  <View style={styles.packageTitleContainer}>
                    <Text style={[
                      styles.packageName,
                      selectedPackage?.id === pkg.id && styles.packageNameSelected,
                    ]}>
                      {pkg.name}
                    </Text>
                    {pkg.id === 'trial' && (
                      <View style={styles.trialBadge}>
                        <Text style={styles.trialBadgeText}>Deneme</Text>
                      </View>
                    )}
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedPackage?.id === pkg.id && styles.radioButtonSelected,
                  ]}>
                    {selectedPackage?.id === pkg.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </View>

                <Text style={styles.packageDescription}>{pkg.description}</Text>

                <View style={styles.packageFooter}>
                  <View style={styles.packageCount}>
                    <Text style={styles.packageCountNumber}>{pkg.count}</Text>
                    <Text style={styles.packageCountLabel}>Atölye</Text>
                  </View>
                  
                  <View style={styles.packagePriceContainer}>
                    <Text style={styles.packagePrice}>{pkg.price}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bilgilendirme */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📆</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Rezervasyon</Text>
              <Text style={styles.infoText}>
                Paket seçtikten sonra rezervasyon formunu doldurun. Size en kısa sürede dönüş yapacağız.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Önemli Bilgiler</Text>
              <Text style={styles.infoText}>
                • Atölyeler yaş gruplarına göre düzenlenir{'\n'}
                • Uzman eğitmenler eşliğinde{'\n'}
                • Tüm malzemeler tarafımızdan sağlanır{'\n'}
                • İptal durumunda ön bildirim gereklidir
              </Text>
            </View>
          </View>
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
      </ScrollView>

      {/* Rezervasyon Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rezervasyon Yap</Text>
            <Text style={styles.modalSubtitle}>{selectedWorkshop?.name}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>📆 Tarih (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={reservationDate}
                onChangeText={setReservationDate}
                placeholder="Örn: 2026-02-15"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>🕐 Saat (HH:MM)</Text>
              <TextInput
                style={styles.input}
                value={reservationTime}
                onChangeText={setReservationTime}
                placeholder="Örn: 14:00"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={submitReservation}
              >
                <LinearGradient
                  colors={['#4CAF50', '#66BB6A']}
                  style={styles.modalButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextSave]}>Kaydet</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
  title: {
    fontSize: 20,
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
  banner: {
    margin: 20,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  bannerIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 15,
  },
  workshopCard: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  workshopHeader: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  workshopIcon: {
    fontSize: 44,
    marginRight: 14,
  },
  workshopTitleContainer: {
    flex: 1,
  },
  workshopName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  workshopDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  workshopDetails: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.textLight,
  },
  bonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: colors.backgroundLight,
    padding: 10,
    borderRadius: 12,
  },
  bonusIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  bonusText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  packageCard: {
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  packageCardSelected: {
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  packageTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 10,
  },
  packageNameSelected: {
    color: colors.workshop,
  },
  trialBadge: {
    backgroundColor: colors.info,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  trialBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  packageDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 15,
  },
  packageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  packageCount: {
    alignItems: 'center',
  },
  packageCountNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.workshop,
  },
  packageCountLabel: {
    fontSize: 12,
    color: colors.textGray,
  },
  packagePriceContainer: {
    alignItems: 'flex-end',
  },
  packagePrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  radioButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  radioButtonSelected: {
    borderColor: '#000',
  },
  radioButtonInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
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
  instagramNote: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  instagramText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  reserveButton: {
    marginTop: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  reserveButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  reserveButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#FAFAFA',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonCancel: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonSave: {
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalButtonTextSave: {
    color: '#fff',
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
});
