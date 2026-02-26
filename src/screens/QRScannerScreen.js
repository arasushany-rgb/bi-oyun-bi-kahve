import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import colors from '../config/colors';
import { globalStyles } from '../config/theme';

export default function QRScannerScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹ Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>QR Check-In</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* QR Placeholder */}
        <View style={styles.qrPlaceholder}>
          <Text style={styles.qrIcon}>📱</Text>
          <Text style={styles.qrTitle}>QR Kod Tarayıcı</Text>
          <Text style={styles.qrSubtitle}>
            QR kod okuyucu gerçek cihazda çalışır
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            QR kod okuyucu özelliği gerçek telefonda (iOS/Android) çalışır.{'\n\n'}
            Şimdilik test için "Test Modu" butonunu kullanın.
          </Text>
        </View>

        {/* Test Button */}
        <TouchableOpacity
          style={[globalStyles.button, styles.testButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={globalStyles.buttonText}>Test Modu - Giriş Ekranı</Text>
        </TouchableOpacity>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Gerçek Kullanımda:</Text>
          <Text style={styles.instructionsText}>
            1. İşletme girişindeki QR kodu okutun{'\n'}
            2. Kamera açılacak{'\n'}
            3. QR kodu çerçeve içine alın{'\n'}
            4. Otomatik check-in yapılacak
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.primary,
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  qrPlaceholder: {
    backgroundColor: colors.white,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  qrIcon: {
    fontSize: 80,
    marginBottom: 15,
  },
  qrTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
  },
  testButton: {
    marginBottom: 20,
  },
  instructionsCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 15,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
  },
});
