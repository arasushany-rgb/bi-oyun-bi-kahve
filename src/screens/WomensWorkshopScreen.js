import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import { useAuth } from '../context/AuthContext';

export default function WomensWorkshopScreen({ navigation }) {
  const { user, getWomensWorkshops } = useAuth();
  const workshops = getWomensWorkshops();

  const handleReservation = (workshop) => {
    // GİRİŞ YAPILMIŞSA → WomensWorkshopReservation kullan
    if (user) {
      navigation.navigate('WomensWorkshopReservation', { workshop });
      return;
    }
    
    // GİRİŞ YAPILMADIYSA → Rezervasyon formuna git
    navigation.navigate('ReservationForm', {
      package: {
        id: 'womens-workshop',
        name: workshop.title,
        price: workshop.price || '0₺',
        count: 1
      },
      type: 'workshop'
    });
  };

  return (
    <LinearGradient
      colors={['#FFFBFE', '#FFFFFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workshop</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <LinearGradient
              colors={['#FFF5F8', '#FFFAFC']}
              style={styles.infoBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.infoBannerTitle}>✨ Hanımlara Yönelik Workshoplar</Text>
              <Text style={styles.infoBannerText}>
                Hayal gücünüzü konuşturun, yeni beceriler öğrenin
              </Text>
            </LinearGradient>

            {workshops.map((workshop) => (
              <TouchableOpacity
                key={workshop.id}
                activeOpacity={0.8}
                onPress={() => handleReservation(workshop)}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                  style={styles.workshopCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Fotoğraf Alanı */}
                  <View style={styles.imageContainer}>
                    {workshop.image ? (
                      <Image source={workshop.image} style={styles.workshopImage} />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderIcon}>{workshop.icon}</Text>
                        <Text style={styles.placeholderText}>Fotoğraf eklenecek</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.workshopInfo}>
                    <Text style={styles.workshopName}>{workshop.name}</Text>
                    <Text style={styles.workshopDescription}>{workshop.description}</Text>
                    
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Fiyat:</Text>
                      <Text style={styles.priceValue}>{workshop.price}</Text>
                    </View>

                    <View style={styles.reserveButton}>
                      <Text style={styles.reserveButtonText}>Rezervasyon Yap →</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
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
    color: '#E91E63',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    padding: 20,
  },
  infoBanner: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  infoBannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  infoBannerText: {
    fontSize: 15,
    color: '#000',
    opacity: 0.8,
  },
  workshopCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#F5F5F5',
  },
  workshopImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCE4EC',
  },
  placeholderIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  workshopInfo: {
    padding: 18,
  },
  workshopName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  workshopDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderRadius: 10,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  reserveButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  reserveButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
