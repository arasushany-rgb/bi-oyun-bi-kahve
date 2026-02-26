# 📱 Bi Oyun Bi Kahve - Build & Deployment Kılavuzu

Bu kılavuz, uygulamanızı **App Store** ve **Play Store**'a yüklemek için gerekli adımları içerir.

---

## 🎯 Gereksinimler

### 1. Genel Gereksinimler
- Node.js 18+ kurulu
- Expo CLI kurulu (`npm install -g expo-cli`)
- EAS CLI kurulu (`npm install -g eas-cli`)
- Expo hesabı ([expo.dev](https://expo.dev))

### 2. iOS Gereksinimleri (App Store)
- Apple Developer hesabı ($99/yıl)
- Mac bilgisayar (veya EAS Build kullanın)
- Xcode kurulu (Mac için)

### 3. Android Gereksinimleri (Play Store)
- Google Play Console hesabı ($25 tek seferlik)
- Android Studio kurulu (isteğe bağlı)

---

## 📋 Hazırlık

### 1. EAS Hesabı Oluşturma
```bash
# EAS CLI'yı kurun (zaten kurulu)
npm install -g eas-cli

# EAS'a giriş yapın
eas login
```

### 2. Projeyi EAS ile Bağlama
```bash
cd "C:\Users\90555\OneDrive\Desktop\Bi Oyun  Bi Kahve"
eas build:configure
```

Bu komut `eas.json` dosyası oluşturacak.

---

## 🍎 iOS Build (App Store)

### Adım 1: Bundle Identifier Kontrolü
`app.json` dosyasında `ios.bundleIdentifier` ayarlandı:
```json
"bundleIdentifier": "com.bioyunbikahve.app"
```

### Adım 2: iOS Build Başlatma
```bash
# Önce geliştirme build'i yapın (test için)
eas build --platform ios --profile development

# Production build (App Store için)
eas build --platform ios --profile production
```

### Adım 3: App Store'a Yükleme
1. Build tamamlandıktan sonra EAS size `.ipa` dosyası verecek
2. Apple Developer Console'a gidin: [developer.apple.com](https://developer.apple.com)
3. App Store Connect'te yeni uygulama oluşturun
4. Bundle ID: `com.bioyunbikahve.app`
5. `.ipa` dosyasını yükleyin veya EAS Submit kullanın:

```bash
eas submit --platform ios
```

---

## 🤖 Android Build (Play Store)

### Adım 1: Package Name Kontrolü
`app.json` dosyasında `android.package` ayarlandı:
```json
"package": "com.bioyunbikahve.app"
```

### Adım 2: Keystore Oluşturma
EAS otomatik keystore oluşturur:
```bash
# Önce geliştirme build'i yapın (test için)
eas build --platform android --profile development

# Production build (Play Store için)
eas build --platform android --profile production
```

### Adım 3: Play Store'a Yükleme
1. Build tamamlandıktan sonra EAS size `.aab` dosyası verecek
2. Google Play Console'a gidin: [play.google.com/console](https://play.google.com/console)
3. Yeni uygulama oluşturun
4. `.aab` dosyasını yükleyin veya EAS Submit kullanın:

```bash
eas submit --platform android
```

---

## 🚀 Hızlı Deployment (Her İki Platform)

```bash
# Tüm platformlar için build yap
eas build --platform all

# Build tamamlandıktan sonra submit et
eas submit --platform ios
eas submit --platform android
```

---

## 📝 Sürüm Güncelleme

Her yeni sürüm için `app.json` dosyasını güncelleyin:

```json
{
  "expo": {
    "version": "1.0.1",  // Sürüm numarasını artırın
    "ios": {
      "buildNumber": "2"  // Build numarasını artırın
    },
    "android": {
      "versionCode": 2     // Version code'u artırın
    }
  }
}
```

Ardından build işlemini tekrarlayın.

---

## 🛠️ Troubleshooting

### Build Hatası: Firebase Bağlantısı
Eğer Firebase ile ilgili hata alırsanız:
1. `src/config/firebase.js` dosyasındaki config'in doğru olduğundan emin olun
2. Firebase Console'da iOS/Android uygulamaları ekleyin

### Keystore Kaybı
EAS keystore'unuzu otomatik yönetir. Eğer manuel keystore kullanıyorsanız:
```bash
eas credentials
```

### Icon/Splash Screen Hataları
Dosyaların doğru boyutta olduğundan emin olun:
- Icon: 1024x1024 PNG
- Splash: 2048x2048 PNG
- Adaptive Icon: 1024x1024 PNG

---

## 📱 Test Builds

### Internal Testing (iOS - TestFlight)
```bash
eas build --platform ios --profile preview
eas submit --platform ios --latest
```

### Internal Testing (Android - Internal Testing Track)
```bash
eas build --platform android --profile preview
eas submit --platform android --latest --track internal
```

---

## ✅ Yayın Öncesi Kontrol Listesi

- [ ] Firebase config ayarları doğru
- [ ] Tüm ekranlar test edildi
- [ ] Admin login çalışıyor
- [ ] Müşteri kayıt/giriş çalışıyor
- [ ] Paket satın alma çalışıyor
- [ ] Rezervasyon sistemi çalışıyor
- [ ] Sadakat kartı çalışıyor
- [ ] Değerlendirme sistemi çalışıyor
- [ ] Icon ve splash screen doğru
- [ ] Privacy Policy ve Terms hazır
- [ ] App Store screenshots hazır (iOS)
- [ ] Play Store screenshots hazır (Android)

---

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- Expo Docs: [docs.expo.dev](https://docs.expo.dev)
- EAS Build Docs: [docs.expo.dev/build/introduction](https://docs.expo.dev/build/introduction)
- Firebase Docs: [firebase.google.com/docs](https://firebase.google.com/docs)

---

## 🎉 İlk Deployment Sonrası

1. **App Store Connect**: Review süresi 1-3 gün
2. **Play Store**: Review süresi birkaç saat - 1 gün
3. Her iki store'da da uygulama açıklaması, screenshot'lar ve metadata ekleyin
4. Privacy Policy URL'si ekleyin
5. Support URL'si ekleyin

**Başarılar! 🚀**
