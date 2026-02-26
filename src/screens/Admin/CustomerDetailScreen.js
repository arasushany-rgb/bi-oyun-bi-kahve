import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../../config/colors';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function CustomerDetailScreen({ route, navigation }) {
  const { customer } = route.params;
  const { 
    updatePaymentStatus, 
    addStamp, 
    removeStamp,
    markAttendance,
    getAllCustomers,
    redeemFreeEntryWithCode,
  } = useAuth();

  const [currentCustomer, setCurrentCustomer] = useState(customer);
  const [redemptionCode, setRedemptionCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Ekran her açıldığında müşteri verilerini Firebase'den çek
  useFocusEffect(
    React.useCallback(() => {
      loadCustomerData();
    }, [customer.id])
  );

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const customerDoc = await getDoc(doc(db, 'users', customer.id));
      if (customerDoc.exists()) {
        setCurrentCustomer({
          id: customerDoc.id,
          ...customerDoc.data(),
        });
      }
    } catch (error) {
      console.error('Load customer error:', error);
    }
    setLoading(false);
  };

  const refreshCustomer = async () => {
    await loadCustomerData();
  };

  const handleTogglePayment = () => {
    const newStatus = !currentCustomer.packages[0]?.isPaid;
    updatePaymentStatus(currentCustomer.id, newStatus);
    refreshCustomer();
  };

  const handleAddStamp = async () => {
    // Kod kontrolü - Eğer ücretsiz hak varsa ve kod kullanılmamışsa damga eklenemez
    if (currentCustomer.loyaltyCard.freeEntries > 0 && currentCustomer.loyaltyCard.redemptionCode) {
      Alert.alert(
        'Uyarı ⚠️',
        'Bu müşterinin kullanılmamış ücretsiz giriş kodu var. Önce kodu kullanın, sonra yeni damga ekleyebilirsiniz.',
        [{ text: 'Tamam' }]
      );
      return;
    }

    Alert.alert(
      'Damga Ekle',
      'Yeni damga eklemek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Ekle',
          onPress: async () => {
            const result = await addStamp(currentCustomer.email);
            if (result.success) {
              refreshCustomer();
              if (result.stamps === 0 && result.freeEntries > currentCustomer.loyaltyCard.freeEntries) {
                Alert.alert('Tebrikler! 🎉', 'Kart tamamlandı! Ücretsiz giriş hakkı kazandı!');
              } else {
                Alert.alert('Başarılı', 'Damga eklendi!');
              }
            }
          },
        },
      ]
    );
  };

  const handleRemoveStamp = async () => {
    Alert.alert(
      'Damga Kaldır',
      'Son damgayı kaldırmak istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kaldır',
          style: 'destructive',
          onPress: async () => {
            const result = await removeStamp(currentCustomer.email);
            if (result.success) {
              refreshCustomer();
              Alert.alert('Başarılı', 'Damga kaldırıldı!');
            }
          },
        },
      ]
    );
  };

  const handleRedeemCode = async () => {
    if (!redemptionCode || redemptionCode.length !== 6) {
      Alert.alert('Hata', 'Lütfen 6 haneli kodu girin');
      return;
    }

    const result = await redeemFreeEntryWithCode(currentCustomer.email, redemptionCode);
    if (result.success) {
      refreshCustomer();
      setRedemptionCode('');
      Alert.alert('Başarılı! 🎉', 'Ücretsiz giriş hakkı kullanıldı ve kod silindi');
    } else {
      Alert.alert('Hata', result.error || 'Kod kullanılamadı');
    }
  };

  const handleMarkAttendance = async (reservation) => {
    Alert.alert(
      'Katılımı Onayla',
      `${reservation.workshopName} katılımı onaylanacak. Hak otomatik azalacak!`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Onayla',
          onPress: async () => {
            const result = await markAttendance(currentCustomer.email, reservation.id);
            if (result.success) {
              refreshCustomer();
              Alert.alert('Başarılı', 'Katılım kaydedildi! Hak azaldı.');
            } else {
              Alert.alert('Hata', result.error || 'İşlem başarısız');
            }
          },
        },
      ]
    );
  };

  const pkg = currentCustomer.packages[0];

  return (
    <LinearGradient
      colors={['#F5F0E8', '#F5F0E8']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Müşteri Detay</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Müşteri Bilgileri */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>Müşteri Bilgileri</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Çocuk Adı:</Text>
              <Text style={styles.infoValue}>{currentCustomer.childName || 'Belirtilmemiş'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Veli Adı:</Text>
              <Text style={styles.infoValue}>{currentCustomer.name}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Telefon:</Text>
              <Text style={styles.infoValue}>{currentCustomer.phone}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mail:</Text>
              <Text style={styles.infoValue}>{currentCustomer.email}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kayıt Tarihi:</Text>
              <Text style={styles.infoValue}>
                {currentCustomer.registrationDate || pkg?.purchaseDate || '10.08.2025'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Paket Bilgisi (Kalan):</Text>
              <Text style={styles.infoValueHighlight}>{pkg?.remaining || 0} hak</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Paket Miktarı:</Text>
              <Text style={styles.infoValue}>{pkg?.type || 'Paket Yok'} ({pkg?.total || 0} katılım)</Text>
            </View>
          </LinearGradient>

          {/* Paket Bilgileri */}
          {pkg && (
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>📦 Paket Bilgileri</Text>
                <View style={styles.paymentToggle}>
                  <Text style={styles.paymentLabel}>
                    {pkg.isPaid ? 'Ödendi ✓' : 'Ödenmedi'}
                  </Text>
                  <Switch
                    value={pkg.isPaid}
                    onValueChange={handleTogglePayment}
                    trackColor={{ false: '#FF9800', true: '#4CAF50' }}
                  />
                </View>
              </View>

              <View style={styles.packageGrid}>
                <View style={styles.packageItem}>
                  <Text style={styles.packageLabel}>Paket Türü</Text>
                  <Text style={styles.packageValue}>{pkg.type}</Text>
                </View>
                <View style={styles.packageItem}>
                  <Text style={styles.packageLabel}>Toplam Hak</Text>
                  <Text style={styles.packageValue}>{pkg.total}</Text>
                </View>
                <View style={styles.packageItem}>
                  <Text style={styles.packageLabel}>Kullanılan</Text>
                  <Text style={styles.packageValue}>{pkg.used}</Text>
                </View>
                <View style={styles.packageItem}>
                  <Text style={styles.packageLabel}>Kalan</Text>
                  <Text style={[styles.packageValue, styles.remaining]}>
                    {pkg.total - pkg.used}
                  </Text>
                </View>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Fiyat:</Text>
                <Text style={styles.priceValue}>{pkg.price}</Text>
              </View>

              {/* Rezervasyonlar - Paket Bilgisi İçinde */}
              <View style={styles.reservationsInPackage}>
                <Text style={styles.reservationsTitle}>📋 Rezervasyonlar</Text>
                
                {currentCustomer.reservations && currentCustomer.reservations.filter(r => r.status === 'pending').length > 0 ? (
                  currentCustomer.reservations
                    .filter(r => r.status === 'pending')
                    .map((reservation) => (
                      <View key={reservation.id} style={styles.reservationItemCompact}>
                        <View style={styles.reservationInfoCompact}>
                          <Text style={styles.reservationWorkshopCompact}>
                            🎨 {reservation.workshopName}
                          </Text>
                          <Text style={styles.reservationDateCompact}>
                            📆 {reservation.date} • {reservation.time}
                          </Text>
                        </View>
                        
                        <View style={styles.reservationActionsCompact}>
                          <TouchableOpacity
                            style={styles.checkboxButtonCompact}
                            onPress={() => handleMarkAttendance(reservation)}
                          >
                            <View style={styles.checkboxCompact}>
                              <Text style={styles.checkboxLabelCompact}>✓ Katıldı</Text>
                            </View>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={styles.checkboxButtonCompact}
                            onPress={() => {
                              Alert.alert('Bilgi', 'Katılmadı işaretlendi');
                            }}
                          >
                            <View style={[styles.checkboxCompact, styles.checkboxNotAttended]}>
                              <Text style={[styles.checkboxLabelCompact, styles.checkboxNotAttendedText]}>✗ Katılmadı</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                ) : (
                  <Text style={styles.noReservationText}>Henüz rezervasyon yapılmamış</Text>
                )}
              </View>
            </LinearGradient>
          )}

          {/* Oyun Alanı Sadakat Kartı */}
          {currentCustomer.loyaltyCard && (
            <LinearGradient
              colors={['rgba(255, 193, 7, 0.2)', 'rgba(255, 193, 7, 0.1)']}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>🎁 Oyun Alanı Sadakat Kartı</Text>
              
              <View style={styles.stampsContainer}>
                {[...Array(currentCustomer.loyaltyCard.maxStamps)].map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.stampBox,
                      index < currentCustomer.loyaltyCard.stamps && styles.stampBoxFilled,
                    ]}
                  >
                    <Text style={styles.stampText}>
                      {index < currentCustomer.loyaltyCard.stamps ? '✓' : index + 1}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={styles.stampCount}>
                {currentCustomer.loyaltyCard.stamps}/{currentCustomer.loyaltyCard.maxStamps} damga
              </Text>

              {currentCustomer.loyaltyCard.freeEntries > 0 && (
                <View style={styles.freeEntriesContainer}>
                  <Text style={styles.freeEntries}>
                    🎉 {currentCustomer.loyaltyCard.freeEntries} Ücretsiz Giriş Hakkı
                  </Text>
                  
                  {/* Kod Gir Alanı */}
                  <View style={styles.codeInputContainer}>
                    <Text style={styles.codeInputLabel}>Müşterinin Kullanım Kodu:</Text>
                    <TextInput
                      style={styles.codeInput}
                      value={redemptionCode}
                      onChangeText={setRedemptionCode}
                      placeholder="6 haneli kod"
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                    <TouchableOpacity
                      style={styles.redeemButton}
                      onPress={handleRedeemCode}
                      disabled={!redemptionCode || redemptionCode.length !== 6}
                    >
                      <Text style={styles.redeemButtonText}>Kodu Kullan</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.stampButtons}>
                <TouchableOpacity
                  style={[styles.stampButton, styles.addButton]}
                  onPress={handleAddStamp}
                  disabled={currentCustomer.loyaltyCard.stamps >= currentCustomer.loyaltyCard.maxStamps}
                >
                  <Text style={styles.stampButtonText}>+ Damga Ekle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.stampButton, styles.removeButton]}
                  onPress={handleRemoveStamp}
                  disabled={currentCustomer.loyaltyCard.stamps === 0}
                >
                  <Text style={styles.stampButtonText}>- Damga Kaldır</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          )}

          {/* Katılım Geçmişi */}
          {currentCustomer.workshopHistory && currentCustomer.workshopHistory.length > 0 && (
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>📜 Katılım Geçmişi</Text>
              {currentCustomer.workshopHistory.map((workshop, index) => (
                <Text key={index} style={styles.historyItem}>
                  • {workshop.workshopName} ({workshop.date})
                </Text>
              ))}
            </LinearGradient>
          )}

          <View style={{ height: 30 }} />
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
  },
  backButton: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  infoValueHighlight: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  paymentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  packageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  packageItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  packageLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  packageValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  remaining: {
    color: colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  stampsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  stampBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFB74D',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stampBoxFilled: {
    backgroundColor: '#FFB74D',
    borderColor: '#FFA726',
  },
  stampText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  stampCount: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },
  freeEntries: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stampButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  stampButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#FF5252',
  },
  stampButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reservationItem: {
    backgroundColor: 'rgba(255, 249, 196, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  reservationInfo: {
    marginBottom: 12,
  },
  reservationWorkshop: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  reservationDate: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
  },
  reservationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  checkboxButton: {
    flex: 1,
  },
  checkbox: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  reservationStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  paid: {
    color: '#4CAF50',
  },
  unpaid: {
    color: '#FF5252',
  },
  attendanceButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  attendanceGradient: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  attendanceText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyItem: {
    fontSize: 14,
    color: colors.textLight,
    paddingVertical: 6,
    paddingLeft: 8,
  },
  // Rezervasyonlar - Paket İçinde (Compact)
  reservationsInPackage: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  reservationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  reservationItemCompact: {
    backgroundColor: 'rgba(255, 249, 196, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  reservationInfoCompact: {
    marginBottom: 8,
  },
  reservationWorkshopCompact: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 3,
  },
  reservationDateCompact: {
    fontSize: 12,
    color: colors.textLight,
  },
  reservationActionsCompact: {
    flexDirection: 'row',
    gap: 8,
  },
  checkboxButtonCompact: {
    flex: 1,
  },
  checkboxCompact: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkboxNotAttended: {
    borderColor: '#FF5252',
  },
  checkboxLabelCompact: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkboxNotAttendedText: {
    color: '#FF5252',
  },
  noReservationText: {
    fontSize: 13,
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  // Kod Gir Stilleri
  freeEntriesContainer: {
    marginTop: 12,
  },
  codeInputContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  codeInputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  codeInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  redeemButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  redeemButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
