import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Switch,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../config/colors';
import { config } from '../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { pickAndUploadImage } from '../../utils/imageUpload';
import { getAppImages, updateAppImage, getImageDisplayName } from '../../utils/appImages';

export default function AdminSettingsScreen({ navigation }) {
  const { 
    getWeeklySchedule, 
    addWorkshopToSchedule, 
    removeWorkshopFromSchedule,
    getWomensWorkshops,
    updateWomensWorkshop,
    addWomensWorkshop,
    removeWomensWorkshop,
    workshopDates,
    setWorkshopDates,
  } = useAuth();
  const [activeTab, setActiveTab] = useState('business');
  const [hasChanges, setHasChanges] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [womensWorkshops, setWomensWorkshops] = useState([]);
  
  // Seans ekleme modal state
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [newSessionWorkshop, setNewSessionWorkshop] = useState('');
  const [newSessionTime, setNewSessionTime] = useState('');
  const [newSessionCapacity, setNewSessionCapacity] = useState('6');

  // Workshop ekleme modal state
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
  const [newWorkshopName, setNewWorkshopName] = useState('');
  const [newWorkshopDescription, setNewWorkshopDescription] = useState('');
  const [newWorkshopIcon, setNewWorkshopIcon] = useState('');
  const [newWorkshopPrice, setNewWorkshopPrice] = useState('');

  // Workshop tarihleri modal state
  const [showDateModal, setShowDateModal] = useState(false);
  const [newDate, setNewDate] = useState('');

  // Haftalık programı yükle
  useEffect(() => {
    setWeeklySchedule(getWeeklySchedule());
    setWomensWorkshops(getWomensWorkshops());
  }, []);

  // Business Info State
  const [businessInfo, setBusinessInfo] = useState({
    name: config.business.name,
    address: config.business.address,
    phone: config.business.phone,
    whatsapp: config.business.whatsapp,
    email: config.business.email,
    instagram: config.business.instagram,
    weekdaysOpen: config.business.workingHours.weekdays.split(' - ')[0],
    weekdaysClose: config.business.workingHours.weekdays.split(' - ')[1],
    weekendOpen: config.business.workingHours.weekend.split(' - ')[0],
    weekendClose: config.business.workingHours.weekend.split(' - ')[1],
  });

  // App Info State
  const [appInfo, setAppInfo] = useState({
    appName: config.app.name,
    slogan: config.app.slogan,
    description: config.app.description,
  });

  // Cafe State
  const [cafeInfo, setCafeInfo] = useState({
    description: config.cafe.description,
  });

  // Cafe Menu State
  const [cafeMenu, setCafeMenu] = useState(
    config.cafe.menu.map(item => ({ ...item }))
  );

  // Workshop Packages State
  const [workshopPackages, setWorkshopPackages] = useState(
    config.workshops.packages.map(pkg => ({ ...pkg }))
  );

  // Workshop Capacity State
  const [workshopCapacity, setWorkshopCapacity] = useState(
    config.workshops.types.map(type => ({
      name: type.name,
      maxCapacity: type.maxCapacity,
      currentParticipants: type.currentParticipants,
    }))
  );

  // Birthday Packages State
  const [birthdayBasic, setBirthdayBasic] = useState({
    weekday: config.birthday.concept1.prices.weekday,
    weekend: config.birthday.concept1.prices.weekend,
  });

  const [birthdayPremium, setBirthdayPremium] = useState({
    price: config.birthday.concept2.price,
  });

  // Play Area State
  const [playArea, setPlayArea] = useState({
    hourlyRate: config.playArea.hourlyRate.toString(),
    package1Price: config.playArea.packages[0].price,
    package2Price: config.playArea.packages[1].price,
    package3Price: config.playArea.packages[2].price,
  });

  // Loyalty Card State
  const [loyaltyCard, setLoyaltyCard] = useState({
    maxStamps: config.loyaltyCard.maxStamps.toString(),
    reward: config.loyaltyCard.reward,
    description: config.loyaltyCard.description,
  });

  // Photo Settings State
  const [appImages, setAppImages] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(null);

  // Fotoğrafları yükle
  useEffect(() => {
    loadAppImages();
  }, []);

  const loadAppImages = async () => {
    const result = await getAppImages();
    if (result.success && result.images) {
      setAppImages(result.images);
    }
  };

  const handleUploadImage = async (imageKey) => {
    setUploadingImage(imageKey);
    
    const folderMap = {
      cafeImage: 'cafe',
      playAreaImage: 'playarea',
      workshopImage: 'workshops',
      birthdayImage: 'birthday',
      splashLogo: 'logos',
      mainLogo: 'logos',
      ratingLogo: 'logos',
    };

    const folder = folderMap[imageKey] || 'general';
    const filename = `${imageKey}_${Date.now()}.jpg`;

    const result = await pickAndUploadImage(folder, filename);
    
    if (result.success) {
      const updateResult = await updateAppImage(imageKey, result.url);
      if (updateResult.success) {
        await loadAppImages();
        Alert.alert('Başarılı', 'Fotoğraf güncellendi!');
      } else {
        Alert.alert('Hata', 'Fotoğraf kaydedilemedi');
      }
    } else if (result.error !== 'İptal edildi') {
      Alert.alert('Hata', result.error || 'Fotoğraf yüklenemedi');
    }
    
    setUploadingImage(null);
  };

  const handleSave = async () => {
    Alert.alert(
      'Değişiklikleri Kaydet',
      'Tüm değişiklikler kaydedilecek. Onaylıyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kaydet',
          onPress: async () => {
            try {
              // Yeni config objesi oluştur
              const newConfig = {
                ...config,
                app: {
                  ...config.app,
                  name: appInfo.appName,
                  slogan: appInfo.slogan,
                  description: appInfo.description,
                },
                business: {
                  ...config.business,
                  name: businessInfo.name,
                  address: businessInfo.address,
                  phone: businessInfo.phone,
                  whatsapp: businessInfo.whatsapp,
                  email: businessInfo.email,
                  instagram: businessInfo.instagram,
                  workingHours: {
                    weekdays: `${businessInfo.weekdaysOpen} - ${businessInfo.weekdaysClose}`,
                    weekend: `${businessInfo.weekendOpen} - ${businessInfo.weekendClose}`,
                  },
                },
                cafe: {
                  description: cafeInfo.description,
                  menu: cafeMenu,
                },
                workshops: {
                  ...config.workshops,
                  packages: workshopPackages,
                  types: config.workshops.types.map((type, index) => ({
                    ...type,
                    maxCapacity: workshopCapacity[index].maxCapacity,
                    currentParticipants: workshopCapacity[index].currentParticipants,
                  })),
                },
                birthday: {
                  ...config.birthday,
                  concept1: {
                    ...config.birthday.concept1,
                    prices: birthdayBasic,
                  },
                  concept2: {
                    ...config.birthday.concept2,
                    price: birthdayPremium.price,
                  },
                },
                playArea: {
                  ...config.playArea,
                  hourlyRate: parseInt(playArea.hourlyRate),
                  packages: [
                    { ...config.playArea.packages[0], price: playArea.package1Price },
                    { ...config.playArea.packages[1], price: playArea.package2Price },
                    { ...config.playArea.packages[2], price: playArea.package3Price },
                  ],
                },
                loyaltyCard: {
                  maxStamps: parseInt(loyaltyCard.maxStamps),
                  reward: loyaltyCard.reward,
                  description: loyaltyCard.description,
                },
              };

              // AsyncStorage'a kaydet
              await AsyncStorage.setItem('app_config', JSON.stringify(newConfig));
              
              Alert.alert(
                'Başarılı! ✅',
                'Değişiklikler kaydedildi. Uygulamayı yeniden başlatın.',
                [
                  {
                    text: 'Tamam',
                    onPress: () => {
                      setHasChanges(false);
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Hata', 'Değişiklikler kaydedilemedi: ' + error.message);
            }
          },
        },
      ]
    );
  };

  const renderPhotoSettings = () => {
    const imageKeys = [
      'cafeImage',
      'playAreaImage',
      'workshopImage',
      'birthdayImage',
      'splashLogo',
      'mainLogo',
      'ratingLogo',
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📷 Fotoğraf Yönetimi</Text>
        <Text style={styles.sectionDescription}>
          Uygulama içinde gösterilen fotoğrafları buradan değiştirebilirsiniz.
        </Text>

        {imageKeys.map((imageKey) => (
          <View key={imageKey} style={styles.photoItem}>
            <View style={styles.photoInfo}>
              <Text style={styles.photoLabel}>{getImageDisplayName(imageKey)}</Text>
              {appImages && appImages[imageKey] && (
                <Text style={styles.photoStatus}>✓ Yüklendi</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                uploadingImage === imageKey && styles.uploadButtonDisabled,
              ]}
              onPress={() => handleUploadImage(imageKey)}
              disabled={uploadingImage === imageKey}
            >
              {uploadingImage === imageKey ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.uploadButtonText}>
                  {appImages && appImages[imageKey] ? 'Değiştir' : 'Yükle'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.photoNote}>
          <Text style={styles.photoNoteIcon}>💡</Text>
          <Text style={styles.photoNoteText}>
            Fotoğraf seçtikten sonra otomatik olarak yüklenecek ve tüm cihazlarda güncellenecektir.
          </Text>
        </View>
      </View>
    );
  };

  const renderBusinessInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>İşletme Bilgileri</Text>
      
      <Text style={styles.label}>İşletme Adı</Text>
      <TextInput
        style={styles.input}
        value={businessInfo.name}
        onChangeText={(text) => {
          setBusinessInfo({ ...businessInfo, name: text });
          setHasChanges(true);
        }}
        placeholder="İşletme adını girin"
      />

      <Text style={styles.label}>Adres</Text>
      <TextInput
        style={styles.input}
        value={businessInfo.address}
        onChangeText={(text) => {
          setBusinessInfo({ ...businessInfo, address: text });
          setHasChanges(true);
        }}
        placeholder="Adres"
      />

      <Text style={styles.label}>Telefon</Text>
      <TextInput
        style={styles.input}
        value={businessInfo.phone}
        onChangeText={(text) => {
          setBusinessInfo({ ...businessInfo, phone: text });
          setHasChanges(true);
        }}
        placeholder="Telefon"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>WhatsApp</Text>
      <TextInput
        style={styles.input}
        value={businessInfo.whatsapp}
        onChangeText={(text) => {
          setBusinessInfo({ ...businessInfo, whatsapp: text });
          setHasChanges(true);
        }}
        placeholder="WhatsApp"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={businessInfo.email}
        onChangeText={(text) => {
          setBusinessInfo({ ...businessInfo, email: text });
          setHasChanges(true);
        }}
        placeholder="Email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Instagram</Text>
      <TextInput
        style={styles.input}
        value={businessInfo.instagram}
        onChangeText={(text) => {
          setBusinessInfo({ ...businessInfo, instagram: text });
          setHasChanges(true);
        }}
        placeholder="Instagram"
      />

      <Text style={styles.sectionSubtitle}>Çalışma Saatleri</Text>

      <Text style={styles.label}>Hafta İçi - Açılış</Text>
      <TextInput
        style={styles.input}
        value={businessInfo.weekdaysOpen}
        onChangeText={(text) => {
          setBusinessInfo({ ...businessInfo, weekdaysOpen: text });
          setHasChanges(true);
        }}
        placeholder="09:00"
      />

      <Text style={styles.label}>Hafta İçi - Kapanış</Text>
      <TextInput
        style={styles.input}
        value={businessInfo.weekdaysClose}
        onChangeText={(text) => {
          setBusinessInfo({ ...businessInfo, weekdaysClose: text });
          setHasChanges(true);
        }}
        placeholder="21:00"
      />

      <Text style={styles.label}>Hafta Sonu - Açılış</Text>
      <TextInput
        style={styles.input}
        value={businessInfo.weekendOpen}
        onChangeText={(text) => {
          setBusinessInfo({ ...businessInfo, weekendOpen: text });
          setHasChanges(true);
        }}
        placeholder="10:00"
      />

      <Text style={styles.label}>Hafta Sonu - Kapanış</Text>
      <TextInput
        style={styles.input}
        value={businessInfo.weekendClose}
        onChangeText={(text) => {
          setBusinessInfo({ ...businessInfo, weekendClose: text });
          setHasChanges(true);
        }}
        placeholder="22:00"
      />
    </View>
  );

  const renderAppSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Uygulama Ayarları</Text>
      
      <Text style={styles.label}>Uygulama Adı</Text>
      <TextInput
        style={styles.input}
        value={appInfo.appName}
        onChangeText={(text) => {
          setAppInfo({ ...appInfo, appName: text });
          setHasChanges(true);
        }}
        placeholder="Uygulama adı"
      />

      <Text style={styles.label}>Slogan</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={appInfo.slogan}
        onChangeText={(text) => {
          setAppInfo({ ...appInfo, slogan: text });
          setHasChanges(true);
        }}
        placeholder="Slogan"
        multiline
        numberOfLines={2}
      />

      <Text style={styles.label}>Açıklama</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={appInfo.description}
        onChangeText={(text) => {
          setAppInfo({ ...appInfo, description: text });
          setHasChanges(true);
        }}
        placeholder="Açıklama"
        multiline
        numberOfLines={3}
      />

      <Text style={styles.sectionSubtitle}>Kafe Açıklaması</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={cafeInfo.description}
        onChangeText={(text) => {
          setCafeInfo({ ...cafeInfo, description: text });
          setHasChanges(true);
        }}
        placeholder="Kafe açıklaması"
        multiline
        numberOfLines={4}
      />
    </View>
  );

  const renderWorkshopSettings = () => {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    
    const handleAddSession = (day) => {
      setSelectedDay(day);
      setNewSessionWorkshop('');
      setNewSessionTime('');
      setNewSessionCapacity('6');
      setShowSessionModal(true);
    };

    const handleSaveSession = () => {
      if (!newSessionWorkshop || !newSessionTime) {
        Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
        return;
      }

      const result = addWorkshopToSchedule(
        selectedDay, 
        newSessionWorkshop, 
        newSessionTime, 
        parseInt(newSessionCapacity) || 6
      );
      
      if (result.success) {
        setWeeklySchedule(getWeeklySchedule());
        setShowSessionModal(false);
        Alert.alert('Başarılı', 'Yeni seans eklendi');
      }
    };

    const handleRemoveSession = (day, sessionId) => {
      Alert.alert(
        'Seansı Sil',
        'Bu seansı silmek istediğinize emin misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: () => {
              const result = removeWorkshopFromSchedule(day, sessionId);
              if (result.success) {
                setWeeklySchedule(getWeeklySchedule());
                Alert.alert('Başarılı', 'Seans silindi');
              }
            }
          }
        ]
      );
    };

    return (
      <View style={styles.section}>
        {/* Atölye Paketleri ve Fiyatları */}
        <Text style={styles.sectionTitle}>Çocuk Atölye Paketleri 🎨</Text>
        
        {workshopPackages.map((pkg, index) => (
          <View key={pkg.id} style={styles.packageCard}>
            <Text style={styles.packageName}>{pkg.name}</Text>
            
            <Text style={styles.label}>Fiyat</Text>
            <TextInput
              style={styles.input}
              value={pkg.price}
              onChangeText={(text) => {
                const newPackages = [...workshopPackages];
                newPackages[index].price = text;
                setWorkshopPackages(newPackages);
                setHasChanges(true);
              }}
              placeholder="Fiyat"
            />

            <Text style={styles.label}>Açıklama</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={pkg.description}
              onChangeText={(text) => {
                const newPackages = [...workshopPackages];
                newPackages[index].description = text;
                setWorkshopPackages(newPackages);
                setHasChanges(true);
              }}
              placeholder="Açıklama"
              multiline
              numberOfLines={2}
            />
          </View>
        ))}

        {/* Haftalık Program */}
        <Text style={styles.sectionTitle}>Haftalık Atölye Programı 📅</Text>
        <Text style={styles.sectionSubtitle}>
          Her gün için atölye seanslarını ekleyin/çıkarın
        </Text>

        {days.map(day => (
          <View key={day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{day}</Text>
              <TouchableOpacity 
                style={styles.addSessionButton}
                onPress={() => handleAddSession(day)}
              >
                <Text style={styles.addSessionText}>+ Seans Ekle</Text>
              </TouchableOpacity>
            </View>

            {weeklySchedule[day] && weeklySchedule[day].length > 0 ? (
              weeklySchedule[day].map((session) => (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionWorkshop}>{session.workshop}</Text>
                    <Text style={styles.sessionTime}>⏰ {session.time}</Text>
                    <Text style={[
                      styles.sessionCapacity,
                      session.enrolled >= session.capacity && { color: '#FF5252' }
                    ]}>
                      👥 {session.enrolled}/{session.capacity} kişi
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleRemoveSession(day, session.id)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noSessionText}>Bu gün için seans yok</Text>
            )}
          </View>
        ))}

        {/* Seans Ekleme Modal */}
        <Modal
          visible={showSessionModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSessionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedDay} - Yeni Seans Ekle
              </Text>

              <Text style={styles.modalLabel}>Atölye Adı</Text>
              <TextInput
                style={styles.modalInput}
                value={newSessionWorkshop}
                onChangeText={setNewSessionWorkshop}
                placeholder="Örn: İngilizce Atölyesi"
              />

              <Text style={styles.modalLabel}>Saat Aralığı</Text>
              <TextInput
                style={styles.modalInput}
                value={newSessionTime}
                onChangeText={setNewSessionTime}
                placeholder="Örn: 10:00-11:00"
              />

              <Text style={styles.modalLabel}>Kapasite</Text>
              <TextInput
                style={styles.modalInput}
                value={newSessionCapacity}
                onChangeText={setNewSessionCapacity}
                placeholder="6"
                keyboardType="number-pad"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setShowSessionModal(false)}
                >
                  <Text style={styles.modalButtonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={handleSaveSession}
                >
                  <Text style={[styles.modalButtonText, { color: '#FFF' }]}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderWomensWorkshopSettings = () => {
    const handleAddWorkshop = () => {
      setNewWorkshopName('');
      setNewWorkshopDescription('');
      setNewWorkshopIcon('');
      setNewWorkshopPrice('');
      setShowWorkshopModal(true);
    };

    const handleSaveWorkshop = () => {
      if (!newWorkshopName || !newWorkshopPrice) {
        Alert.alert('Hata', 'Lütfen workshop adı ve fiyat girin');
        return;
      }

      const result = addWomensWorkshop({
        name: newWorkshopName,
        description: newWorkshopDescription || '',
        icon: newWorkshopIcon || '✨',
        price: newWorkshopPrice,
      });

      if (result.success) {
        setWomensWorkshops(getWomensWorkshops());
        setShowWorkshopModal(false);
        setHasChanges(true);
        Alert.alert('Başarılı', 'Yeni workshop eklendi');
      }
    };

    const handleUpdateWorkshop = (workshopId, field, value) => {
      updateWomensWorkshop(workshopId, { [field]: value });
      setWomensWorkshops(getWomensWorkshops());
      setHasChanges(true);
    };

    const handleRemoveWorkshop = (workshopId) => {
      Alert.alert(
        'Workshop Sil',
        'Bu workshop\'u silmek istediğinize emin misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: () => {
              removeWomensWorkshop(workshopId);
              setWomensWorkshops(getWomensWorkshops());
              setHasChanges(true);
            },
          },
        ]
      );
    };

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hanımlara Yönelik Workshop ✨</Text>
        <Text style={styles.sectionSubtitle}>
          Workshop listesini yönetin (Ekle/Düzenle/Sil)
        </Text>

        <TouchableOpacity 
          style={styles.addWorkshopButton}
          onPress={handleAddWorkshop}
        >
          <LinearGradient
            colors={['#FFD6E8', '#FFE8F0']}
            style={styles.addWorkshopGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.addWorkshopText}>+ Yeni Workshop Ekle</Text>
          </LinearGradient>
        </TouchableOpacity>

        {womensWorkshops.map((workshop) => (
          <View key={workshop.id} style={styles.workshopEditCard}>
            <View style={styles.workshopEditHeader}>
              <Text style={styles.workshopEditIcon}>{workshop.icon}</Text>
              <TouchableOpacity 
                onPress={() => handleRemoveWorkshop(workshop.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Workshop Adı</Text>
            <TextInput
              style={styles.input}
              value={workshop.name}
              onChangeText={(text) => handleUpdateWorkshop(workshop.id, 'name', text)}
            />

            <Text style={styles.label}>Açıklama</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={workshop.description}
              onChangeText={(text) => handleUpdateWorkshop(workshop.id, 'description', text)}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Icon (Emoji)</Text>
            <TextInput
              style={styles.input}
              value={workshop.icon}
              onChangeText={(text) => handleUpdateWorkshop(workshop.id, 'icon', text)}
              placeholder="✨"
            />

            <Text style={styles.label}>Fiyat</Text>
            <TextInput
              style={styles.input}
              value={workshop.price}
              onChangeText={(text) => handleUpdateWorkshop(workshop.id, 'price', text)}
              placeholder="150₺"
            />
          </View>
        ))}

        {/* Workshop Ekleme Modal */}
        <Modal
          visible={showWorkshopModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowWorkshopModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Yeni Workshop Ekle</Text>

              <Text style={styles.modalLabel}>Workshop Adı *</Text>
              <TextInput
                style={styles.modalInput}
                value={newWorkshopName}
                onChangeText={setNewWorkshopName}
                placeholder="Örn: Mum Workshop"
              />

              <Text style={styles.modalLabel}>Açıklama</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                value={newWorkshopDescription}
                onChangeText={setNewWorkshopDescription}
                placeholder="Workshop açıklaması..."
                multiline
                numberOfLines={3}
              />

              <Text style={styles.modalLabel}>Icon (Emoji)</Text>
              <TextInput
                style={styles.modalInput}
                value={newWorkshopIcon}
                onChangeText={setNewWorkshopIcon}
                placeholder="✨ (opsiyonel)"
              />

              <Text style={styles.modalLabel}>Fiyat *</Text>
              <TextInput
                style={styles.modalInput}
                value={newWorkshopPrice}
                onChangeText={setNewWorkshopPrice}
                placeholder="150₺"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setShowWorkshopModal(false)}
                >
                  <Text style={styles.modalButtonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={handleSaveWorkshop}
                >
                  <Text style={[styles.modalButtonText, { color: '#FFF' }]}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderWorkshopDates = () => {
    const handleAddDate = () => {
      if (!newDate.trim()) {
        Alert.alert('Hata', 'Lütfen tarih girin');
        return;
      }

      setWorkshopDates([...workshopDates, newDate.trim()]);
      setNewDate('');
      setShowDateModal(false);
      setHasChanges(true);
      Alert.alert('Başarılı', 'Yeni tarih eklendi');
    };

    const handleRemoveDate = (index) => {
      Alert.alert(
        'Tarihi Sil',
        'Bu tarihi silmek istediğinize emin misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: () => {
              const newDates = [...workshopDates];
              newDates.splice(index, 1);
              setWorkshopDates(newDates);
              setHasChanges(true);
            },
          },
        ]
      );
    };

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workshop Tarihleri 📆</Text>
        <Text style={styles.sectionSubtitle}>
          Hanımlara yönelik workshop için sunulacak tarihleri yönetin
        </Text>

        <TouchableOpacity 
          style={styles.addWorkshopButton}
          onPress={() => {
            setNewDate('');
            setShowDateModal(true);
          }}
        >
          <LinearGradient
            colors={['#FFD6E8', '#FFE8F0']}
            style={styles.addWorkshopGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.addWorkshopText}>+ Yeni Tarih Ekle</Text>
          </LinearGradient>
        </TouchableOpacity>

        {workshopDates.length === 0 ? (
          <Text style={styles.noSessionText}>Henüz tarih eklenmemiş</Text>
        ) : (
          workshopDates.map((date, index) => (
            <View key={index} style={styles.dateCard}>
              <Text style={styles.dateCardText}>{date}</Text>
              <TouchableOpacity 
                onPress={() => handleRemoveDate(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Tarih Ekleme Modal */}
        <Modal
          visible={showDateModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Yeni Tarih Ekle</Text>

              <Text style={styles.modalLabel}>Tarih</Text>
              <TextInput
                style={styles.modalInput}
                value={newDate}
                onChangeText={setNewDate}
                placeholder="Örn: 15 Mart 2026"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setShowDateModal(false)}
                >
                  <Text style={styles.modalButtonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={handleAddDate}
                >
                  <Text style={[styles.modalButtonText, { color: '#FFF' }]}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderCafeMenu = () => {
    const categories = ['Sıcak İçecek', 'Soğuk İçecek', 'Kahvaltı', 'Tost', 'Börek', 'Tatlı', 'Yemek', 'Makarna'];
    
    const addNewMenuItem = (category) => {
      const newId = (Math.max(...cafeMenu.map(i => parseInt(i.id) || 0)) + 1).toString();
      const newItem = {
        id: newId,
        name: 'Yeni Ürün',
        price: '0₺',
        category: category,
      };
      setCafeMenu([...cafeMenu, newItem]);
      setHasChanges(true);
      Alert.alert('Başarılı', `${category} kategorisine yeni ürün eklendi`);
    };

    const deleteMenuItem = (itemId) => {
      Alert.alert(
        'Ürünü Sil',
        'Bu ürünü silmek istediğinize emin misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: () => {
              setCafeMenu(cafeMenu.filter(item => item.id !== itemId));
              setHasChanges(true);
            },
          },
        ]
      );
    };
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kafe Menü Düzenleme</Text>
        
        {categories.map(category => {
          const items = cafeMenu.filter(item => item.category === category);
          
          return (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addNewMenuItem(category)}
                >
                  <Text style={styles.addButtonText}>+ Ekle</Text>
                </TouchableOpacity>
              </View>
              
              {items.map((item, index) => {
                const globalIndex = cafeMenu.findIndex(m => m.id === item.id);
                
                return (
                  <View key={item.id} style={styles.menuItemCard}>
                    <View style={styles.menuItemHeader}>
                      <Text style={styles.label}>Ürün Adı</Text>
                      <TouchableOpacity onPress={() => deleteMenuItem(item.id)}>
                        <Text style={styles.deleteText}>🗑️ Sil</Text>
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={styles.input}
                      value={item.name}
                      onChangeText={(text) => {
                        const newMenu = [...cafeMenu];
                        newMenu[globalIndex].name = text;
                        setCafeMenu(newMenu);
                        setHasChanges(true);
                      }}
                      placeholder="Ürün adı"
                    />

                    <Text style={styles.label}>Fiyat</Text>
                    <TextInput
                      style={styles.input}
                      value={item.price}
                      onChangeText={(text) => {
                        const newMenu = [...cafeMenu];
                        newMenu[globalIndex].price = text;
                        setCafeMenu(newMenu);
                        setHasChanges(true);
                      }}
                      placeholder="Fiyat (örn: 50₺)"
                    />
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  const renderLoyaltyCard = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Oyun Alanı Sadakat Kartı Ayarları</Text>
      
      <Text style={styles.label}>Maksimum Damga Sayısı</Text>
      <TextInput
        style={styles.input}
        value={loyaltyCard.maxStamps}
        onChangeText={(text) => {
          setLoyaltyCard({ ...loyaltyCard, maxStamps: text });
          setHasChanges(true);
        }}
        placeholder="9"
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Hediye/Ödül</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={loyaltyCard.reward}
        onChangeText={(text) => {
          setLoyaltyCard({ ...loyaltyCard, reward: text });
          setHasChanges(true);
        }}
        placeholder="Serbest oyun alanında 1 saat ücretsiz giriş"
        multiline
        numberOfLines={2}
      />

      <Text style={styles.label}>Açıklama</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={loyaltyCard.description}
        onChangeText={(text) => {
          setLoyaltyCard({ ...loyaltyCard, description: text });
          setHasChanges(true);
        }}
        placeholder="9 damga topla, 1 saat oyun alanı hediye kazan!"
        multiline
        numberOfLines={2}
      />
    </View>
  );

  const renderPricing = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Doğum Günü Fiyatları</Text>
      
      <Text style={styles.sectionSubtitle}>Temel Paket</Text>
      <Text style={styles.label}>Hafta İçi</Text>
      <TextInput
        style={styles.input}
        value={birthdayBasic.weekday}
        onChangeText={(text) => {
          setBirthdayBasic({ ...birthdayBasic, weekday: text });
          setHasChanges(true);
        }}
        placeholder="12.000₺"
      />

      <Text style={styles.label}>Hafta Sonu</Text>
      <TextInput
        style={styles.input}
        value={birthdayBasic.weekend}
        onChangeText={(text) => {
          setBirthdayBasic({ ...birthdayBasic, weekend: text });
          setHasChanges(true);
        }}
        placeholder="15.000₺"
      />

      <Text style={styles.sectionSubtitle}>Premium Paket</Text>
      <Text style={styles.label}>Fiyat</Text>
      <TextInput
        style={styles.input}
        value={birthdayPremium.price}
        onChangeText={(text) => {
          setBirthdayPremium({ price: text });
          setHasChanges(true);
        }}
        placeholder="30.000₺"
      />

      <Text style={styles.sectionTitle}>Oyun Alanı Fiyatları</Text>
      
      <Text style={styles.label}>Saatlik Ücret</Text>
      <TextInput
        style={styles.input}
        value={playArea.hourlyRate}
        onChangeText={(text) => {
          setPlayArea({ ...playArea, hourlyRate: text });
          setHasChanges(true);
        }}
        placeholder="350"
        keyboardType="number-pad"
      />

      <Text style={styles.label}>30 Dakika Fiyatı</Text>
      <TextInput
        style={styles.input}
        value={playArea.package1Price}
        onChangeText={(text) => {
          setPlayArea({ ...playArea, package1Price: text });
          setHasChanges(true);
        }}
        placeholder="200₺"
      />

      <Text style={styles.label}>1 Saat Fiyatı</Text>
      <TextInput
        style={styles.input}
        value={playArea.package2Price}
        onChangeText={(text) => {
          setPlayArea({ ...playArea, package2Price: text });
          setHasChanges(true);
        }}
        placeholder="350₺"
      />

      <Text style={styles.label}>2-5 Saat Fiyatı</Text>
      <TextInput
        style={styles.input}
        value={playArea.package3Price}
        onChangeText={(text) => {
          setPlayArea({ ...playArea, package3Price: text });
          setHasChanges(true);
        }}
        placeholder="550₺"
      />
    </View>
  );

  // Live Editor - Uygulama Önizleme
  const renderLiveEditor = () => (
    <View>
      <Text style={styles.sectionTitle}>🎬 Canlı Düzenleyici</Text>
      <Text style={styles.sectionDescription}>
        Uygulamanın düzenlenebilir bir kopyasını görüntüleyin. Değişikliklerinizi gerçek zamanlı olarak görebilirsiniz.
      </Text>

      <LinearGradient
        colors={['#D4EDDA', '#E8F5E9']}
        style={styles.infoBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.infoIcon}>✨</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Canlı Düzenleme Hazır!</Text>
          <Text style={styles.infoText}>
            Artık uygulamanızı canlı olarak düzenleyebilirsiniz:{'\n\n'}
            • Gerçek zamanlı önizleme{'\n'}
            • Renk değişiklikleri{'\n'}
            • Metin düzenlemeleri{'\n'}
            • İletişim bilgileri{'\n'}
            • 4 farklı sayfa önizlemesi (Ana Sayfa, Kafe, Atölye, Doğum Günü)
          </Text>
        </View>
      </LinearGradient>

      {/* Önizleme Butonu */}
      <TouchableOpacity
        style={styles.previewButton}
        onPress={() => navigation.navigate('LiveEditor')}
      >
        <LinearGradient
          colors={['#4CAF50', '#66BB6A']}
          style={styles.previewButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.previewButtonText}>🎬 Önizlemeyi Aç</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const tabs = [
    { id: 'business', name: 'İşletme', icon: '🏢' },
    { id: 'app', name: 'Uygulama', icon: '📱' },
    { id: 'photos', name: 'Fotoğraflar', icon: '📷' },
    { id: 'cafe', name: 'Kafe Menü', icon: '☕' },
    { id: 'workshops', name: 'Atölyeler', icon: '🎨' },
    { id: 'womensworkshop', name: 'Workshop + Tarihler', icon: '✨' },
    { id: 'loyalty', name: 'Oyun Alanı Sadakat', icon: '🎁' },
    { id: 'birthday', name: 'Doğum Günü', icon: '🎂' },
    { id: 'playarea', name: 'Oyun Alanı', icon: '🧸' },
    { id: 'liveeditor', name: 'Canlı Düzenleyici', icon: '🎬' },
  ];

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Düzenlemeler</Text>
          <TouchableOpacity onPress={handleSave} disabled={!hasChanges}>
            <Text style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}>
              Kaydet
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={{ maxHeight: 50 }}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  activeTab === tab.id
                    ? ['#4CAF50', '#66BB6A']
                    : ['#FFFFFF', '#F5F5F5']
                }
                style={styles.tab}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.tabTextActive,
                  ]}
                >
                  {tab.name}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content */}
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {activeTab === 'business' && renderBusinessInfo()}
          {activeTab === 'app' && renderAppSettings()}
          {activeTab === 'photos' && renderPhotoSettings()}
          {activeTab === 'cafe' && renderCafeMenu()}
          {activeTab === 'workshops' && renderWorkshopSettings()}
          {activeTab === 'womensworkshop' && (
            <View>
              {renderWomensWorkshopSettings()}
              {renderWorkshopDates()}
            </View>
          )}
          {activeTab === 'loyalty' && renderLoyaltyCard()}
          {activeTab === 'liveeditor' && renderLiveEditor()}
          {activeTab === 'birthday' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Doğum Günü Paket Düzenleme</Text>
              
              <Text style={styles.sectionSubtitle}>Temel Paket (Concept 1)</Text>
              <Text style={styles.label}>Hafta İçi Fiyat</Text>
              <TextInput
                style={styles.input}
                value={birthdayBasic.weekday}
                onChangeText={(text) => {
                  setBirthdayBasic({ ...birthdayBasic, weekday: text });
                  setHasChanges(true);
                }}
                placeholder="12.000₺"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Hafta Sonu Fiyat</Text>
              <TextInput
                style={styles.input}
                value={birthdayBasic.weekend}
                onChangeText={(text) => {
                  setBirthdayBasic({ ...birthdayBasic, weekend: text });
                  setHasChanges(true);
                }}
                placeholder="15.000₺"
                keyboardType="numeric"
              />

              <Text style={styles.sectionSubtitle}>Premium Paket (Concept 2)</Text>
              <Text style={styles.label}>Fiyat</Text>
              <TextInput
                style={styles.input}
                value={birthdayPremium.price}
                onChangeText={(text) => {
                  setBirthdayPremium({ price: text });
                  setHasChanges(true);
                }}
                placeholder="30.000₺"
                keyboardType="numeric"
              />
            </View>
          )}
          {activeTab === 'playarea' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Oyun Alanı Paketleri 🧸</Text>
              
              <Text style={styles.label}>Saatlik Ücret</Text>
              <TextInput
                style={styles.input}
                value={playArea.hourlyRate}
                onChangeText={(text) => {
                  setPlayArea({ ...playArea, hourlyRate: text });
                  setHasChanges(true);
                }}
                placeholder="350"
                keyboardType="number-pad"
              />

              <Text style={styles.sectionSubtitle}>Paket 1: 30 Dakika</Text>
              <Text style={styles.label}>Fiyat</Text>
              <TextInput
                style={styles.input}
                value={playArea.package1Price}
                onChangeText={(text) => {
                  setPlayArea({ ...playArea, package1Price: text });
                  setHasChanges(true);
                }}
                placeholder="200₺"
              />

              <Text style={styles.sectionSubtitle}>Paket 2: 1 Saat</Text>
              <Text style={styles.label}>Fiyat</Text>
              <TextInput
                style={styles.input}
                value={playArea.package2Price}
                onChangeText={(text) => {
                  setPlayArea({ ...playArea, package2Price: text });
                  setHasChanges(true);
                }}
                placeholder="350₺"
              />

              <Text style={styles.sectionSubtitle}>Paket 3: 2-5 Saat</Text>
              <Text style={styles.label}>Fiyat</Text>
              <TextInput
                style={styles.input}
                value={playArea.package3Price}
                onChangeText={(text) => {
                  setPlayArea({ ...playArea, package3Price: text });
                  setHasChanges(true);
                }}
                placeholder="550₺"
              />
            </View>
          )}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  saveButton: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '700',
  },
  saveButtonDisabled: {
    color: '#CCC',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 0,
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    minWidth: 120,
  },
  tabIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tabTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  packageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  capacityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  workshopName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deleteText: {
    fontSize: 13,
    color: '#FF5252',
    fontWeight: '600',
  },
  menuItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // Haftalık Program Stilleri
  dayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  addSessionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addSessionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sessionCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionWorkshop: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 2,
  },
  sessionCapacity: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 20,
  },
  noSessionText: {
    fontSize: 13,
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#E0E0E0',
  },
  modalButtonSave: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  packageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  // Workshop Edit Stilleri
  addWorkshopButton: {
    marginVertical: 15,
  },
  addWorkshopGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  addWorkshopText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  workshopEditCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FFD6E8',
  },
  workshopEditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  workshopEditIcon: {
    fontSize: 40,
  },
  dateCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD6E8',
  },
  dateCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  // Photo Settings Stilleri
  sectionDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  photoItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  photoInfo: {
    flex: 1,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  photoStatus: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  photoNote: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 235, 59, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  photoNoteIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  photoNoteText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  infoBox: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  previewButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
  },
  previewButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
