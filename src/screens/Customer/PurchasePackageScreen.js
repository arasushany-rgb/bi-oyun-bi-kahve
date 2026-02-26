import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../config/colors';
import config from '../../config/config';
import { useAuth } from '../../context/AuthContext';

export default function PurchasePackageScreen({ navigation }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { purchasePackage } = useAuth();

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('Uyarı', 'Lütfen bir paket seçin');
      return;
    }

    Alert.alert(
      'Paket Satın Al',
      `${selectedPackage.name} paketini ${selectedPackage.price}'ye satın almak istediğinize emin misiniz?\n\nÖdeme işlemi işletme ile görüşülerek tamamlanacaktır.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Satın Al',
          onPress: async () => {
            const result = await purchasePackage(selectedPackage);
            if (result.success) {
              Alert.alert(
                'Başarılı! 🎉',
                'Paketiniz başarıyla eklendi. Ödeme işlemini tamamlamak için işletme ile iletişime geçin.',
                [
                  { text: 'Tamam', onPress: () => navigation.goBack() }
                ]
              );
            }
          }
        },
      ]
    );
  };

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
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Paket Seç</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.banner}>
            <Text style={styles.bannerIcon}>🎁</Text>
            <Text style={styles.bannerTitle}>Atölye Paketleri</Text>
            <Text style={styles.bannerText}>
              Paketinizi seçin ve atölyelere katılmaya başlayın!
            </Text>
          </View>

          <View style={styles.packagesContainer}>
            {config.workshops.packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                activeOpacity={0.8}
                onPress={() => setSelectedPackage(pkg)}
              >
                <LinearGradient
                  colors={
                    selectedPackage?.id === pkg.id
                      ? ['#FFB74D', '#FFF59D']
                      : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']
                  }
                  style={[
                    styles.packageCard,
                    selectedPackage?.id === pkg.id && styles.packageCardSelected,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.packageHeader}>
                    <View style={styles.packageTitleContainer}>
                      <Text style={styles.packageName}>{pkg.name}</Text>
                      {pkg.id === 'trial' && (
                        <View style={styles.trialBadge}>
                          <Text style={styles.trialBadgeText}>Deneme</Text>
                        </View>
                      )}
                    </View>
                    <View
                      style={[
                        styles.radioButton,
                        selectedPackage?.id === pkg.id && styles.radioButtonSelected,
                      ]}
                    >
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

          <View style={styles.infoSection}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
              style={styles.infoCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.infoIcon}>ℹ️</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Önemli Bilgiler</Text>
                <Text style={styles.infoText}>
                  • Paket seçtikten sonra ödeme için işletme ile iletişime geçin{'\n'}
                  • Her atölye katılımında 1 hak kullanılır{'\n'}
                  • İptal ve iade koşulları için işletme ile görüşün
                </Text>
              </View>
            </LinearGradient>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePurchase}
            disabled={!selectedPackage}
          >
            <LinearGradient
              colors={!selectedPackage ? ['#CCCCCC', '#999999'] : ['#FFB74D', '#FFF59D']}
              style={[
                styles.purchaseButton,
                !selectedPackage && styles.purchaseButtonDisabled,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.purchaseButtonText}>
                {selectedPackage ? 'Satın Al' : 'Paket Seçin'}
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
  banner: {
    margin: 20,
    padding: 25,
    borderRadius: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bannerIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
  },
  packagesContainer: {
    paddingHorizontal: 20,
  },
  packageCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  packageCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  trialBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  trialBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
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
    borderColor: colors.text,
  },
  radioButtonInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.text,
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
    borderTopColor: 'rgba(93, 64, 55, 0.1)',
  },
  packageCount: {
    alignItems: 'center',
  },
  packageCountNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  packageCountLabel: {
    fontSize: 12,
    color: colors.textGray,
  },
  packagePriceContainer: {
    alignItems: 'flex-end',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 18,
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
  purchaseButton: {
    marginHorizontal: 20,
    marginBottom: 20,
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
  purchaseButtonDisabled: {
    opacity: 0.5,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  footer: {
    height: 30,
  },
});
