# Bi Oyun Bi Kahve - Mobil Uygulama

Çocuk oyun atölyesi ve cafe işletmesi için özel mobil uygulama.

## 📱 Özellikler

### Müşteri Uygulaması
- ✅ **QR Check-In Sistemi** - Oyun alanına QR kod ile giriş
- ✅ **Cafe Menü & Sipariş** - Dijital menü ve sipariş sistemi
- ✅ **Atölye Paketleri** - Online paket satın alma ve rezervasyon
- ✅ **Süre Takibi** - Otomatik süre hesaplama ve bildirimler
- ✅ **Kullanıcı Profili** - Çocuk profilleri ve geçmiş

### İşletme Yönetim Paneli (Geliştirilecek)
- 📋 Canlı müşteri takibi
- 📋 Sipariş yönetimi
- 📋 Atölye rezervasyon yönetimi
- 📋 Menü düzenleme
- 📋 Raporlar

## 🎨 Tasarım

Renk paleti logo ile uyumlu:
- **Ana Renk:** #7CB342 (Yeşil)
- **İkincil:** #F9A825 (Turuncu/Sarı)
- **Vurgu:** #F48FB1 (Pembe)
- **Arka Plan:** #FFF9E6 (Krem/Bej)

## 🚀 Nasıl Çalıştırılır?

### Gereksinimler
- Node.js v20+
- Expo Go uygulaması (Telefonunuzda)

### Kurulum

1. **Bağımlılıklar yüklendi** ✅

2. **Uygulamayı Başlatın**
   ```bash
   npm start
   ```

3. **Telefonunuzda Test Edin**
   - **Android:** Expo Go uygulamasını açın, QR kodu tarayın
   - **iOS:** Kamera ile QR kodu tarayın, Expo Go'da açın

### Komutlar

```bash
npm start          # Expo sunucusunu başlat
npm run android    # Android emülatörde çalıştır
npm run ios        # iOS simulator'da çalıştır
```

## 📂 Proje Yapısı

```
bi-oyun-bi-kahve/
├── App.js                          # Ana uygulama dosyası
├── app.json                        # Expo yapılandırma
├── package.json                    # Paket bağımlılıkları
│
├── src/
│   ├── screens/                    # Ekranlar
│   │   ├── LoginScreen.js          # Giriş ekranı
│   │   ├── HomeScreen.js           # Ana sayfa
│   │   ├── QRScannerScreen.js      # QR okuyucu
│   │   ├── CheckInScreen.js        # Check-in formu
│   │   ├── CafeScreen.js           # Cafe menü
│   │   └── WorkshopsScreen.js      # Atölye paketleri
│   │
│   ├── components/                 # Yeniden kullanılabilir bileşenler
│   │
│   ├── navigation/                 # Navigasyon yapısı
│   │   └── AppNavigator.js
│   │
│   ├── config/                     # Yapılandırma dosyaları
│   │   ├── colors.js               # Renk paleti
│   │   ├── theme.js                # Global stiller
│   │   └── config.js               # Uygulama ayarları
│   │
│   ├── services/                   # Firebase servisleri (eklenecek)
│   │
│   └── utils/                      # Yardımcı fonksiyonlar
│       └── qrGenerator.js          # QR kod yardımcıları
│
└── assets/                         # Görseller, ikonlar
```

## 🔧 Yapılandırma

### İşletme Bilgileri
`src/config/config.js` dosyasından düzenleyin:
- İşletme adı, adres, telefon
- Çalışma saatleri
- Fiyatlar ve paketler
- Atölye türleri

### Renkler
`src/config/colors.js` dosyasından özelleştirin.

## 📲 QR Kodlar

### Check-In QR Kodu
QR Kod Data: `BIOYUNBIKAHVE_CHECKIN`

Bu QR kodu işletme girişine yazdırılıp asılacak. Müşteriler bu kodu okutarak check-in yapacak.

**QR Kod Oluşturma:**
1. https://www.qr-code-generator.com/ adresine gidin
2. "Text" seçin
3. `BIOYUNBIKAHVE_CHECKIN` yazın
4. QR kodu indirin ve yazdırın

### Masa QR Kodları (Opsiyonel)
Her masa için: `BIOYUNBIKAHVE_TABLE_1`, `BIOYUNBIKAHVE_TABLE_2`, vb.

## 🔥 Firebase Entegrasyonu (Sonraki Adım)

Firebase kullanarak:
- Kullanıcı girişi (telefon numarası ile)
- Veritabanı (Firestore)
- Push bildirimleri
- Online ödeme

`src/config/config.js` dosyasında Firebase yapılandırması yapılacak.

## 📱 Uygulama Ekranları

1. **Giriş Ekranı** - Telefon numarası ile giriş
2. **Ana Sayfa** - Hizmetlere erişim
3. **QR Tarayıcı** - Check-in için QR okuma
4. **Check-In** - Süre seçimi ve kayıt
5. **Cafe** - Menü ve sipariş
6. **Atölyeler** - Paket satın alma

## 🎯 Gelecek Özellikler

- [ ] Firebase entegrasyonu
- [ ] İşletme admin paneli
- [ ] Push bildirimleri
- [ ] Online ödeme (iyzico/PayTR)
- [ ] Fotoğraf galerisi
- [ ] Sadakat programı
- [ ] Değerlendirme sistemi
- [ ] Çoklu dil desteği

## 📞 İletişim

İşletme: Bi Oyun Bi Kahve
Adres: Çınardere, Pendik, İstanbul
Telefon: [İşletme telefonu]

---

**Geliştirici Notu:** Bu uygulama React Native + Expo ile geliştirilmiştir. Play Store ve App Store'a yüklemek için Expo'nun "EAS Build" servisi kullanılacak.
