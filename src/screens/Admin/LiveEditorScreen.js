import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../config/colors';
import { useAuth } from '../../context/AuthContext';

export default function LiveEditorScreen({ navigation }) {
  const { config } = useAuth();
  
  // Düzenlenebilir state'ler
  const [previewMode, setPreviewMode] = useState('home'); // home, cafe, workshop, birthday
  const [editedConfig, setEditedConfig] = useState({
    businessName: config?.business?.name || 'Bi Oyun Bi Kahve',
    businessPhone: config?.business?.phone || '0555 010 5887',
    businessAddress: config?.business?.address || 'İstanbul, Türkiye',
    primaryColor: '#7CB342',
    secondaryColor: '#FFB74D',
    welcomeText: 'Hoş Geldiniz!',
    welcomeSubtext: 'Eğlence ve lezzet bir arada',
  });
  
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Önizleme modları
  const previewModes = [
    { id: 'home', name: 'Ana Sayfa', icon: '🏠' },
    { id: 'cafe', name: 'Kafe', icon: '☕' },
    { id: 'workshop', name: 'Atölyeler', icon: '🎨' },
    { id: 'birthday', name: 'Doğum Günü', icon: '🎂' },
  ];

  // Önizleme render
  const renderPreview = () => {
    switch (previewMode) {
      case 'home':
        return renderHomePreview();
      case 'cafe':
        return renderCafePreview();
      case 'workshop':
        return renderWorkshopPreview();
      case 'birthday':
        return renderBirthdayPreview();
      default:
        return renderHomePreview();
    }
  };

  // Ana Sayfa Önizlemesi
  const renderHomePreview = () => (
    <View style={styles.previewContainer}>
      <LinearGradient
        colors={[editedConfig.primaryColor, editedConfig.secondaryColor]}
        style={styles.previewHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Text style={styles.previewTitle}>{editedConfig.businessName}</Text>
        <Text style={styles.previewSubtitle}>{editedConfig.welcomeText}</Text>
        <Text style={styles.previewDescription}>{editedConfig.welcomeSubtext}</Text>
      </LinearGradient>

      <View style={styles.previewContent}>
        <View style={styles.previewCard}>
          <Text style={styles.previewCardIcon}>☕</Text>
          <Text style={styles.previewCardTitle}>Kafe Menü</Text>
          <Text style={styles.previewCardDesc}>Lezzetli içecekler</Text>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewCardIcon}>🎨</Text>
          <Text style={styles.previewCardTitle}>Atölyeler</Text>
          <Text style={styles.previewCardDesc}>Eğlenceli aktiviteler</Text>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewCardIcon}>🎂</Text>
          <Text style={styles.previewCardTitle}>Doğum Günü</Text>
          <Text style={styles.previewCardDesc}>Özel kutlamalar</Text>
        </View>
      </View>

      <View style={styles.previewFooter}>
        <Text style={styles.previewFooterText}>📞 {editedConfig.businessPhone}</Text>
        <Text style={styles.previewFooterText}>📍 {editedConfig.businessAddress}</Text>
      </View>
    </View>
  );

  // Kafe Önizlemesi
  const renderCafePreview = () => (
    <View style={styles.previewContainer}>
      <View style={[styles.previewHeader, { backgroundColor: '#FFB74D' }]}>
        <Text style={styles.previewTitle}>☕ Kafe Menü</Text>
        <Text style={styles.previewSubtitle}>Sıcak ve Soğuk İçecekler</Text>
      </View>

      <View style={styles.previewContent}>
        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuItemName}>Türk Kahvesi</Text>
            <Text style={styles.menuItemDesc}>Geleneksel lezzet</Text>
          </View>
          <Text style={styles.menuItemPrice}>45₺</Text>
        </View>

        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuItemName}>Filtre Kahve</Text>
            <Text style={styles.menuItemDesc}>Taze çekilmiş</Text>
          </View>
          <Text style={styles.menuItemPrice}>50₺</Text>
        </View>

        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuItemName}>Cappuccino</Text>
            <Text style={styles.menuItemDesc}>Kremalı ve köpüklü</Text>
          </View>
          <Text style={styles.menuItemPrice}>55₺</Text>
        </View>
      </View>
    </View>
  );

  // Atölye Önizlemesi
  const renderWorkshopPreview = () => (
    <View style={styles.previewContainer}>
      <View style={[styles.previewHeader, { backgroundColor: '#FFB6C1' }]}>
        <Text style={styles.previewTitle}>🎨 Atölyeler</Text>
        <Text style={styles.previewSubtitle}>Eğlenceli Etkinlikler</Text>
      </View>

      <View style={styles.previewContent}>
        <View style={styles.workshopCard}>
          <Text style={styles.workshopIcon}>🎨</Text>
          <Text style={styles.workshopName}>Resim Atölyesi</Text>
          <Text style={styles.workshopDesc}>6-12 yaş arası çocuklar için</Text>
          <View style={styles.workshopFooter}>
            <Text style={styles.workshopDuration}>⏱️ 60 dakika</Text>
            <Text style={styles.workshopPrice}>150₺</Text>
          </View>
        </View>

        <View style={styles.workshopCard}>
          <Text style={styles.workshopIcon}>🧶</Text>
          <Text style={styles.workshopName}>El İşi Atölyesi</Text>
          <Text style={styles.workshopDesc}>Yaratıcılık zamanı</Text>
          <View style={styles.workshopFooter}>
            <Text style={styles.workshopDuration}>⏱️ 45 dakika</Text>
            <Text style={styles.workshopPrice}>120₺</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Doğum Günü Önizlemesi
  const renderBirthdayPreview = () => (
    <View style={styles.previewContainer}>
      <View style={[styles.previewHeader, { backgroundColor: '#C5CAE9' }]}>
        <Text style={styles.previewTitle}>🎂 Doğum Günü</Text>
        <Text style={styles.previewSubtitle}>Unutulmaz Kutlamalar</Text>
      </View>

      <View style={styles.previewContent}>
        <View style={styles.birthdayPackage}>
          <Text style={styles.packageTitle}>🎈 Temel Paket</Text>
          <Text style={styles.packageDesc}>10 çocuk için</Text>
          <Text style={styles.packageFeature}>✓ Pasta ve mum</Text>
          <Text style={styles.packageFeature}>✓ Balonlar</Text>
          <Text style={styles.packageFeature}>✓ 2 saat mekan</Text>
          <View style={styles.packagePriceBox}>
            <Text style={styles.packagePrice}>2,500₺</Text>
            <Text style={styles.packagePriceLabel}>Hafta İçi</Text>
          </View>
        </View>

        <View style={styles.birthdayPackage}>
          <Text style={styles.packageTitle}>🎉 Premium Paket</Text>
          <Text style={styles.packageDesc}>15 çocuk için</Text>
          <Text style={styles.packageFeature}>✓ Özel pasta</Text>
          <Text style={styles.packageFeature}>✓ Animasyon</Text>
          <Text style={styles.packageFeature}>✓ 3 saat mekan</Text>
          <View style={styles.packagePriceBox}>
            <Text style={styles.packagePrice}>4,500₺</Text>
            <Text style={styles.packagePriceLabel}>Hafta İçi</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#F5F0E8', '#F5F0E8']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🎬 Canlı Düzenleyici</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.mainContent}>
          {/* Sol Panel - Düzenleme */}
          <ScrollView style={styles.editPanel} showsVerticalScrollIndicator={false}>
            <Text style={styles.panelTitle}>⚙️ Ayarlar</Text>

            {/* İşletme Adı */}
            <View style={styles.editGroup}>
              <Text style={styles.editLabel}>İşletme Adı</Text>
              <TextInput
                style={styles.editInput}
                value={editedConfig.businessName}
                onChangeText={(text) => setEditedConfig({ ...editedConfig, businessName: text })}
                placeholder="İşletme adı"
              />
            </View>

            {/* Karşılama Metni */}
            <View style={styles.editGroup}>
              <Text style={styles.editLabel}>Karşılama Metni</Text>
              <TextInput
                style={styles.editInput}
                value={editedConfig.welcomeText}
                onChangeText={(text) => setEditedConfig({ ...editedConfig, welcomeText: text })}
                placeholder="Hoş geldiniz!"
              />
            </View>

            {/* Alt Metin */}
            <View style={styles.editGroup}>
              <Text style={styles.editLabel}>Alt Metin</Text>
              <TextInput
                style={[styles.editInput, styles.editTextArea]}
                value={editedConfig.welcomeSubtext}
                onChangeText={(text) => setEditedConfig({ ...editedConfig, welcomeSubtext: text })}
                placeholder="Açıklama metni"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Telefon */}
            <View style={styles.editGroup}>
              <Text style={styles.editLabel}>Telefon</Text>
              <TextInput
                style={styles.editInput}
                value={editedConfig.businessPhone}
                onChangeText={(text) => setEditedConfig({ ...editedConfig, businessPhone: text })}
                placeholder="0555 000 0000"
                keyboardType="phone-pad"
              />
            </View>

            {/* Adres */}
            <View style={styles.editGroup}>
              <Text style={styles.editLabel}>Adres</Text>
              <TextInput
                style={[styles.editInput, styles.editTextArea]}
                value={editedConfig.businessAddress}
                onChangeText={(text) => setEditedConfig({ ...editedConfig, businessAddress: text })}
                placeholder="Adres bilgisi"
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Renk Seçenekleri */}
            <View style={styles.colorSection}>
              <Text style={styles.editLabel}>🎨 Renkler</Text>
              
              <View style={styles.colorRow}>
                <Text style={styles.colorLabel}>Ana Renk:</Text>
                <View style={styles.colorPreviewBox}>
                  <View style={[styles.colorPreview, { backgroundColor: editedConfig.primaryColor }]} />
                  <TextInput
                    style={styles.colorInput}
                    value={editedConfig.primaryColor}
                    onChangeText={(text) => setEditedConfig({ ...editedConfig, primaryColor: text })}
                    placeholder="#7CB342"
                  />
                </View>
              </View>

              <View style={styles.colorRow}>
                <Text style={styles.colorLabel}>İkinci Renk:</Text>
                <View style={styles.colorPreviewBox}>
                  <View style={[styles.colorPreview, { backgroundColor: editedConfig.secondaryColor }]} />
                  <TextInput
                    style={styles.colorInput}
                    value={editedConfig.secondaryColor}
                    onChangeText={(text) => setEditedConfig({ ...editedConfig, secondaryColor: text })}
                    placeholder="#FFB74D"
                  />
                </View>
              </View>
            </View>

            {/* Bilgilendirme */}
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                Değişiklikler sağ panelde canlı olarak görüntülenir. Kaydetmek için "Kaydet" butonuna basın.
              </Text>
            </View>

            {/* Kaydet Butonu */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                // TODO: Firebase'e kaydet
                alert('Değişiklikler kaydedildi!');
              }}
            >
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>💾 Değişiklikleri Kaydet</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

          {/* Sağ Panel - Önizleme */}
          <View style={styles.previewPanel}>
            <Text style={styles.panelTitle}>📱 Önizleme</Text>
            
            {/* Mod Seçici */}
            <View style={styles.modeSelector}>
              {previewModes.map((mode) => (
                <TouchableOpacity
                  key={mode.id}
                  style={[
                    styles.modeButton,
                    previewMode === mode.id && styles.modeButtonActive
                  ]}
                  onPress={() => setPreviewMode(mode.id)}
                >
                  <Text style={[
                    styles.modeButtonText,
                    previewMode === mode.id && styles.modeButtonTextActive
                  ]}>
                    {mode.icon} {mode.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Önizleme Ekranı */}
            <View style={styles.phoneFrame}>
              <View style={styles.phoneNotch} />
              <ScrollView style={styles.phoneScreen} showsVerticalScrollIndicator={false}>
                {renderPreview()}
              </ScrollView>
            </View>
          </View>
        </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 50,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    gap: 20,
  },
  editPanel: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
  },
  previewPanel: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  editGroup: {
    marginBottom: 20,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: colors.text,
  },
  editTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  colorSection: {
    marginBottom: 20,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorLabel: {
    fontSize: 13,
    color: colors.textLight,
    width: 80,
  },
  colorPreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  colorInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontFamily: 'monospace',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  saveButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modeButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  modeButtonText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#FFF',
  },
  phoneFrame: {
    backgroundColor: '#000',
    borderRadius: 30,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  phoneNotch: {
    height: 30,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  phoneScreen: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 600,
  },
  previewContainer: {
    flex: 1,
  },
  previewHeader: {
    padding: 30,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  previewSubtitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 4,
  },
  previewDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  previewContent: {
    padding: 20,
  },
  previewCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  previewCardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  previewCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  previewCardDesc: {
    fontSize: 12,
    color: colors.textLight,
  },
  previewFooter: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  previewFooterText: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  menuItemLeft: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  menuItemDesc: {
    fontSize: 12,
    color: colors.textLight,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB74D',
  },
  workshopCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  workshopIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  workshopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  workshopDesc: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 10,
  },
  workshopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workshopDuration: {
    fontSize: 12,
    color: colors.textLight,
  },
  workshopPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB6C1',
  },
  birthdayPackage: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#C5CAE9',
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  packageDesc: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 10,
  },
  packageFeature: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 4,
  },
  packagePriceBox: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C5CAE9',
    marginBottom: 4,
  },
  packagePriceLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
});
