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
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../../config/colors';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardScreen({ navigation }) {
  const { 
    getAllCustomers, 
    updatePaymentStatus, 
    logout,
    getAllReservations,
    markAttendance,
    updateRemainingRights,
    getAllReviews,
    addStamp,
    removeStamp,
    getAllWomensWorkshopReservations,
  } = useAuth();
  
  const [customers, setCustomers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newRemaining, setNewRemaining] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('customers'); // customers, reservations, reviews
  const [searchChildName, setSearchChildName] = useState(''); // Çocuk adı arama
  const [searchParentName, setSearchParentName] = useState(''); // Veli adı arama
  const [loading, setLoading] = useState(true);

  // Ekran her focus olduğunda verileri yükle
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const customersList = await getAllCustomers();
      setCustomers(customersList);
      
      if (getAllReservations) {
        const reservationsList = await getAllReservations();
        setReservations(reservationsList);
      }
      
      if (getAllReviews) {
        const reviewsList = await getAllReviews();
        setReviews(reviewsList);
      }
    } catch (error) {
      console.error('Load data error:', error);
    }
    setLoading(false);
  };

  // Müşterileri filtrele (Çocuk İsmi VEYA Veli İsmi)
  const filteredCustomers = customers.filter(customer => {
    const childMatch = searchChildName.trim() === '' || 
      (customer.childName && customer.childName.toLowerCase().includes(searchChildName.toLowerCase()));
    
    const parentMatch = searchParentName.trim() === '' || 
      customer.name.toLowerCase().includes(searchParentName.toLowerCase());
    
    // Eğer her iki alan da doluysa, HER İKİSİ DE eşleşmeli
    if (searchChildName.trim() !== '' && searchParentName.trim() !== '') {
      return childMatch && parentMatch;
    }
    
    // Eğer sadece biri doluysa, o eşleşmeli
    return childMatch && parentMatch;
  });

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

  const togglePayment = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer && customer.packages.length > 0) {
      const newStatus = !customer.packages[0].isPaid;
      updatePaymentStatus(customerId, newStatus);
      setCustomers([...getAllCustomers()]);
    }
  };

  // ✅ YENİ: Katılımı işaretle
  const handleMarkAttendance = async (reservation) => {
    Alert.alert(
      'Katılımı Onayla',
      `${reservation.customerName} - ${reservation.workshopName} katılımı onaylanacak. Hak azalacak!`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Onayla',
          onPress: async () => {
            const result = await markAttendance(reservation.customerEmail, reservation.id);
            if (result.success) {
              setReservations(getAllReservations());
              setCustomers(getAllCustomers());
              Alert.alert('Başarılı', 'Katılım kaydedildi!');
            } else {
              Alert.alert('Hata', 'Katılım kaydedilemedi');
            }
          },
        },
      ]
    );
  };

  // ✅ YENİ: Kalan hak düzenle
  const handleEditRemaining = (customer) => {
    if (customer.packages && customer.packages[0]) {
      setEditingCustomer(customer);
      setNewRemaining(customer.packages[0].remaining.toString());
      setModalVisible(true);
    }
  };

  const handleSaveRemaining = async () => {
    const num = parseInt(newRemaining);
    if (isNaN(num) || num < 0) {
      Alert.alert('Hata', 'Geçerli bir sayı girin');
      return;
    }

    const result = await updateRemainingRights(editingCustomer.id || editingCustomer.email, num);
    if (result.success) {
      setCustomers(getAllCustomers());
      setModalVisible(false);
      Alert.alert('Başarılı', 'Kalan hak güncellendi!');
    } else {
      Alert.alert('Hata', 'Güncellenemedi');
    }
  };

  // Sadakat kartı damga işaretleme
  const handleToggleStamp = (customerEmail, stampIndex) => {
    const customer = customers.find(c => c.email === customerEmail);
    if (!customer || !customer.loyaltyCard) return;

    // Eğer damga zaten işaretliyse kaldır, değilse ekle
    if (stampIndex < customer.loyaltyCard.stamps) {
      // Damgayı kaldır
      Alert.alert(
        'Damga Kaldır',
        `${stampIndex + 1}. damgayı kaldırmak istiyor musunuz?`,
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Kaldır',
            style: 'destructive',
            onPress: async () => {
              const result = await removeStamp(customerEmail);
              if (result.success) {
                setCustomers(getAllCustomers());
                Alert.alert('Başarılı', 'Damga kaldırıldı!');
              } else {
                Alert.alert('Hata', result.error || 'Damga kaldırılamadı');
              }
            },
          },
        ]
      );
    } else if (stampIndex === customer.loyaltyCard.stamps) {
      // Sıradaki damgayı ekle
      Alert.alert(
        'Damga Ekle',
        `${stampIndex + 1}. damgayı eklemek istiyor musunuz?`,
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Ekle',
            onPress: async () => {
              const result = await addStamp(customerEmail);
              if (result.success) {
                setCustomers(getAllCustomers());
                if (result.freeEntries > customer.loyaltyCard.freeEntries) {
                  Alert.alert('Tebrikler! 🎉', 'Kart tamamlandı! Ücretsiz giriş hakkı kazandı!');
                } else {
                  Alert.alert('Başarılı', 'Damga eklendi!');
                }
              } else {
                Alert.alert('Hata', result.error || 'Damga eklenemedi');
              }
            },
          },
        ]
      );
    } else {
      Alert.alert('Uyarı', 'Önce önceki damgaları sırayla işaretleyin');
    }
  };

  const totalCustomers = customers.length;
  const paidCount = customers.filter(c => c.packages[0]?.isPaid).length;
  const unpaidCount = totalCustomers - paidCount;
  const totalRevenue = customers.reduce((sum, c) => {
    return sum + (c.packages[0]?.isPaid ? c.packages[0].price : 0);
  }, 0);

  return (
    <LinearGradient
      colors={['#F5F0E8', '#F5F0E8']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Splash')}
          >
            <LinearGradient
              colors={['#FFD54F', '#FFF59D']}
              style={styles.homeButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.homeButtonText}>🏠 Giriş</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('Splash')}>
              <Text style={styles.goToLoginText}>Giriş</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutText}>Çıkış</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Düzenlemeler Butonu - Büyük Kart */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AdminSettings')}
            style={styles.settingsCardContainer}
          >
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              style={styles.settingsCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.settingsCardIcon}>⚙️</Text>
              <Text style={styles.settingsCardTitle}>Düzenlemeler</Text>
              <Text style={styles.settingsCardSubtitle}>Ayarları ve fiyatları yönet</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* İstatistikler */}
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['#A5D6A7', '#C8E6C9']}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.statValue}>{totalCustomers}</Text>
              <Text style={styles.statLabel}>Toplam Müşteri</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#4CAF50', '#81C784']}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.statValue}>{paidCount}</Text>
              <Text style={styles.statLabel}>Ödenen</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#FF9800', '#FFB74D']}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.statValue}>{unpaidCount}</Text>
              <Text style={styles.statLabel}>Bekleyen</Text>
            </LinearGradient>
          </View>

          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
            style={styles.revenueCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.revenueLabel}>Toplam Gelir</Text>
            <Text style={styles.revenueValue}>{totalRevenue.toLocaleString('tr-TR')} ₺</Text>
          </LinearGradient>

          {/* Tab Butonları */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'customers' && styles.tabButtonActive]}
              onPress={() => setActiveTab('customers')}
            >
              <Text style={[styles.tabText, activeTab === 'customers' && styles.tabTextActive]}>
                👥 Müşteriler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'workshop' && styles.tabButtonActive]}
              onPress={() => setActiveTab('workshop')}
            >
              <Text style={[styles.tabText, activeTab === 'workshop' && styles.tabTextActive]}>
                ✨ Workshop
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'birthday' && styles.tabButtonActive]}
              onPress={() => setActiveTab('birthday')}
            >
              <Text style={[styles.tabText, activeTab === 'birthday' && styles.tabTextActive]}>
                🎂 Doğum Günü
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'reviews' && styles.tabButtonActive]}
              onPress={() => setActiveTab('reviews')}
            >
              <Text style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>
                ⭐ Değerlendirmeler
              </Text>
            </TouchableOpacity>
          </View>

          {/* Arama Kutusu - Sadece Müşteriler Sekmesinde */}
          {activeTab === 'customers' && (
            <View style={styles.searchSection}>
              {/* Yenile Butonu */}
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={loadData}
                disabled={loading}
              >
                <Text style={styles.refreshButtonText}>
                  {loading ? '🔄 Yükleniyor...' : '🔄 Yenile'}
                </Text>
              </TouchableOpacity>

              <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>👶</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Çocuk adı ile ara..."
                  placeholderTextColor="#999"
                  value={searchChildName}
                  onChangeText={setSearchChildName}
                />
                {searchChildName.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchChildName('')}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>👤</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Veli adı ile ara..."
                  placeholderTextColor="#999"
                  value={searchParentName}
                  onChangeText={setSearchParentName}
                />
                {searchParentName.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchParentName('')}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Değerlendirmeler Tab */}
          {activeTab === 'reviews' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Müşteri Değerlendirmeleri ⭐</Text>
              
              {reviews.length === 0 ? (
                <Text style={styles.emptyText}>Henüz değerlendirme yok</Text>
              ) : (
                reviews
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((review) => (
                    <LinearGradient
                      key={review.id}
                      colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                      style={styles.reviewCard}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.reviewHeader}>
                        <View>
                          <Text style={styles.reviewUserName}>{review.userName}</Text>
                          <Text style={styles.reviewDate}>
                            {new Date(review.date).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Text>
                        </View>
                        <View style={styles.ratingContainer}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Text key={star} style={styles.starText}>
                              {star <= review.rating ? '⭐' : '☆'}
                            </Text>
                          ))}
                        </View>
                      </View>

                      {review.feedback && (
                        <View style={styles.reviewSection}>
                          <Text style={styles.reviewSectionTitle}>💬 Geri Bildirim:</Text>
                          <Text style={styles.reviewText}>{review.feedback}</Text>
                        </View>
                      )}

                      {review.suggestions && (
                        <View style={styles.reviewSection}>
                          <Text style={styles.reviewSectionTitle}>💡 Öneriler:</Text>
                          <Text style={styles.reviewText}>{review.suggestions}</Text>
                        </View>
                      )}
                    </LinearGradient>
                  ))
              )}
            </View>
          )}

          {/* Doğum Günü Tab */}
          {activeTab === 'birthday' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Doğum Günü Rezervasyonları 🎂</Text>
              
              {customers.filter(c => c.birthdayPackages && c.birthdayPackages.length > 0).length === 0 ? (
                <Text style={styles.emptyText}>Henüz doğum günü rezervasyonu yok</Text>
              ) : (
                customers
                  .filter(c => c.birthdayPackages && c.birthdayPackages.length > 0)
                  .map((customer) => (
                    customer.birthdayPackages.map((pkg) => (
                      <LinearGradient
                        key={`${customer.id}-${pkg.id}`}
                        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                        style={styles.birthdayCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <View style={styles.birthdayHeader}>
                          <View>
                            <Text style={styles.birthdayCustomerName}>{customer.name}</Text>
                            <Text style={styles.birthdayPhone}>{customer.phone}</Text>
                          </View>
                          <View style={[styles.paymentBadge, { backgroundColor: pkg.isPaid ? '#4CAF50' : '#FF5252' }]}>
                            <Text style={styles.paymentBadgeText}>
                              {pkg.isPaid ? '✅ Ödendi' : '❌ Ödenmedi'}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.birthdayDetails}>
                          <View style={styles.birthdayRow}>
                            <Text style={styles.birthdayLabel}>📦 Paket:</Text>
                            <Text style={styles.birthdayValue}>{pkg.packageName}</Text>
                          </View>
                          <View style={styles.birthdayRow}>
                            <Text style={styles.birthdayLabel}>Tarih:</Text>
                            <Text style={styles.birthdayValue}>{pkg.date}</Text>
                          </View>
                          <View style={styles.birthdayRow}>
                            <Text style={styles.birthdayLabel}>👥 Misafir:</Text>
                            <Text style={styles.birthdayValue}>{pkg.guests} kişi</Text>
                          </View>
                          <View style={styles.birthdayRow}>
                            <Text style={styles.birthdayLabel}>💰 Fiyat:</Text>
                            <Text style={styles.birthdayValue}>{pkg.price}</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    ))
                  ))
              )}
            </View>
          )}

          {/* Workshop Tab */}
          {activeTab === 'workshop' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Workshop Rezervasyonları ✨</Text>
              
              {(() => {
                const workshopReservations = getAllWomensWorkshopReservations();
                return workshopReservations.length === 0 ? (
                  <Text style={styles.emptyText}>Henüz workshop rezervasyonu yok</Text>
                ) : (
                  workshopReservations.map((reservation) => (
                    <LinearGradient
                      key={reservation.id}
                      colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                      style={styles.workshopCard}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.workshopHeader}>
                        <View>
                          <Text style={styles.workshopCustomerName}>{reservation.name}</Text>
                          <Text style={styles.workshopPhone}>{reservation.phone}</Text>
                        </View>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: reservation.status === 'confirmed' ? '#4CAF50' : '#FFA726' }
                        ]}>
                          <Text style={styles.statusBadgeText}>
                            {reservation.status === 'confirmed' ? '✅ Onaylandı' : '⏳ Bekliyor'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.workshopDetails}>
                        <View style={styles.workshopRow}>
                          <Text style={styles.workshopLabel}>✨ Workshop:</Text>
                          <Text style={styles.workshopValue}>{reservation.workshop}</Text>
                        </View>
                        <View style={styles.workshopRow}>
                          <Text style={styles.workshopLabel}>Tarih:</Text>
                          <Text style={styles.workshopValue}>{reservation.preferredDate}</Text>
                        </View>
                        {reservation.email && (
                          <View style={styles.workshopRow}>
                            <Text style={styles.workshopLabel}>📧 E-posta:</Text>
                            <Text style={styles.workshopValue}>{reservation.email}</Text>
                          </View>
                        )}
                        {reservation.notes && (
                          <View style={styles.workshopRow}>
                            <Text style={styles.workshopLabel}>📝 Not:</Text>
                            <Text style={styles.workshopValue}>{reservation.notes}</Text>
                          </View>
                        )}
                      </View>
                    </LinearGradient>
                  ))
                );
              })()}
            </View>
          )}

          {/* Müşteriler Tab */}
          {activeTab === 'customers' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Müşteriler {(searchChildName || searchParentName) && `(${filteredCustomers.length} sonuç)`}
              </Text>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4CAF50" />
                  <Text style={styles.loadingText}>Müşteriler yükleniyor...</Text>
                </View>
              ) : filteredCustomers.length === 0 ? (
                <Text style={styles.emptyText}>
                  {(searchChildName || searchParentName) ? 'Müşteri bulunamadı' : 'Henüz müşteri yok'}
                </Text>
              ) : (
                filteredCustomers.map((customer) => {
                  const pkg = customer.packages[0];
                  if (!pkg) return null;

                  // Bekleyen rezervasyon sayısı
                  const pendingCount = customer.reservations?.filter(r => r.status === 'pending').length || 0;

                  return (
                    <TouchableOpacity
                      key={customer.id}
                      onPress={() => navigation.navigate('CustomerDetail', { customer })}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                        style={styles.customerCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <View style={styles.customerHeader}>
                          <View style={styles.customerInfo}>
                            <Text style={styles.customerName}>{customer.name}</Text>
                            {customer.childName && (
                              <Text style={styles.customerChildName}>👶 {customer.childName}</Text>
                            )}
                            <Text style={styles.customerEmail}>{customer.email}</Text>
                            <Text style={styles.customerPhone}>{customer.phone}</Text>
                          </View>
                        </View>

                        <View style={styles.packageSection}>
                          <View style={styles.packageInfo}>
                            <Text style={styles.packageLabel}>Paket</Text>
                            <Text style={styles.packageType}>{pkg.type}</Text>
                          </View>
                          
                          <View style={styles.packageInfo}>
                            <Text style={styles.packageLabel}>Kalan Hak</Text>
                            <Text style={[
                              styles.packageRemaining,
                              (pkg.total - pkg.used) === 0 && { color: '#FF5252' }
                            ]}>
                              {pkg.total - pkg.used}/{pkg.total}
                            </Text>
                          </View>

                          <View style={styles.packageInfo}>
                            <Text style={styles.packageLabel}>Fiyat</Text>
                            <Text style={styles.packagePrice}>{pkg.price}</Text>
                          </View>
                        </View>

                        {/* Paket Bitti Uyarısı */}
                        {(pkg.total - pkg.used) === 0 && (
                          <View style={styles.packageExpired}>
                            <Text style={styles.packageExpiredText}>⚠️ PAKET BİTTİ</Text>
                          </View>
                        )}

                        {/* Detaylı Bilgiler */}
                        <View style={styles.detailsSection}>
                          {/* Sadakat Kartı */}
                          {customer.loyaltyCard && (
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>🎁 Sadakat:</Text>
                              <Text style={styles.detailValue}>
                                {customer.loyaltyCard.stamps}/{customer.loyaltyCard.maxStamps} damga
                                {customer.loyaltyCard.freeEntries > 0 && ` | ${customer.loyaltyCard.freeEntries} ücretsiz`}
                              </Text>
                            </View>
                          )}
                          
                          {/* Toplam Katılım */}
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>🎨 Atölye Katılımı:</Text>
                            <Text style={styles.detailValue}>
                              {pkg.used}/{pkg.total} kez katıldı
                            </Text>
                          </View>
                          
                          {/* Ödeme Durumu */}
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>💳 Ödeme:</Text>
                            <Text style={[
                              styles.detailValue,
                              { color: pkg.isPaid ? '#4CAF50' : '#FF5252', fontWeight: 'bold' }
                            ]}>
                              {pkg.isPaid ? 'Ödendi ✓' : 'Ödenmedi ✗'}
                            </Text>
                          </View>
                          
                          {/* Bekleyen Rezervasyonlar */}
                          {pendingCount > 0 && (
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Rezervasyon:</Text>
                              <Text style={styles.detailValue}>
                                {pendingCount} bekleyen
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.tapHint}>
                          <Text style={styles.tapHintText}>Detaylar için tıklayın →</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          )}

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
  homeButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goToLoginText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CAF50',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5252',
  },
  settingsCardContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  settingsCard: {
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  settingsCardIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  settingsCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 6,
  },
  settingsCardSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  revenueCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  revenueLabel: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 8,
  },
  revenueValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  customerCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(93, 64, 55, 0.1)',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  customerChildName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    color: colors.textLight,
  },
  paymentSection: {
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  packageSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  packageInfo: {
    alignItems: 'center',
  },
  packageLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  packageType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  packageUsage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  packageRemaining: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  paymentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paidText: {
    color: '#4CAF50',
  },
  unpaidText: {
    color: '#FF5252',
  },
  detailsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  detailValue: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  tapHint: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  tapHintText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  packageExpired: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  packageExpiredText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  historySection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(93, 64, 55, 0.1)',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  historyItem: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
  },
  historyMore: {
    fontSize: 13,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  footer: {
    height: 30,
  },
  // ✅ YENİ: Rezervasyon Stilleri
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
    marginBottom: 10,
  },
  reservationName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  reservationStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  reservationWorkshop: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  reservationDate: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  reservationPhone: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  attendanceButton: {
    marginTop: 8,
  },
  attendanceButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  attendanceButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  // ✅ YENİ: Düzenle Butonu
  editButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFB74D',
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Tab Stilleri
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  // Arama Kutusu Stilleri
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 4,
  },
  clearIcon: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  // Değerlendirme Card Stilleri
  reviewCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  starText: {
    fontSize: 20,
  },
  reviewSection: {
    marginTop: 10,
  },
  reviewSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  // Sadakat Kartı Stilleri
  loyaltySection: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  loyaltyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  stampsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  stampBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  stampCount: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: '600',
  },
  // ✅ YENİ: Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#E0E0E0',
  },
  modalButtonSave: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalButtonTextSave: {
    color: '#FFFFFF',
  },
  // Doğum Günü Kartları
  birthdayCard: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  birthdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  birthdayCustomerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  birthdayPhone: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  paymentBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  birthdayDetails: {
    gap: 8,
  },
  birthdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  birthdayLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  birthdayValue: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  // Oyun Alanı Kartları
  playareaCard: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  playareaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playareaCustomerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  playareaPhone: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  playareaDetails: {
    gap: 8,
  },
  playareaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playareaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  playareaValue: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  // Workshop Kartları
  workshopCard: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  workshopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workshopCustomerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  workshopPhone: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  workshopDetails: {
    gap: 8,
  },
  workshopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  workshopLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginRight: 10,
  },
  workshopValue: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
