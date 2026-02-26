# 🎨 Bi Oyun Bi Kahve - Gelişmiş Admin Paneli

## 🚀 Admin Paneline Giriş

### Giriş Bilgileri
```
Email: admin@bioyunbikahve.com
Şifre: admin123
```

### Adımlar:
1. Uygulamayı açın
2. "Giriş Yap" butonuna tıklayın
3. Admin bilgilerini girin
4. Otomatik olarak Admin Paneline yönlendirileceksiniz

---

## ⚙️ Admin Paneli Özellikleri

### 1. Ana Dashboard (AdminDashboardScreen)
📊 **İstatistikler:**
- Toplam müşteri sayısı
- Ödeme yapan müşteriler
- Bekleyen ödemeler
- Toplam gelir

👥 **Müşteri Yönetimi:**
- Tüm müşterileri görüntüleme
- Paket bilgilerini görme
- Ödeme durumunu değiştirme (ON/OFF toggle)
- Kalan hak düzenleme
- Müşteri detaylarını görüntüleme

📅 **Rezervasyon Yönetimi:**
- Tüm rezervasyonları listeleme
- Rezervasyon detayları (müşteri, atölye, tarih, saat)
- Katılımı işaretleme (hak otomatik azalır)
- Bekleyen/tamamlanan rezervasyonlar

### 2. Gelişmiş Ayarlar Paneli (AdminSettingsScreen) ⭐ YENİ!

#### 🏢 İşletme Bilgileri Sekmesi
Düzenlenebilir Alanlar:
- ✏️ İşletme adı
- 📍 Adres
- ☎️ Telefon numarası
- 📱 WhatsApp numarası
- ✉️ Email adresi
- 📸 Instagram hesabı
- 🕐 Çalışma saatleri:
  - Hafta içi açılış/kapanış
  - Hafta sonu açılış/kapanış

#### 📱 Uygulama Ayarları Sekmesi
Düzenlenebilir Alanlar:
- ✏️ Uygulama adı
- 💬 Slogan metni
- 📝 Uygulama açıklaması
- ☕ Kafe açıklaması

#### 🎨 Atölyeler Sekmesi

**Paket Fiyatları:**
- Tek Katılım (1.200₺)
- 4 Katılımlı Paket (4.400₺)
- 8 Katılımlı Paket (7.600₺)
- 12 Katılımlı Paket (9.600₺)
- 18 Katılımlı Paket (12.600₺)

Her paket için:
- 💰 Fiyat düzenleme
- 📝 Açıklama metni

**Atölye Kontenjanları:**
Her atölye için:
- 👥 Mevcut katılımcı sayısı
- 📊 Maksimum kapasite
- Gerçek zamanlı kontenjan göstergesi

Atölyeler:
- 🎪 Oyun Grubu
- 📝 İngilizce Atölyesi
- 💝 Değerler Eğitimi Atölyesi

#### 💰 Fiyatlar Sekmesi

**Doğum Günü Paketleri:**
- Temel Paket:
  - Hafta içi fiyat
  - Hafta sonu fiyat
- Premium Paket:
  - Tek fiyat

**Oyun Alanı Fiyatları:**
- Saatlik ücret
- 30 dakika paketi
- 1 saat paketi
- 2-5 saat paketi

---

## 🎯 Kullanım Senaryoları

### Senaryo 1: Fiyat Güncelleme
1. Admin paneline giriş yapın
2. Sağ üstteki "⚙️ Ayarlar" butonuna tıklayın
3. "Fiyatlar" sekmesine geçin
4. İstediğiniz fiyatı değiştirin
5. Sağ üstten "Kaydet" butonuna basın
6. Uygulamayı yeniden başlatın

### Senaryo 2: Atölye Kontenjanı Düzenleme
1. Ayarlar → Atölyeler sekmesi
2. İlgili atölyenin kontenjan bilgilerini düzenleyin
3. Mevcut katılımcı sayısını güncelleyin
4. Kaydet butonuna basın
5. Uygulama artık güncel kontenjanı gösterecek

### Senaryo 3: İletişim Bilgilerini Güncelleme
1. Ayarlar → İşletme sekmesi
2. Telefon, adres, email vb. düzenleyin
3. Kaydedin
4. Tüm ekranlarda otomatik güncellenecek

### Senaryo 4: Müşteri Paket Onayı
1. Ana Dashboard
2. Müşteriler listesinden müşteriyi bulun
3. Ödeme durumu toggle'ını açın (yeşil)
4. Müşteri artık paketini kullanabilir

### Senaryo 5: Rezervasyon Onaylama
1. Ana Dashboard → Rezervasyonlar bölümü
2. İlgili rezervasyonu bulun
3. "✅ Katıldı" butonuna basın
4. Müşterinin kalan hakkı otomatik azalır
5. Rezervasyon tamamlandı olarak işaretlenir

---

## 📊 Veri Yönetimi

### Şu Anki Durum
- **Depolama**: AsyncStorage (telefon hafızası)
- **Sınırlama**: ~50-100 kullanıcı
- **Güncelleme**: Manuel (admin panelinden)

### Değişiklikler Nasıl Kaydedilir?
1. Admin Settings'te değişiklik yapın
2. "Kaydet" butonuna basın
3. AsyncStorage'a yazılır
4. Uygulama yeniden başlatılınca aktif olur

### Veri Yedeği Alma (Öneri)
Şu an otomatik yedek yok. Gelecekte eklenebilir:
- Export butonu (JSON formatında)
- Firebase sync
- Cloud backup

---

## 🔐 Güvenlik

### Admin Yetkisi
- Sadece `role: 'admin'` olan kullanıcı erişebilir
- Normal müşteriler admin panelini göremez
- Giriş yapmadan admin paneli erişilemez

### Veri Koruması
⚠️ **DİKKAT**: AsyncStorage şifresiz
- Root edilmiş cihazlarda veriler görülebilir
- Gerçek kullanım için Firebase önerilir
- Hassas bilgiler (ödeme detayları) local'de saklanmamalı

---

## 🚨 Sorun Giderme

### Değişiklikler Görünmüyor
**Çözüm**: Uygulamayı tamamen kapatıp yeniden açın
```bash
# Metro bundler'ı durdurun
Ctrl + C

# Cache'i temizleyin
npx expo start --clear
```

### Admin Paneline Giremiyorum
**Kontroller**:
1. Email doğru mu? `admin@bioyunbikahve.com`
2. Şifre doğru mu? `admin123`
3. Giriş yaptıktan sonra otomatik yönlendirme olmalı

### Kaydet Butonu Pasif
**Sebep**: Hiçbir değişiklik yapmadınız
**Çözüm**: Herhangi bir alanı düzenleyin, buton aktif olacak

### Kontenjan Güncellenmedi
**Sebep**: Config dosyası henüz yenilenmedi
**Çözüm**: 
1. Uygulamayı tamamen kapat
2. Metro bundler'ı restart et
3. Uygulamayı yeniden aç

---

## 📝 Teknik Detaylar

### Dosya Yapısı
```
src/
├── screens/
│   └── Admin/
│       ├── AdminDashboardScreen.js    // Ana yönetim paneli
│       └── AdminSettingsScreen.js      // Gelişmiş ayarlar (YENİ)
├── config/
│   └── config.js                       // Tüm ayarlar burada
├── context/
│   └── AuthContext.js                  // Kullanıcı yönetimi
└── navigation/
    └── AppNavigator.js                 // Rota tanımları
```

### Teknolojiler
- React Native (Expo)
- AsyncStorage (local storage)
- React Navigation
- LinearGradient (UI)

### Geliştirme Notları
```javascript
// config.js - Tüm uygulama ayarları
export const config = {
  app: { ... },
  business: { ... },
  cafe: { ... },
  workshops: {
    packages: [...],
    types: [
      {
        maxCapacity: 6,           // Admin'den değiştirilebilir
        currentParticipants: 0,   // Admin'den güncellenir
      }
    ]
  },
  birthday: { ... },
  playArea: { ... },
};

// AsyncStorage'da saklanır:
await AsyncStorage.setItem('app_config', JSON.stringify(config));
```

---

## 🎯 Gelecek Geliştirmeler

### Yakında Eklenebilecekler:
- 📤 **Export/Import**: Config'i JSON olarak indir/yükle
- 📊 **Gelişmiş Analitik**: Haftalık/aylık raporlar
- 📱 **Push Notification**: Yeni rezervasyon bildirimi
- 💳 **Ödeme Entegrasyonu**: Iyzico/Stripe
- 🔔 **SMS/Email**: Otomatik hatırlatmalar
- 📷 **Görsel Yönetimi**: Logo/fotoğraf değiştirme
- 🌐 **Web Panel**: Masaüstü admin arayüzü
- 🔥 **Firebase Sync**: Gerçek zamanlı senkronizasyon

### Orta Vade:
- Multi-admin desteği
- Rol tabanlı yetkiler
- Aktivite log'ları
- Veri şifreleme

---

## 📞 Destek

Sorularınız için:
- 📧 Email: info@bioyunbikahve.com
- 📱 WhatsApp: +905015406516
- 📸 Instagram: @bioyunbikahve

---

## ✅ Özet Checklist

Admin olarak yapabilecekleriniz:

**Müşteri Yönetimi:**
- [x] Müşteri listesini görme
- [x] Paket bilgilerini görme
- [x] Ödeme durumu güncelleme
- [x] Kalan hak düzenleme

**Rezervasyon Yönetimi:**
- [x] Rezervasyonları listeleme
- [x] Katılım onaylama
- [x] Hak otomatik azaltma

**Ayarlar Yönetimi:**
- [x] İletişim bilgileri değiştirme
- [x] Çalışma saatleri güncelleme
- [x] Fiyatları değiştirme
- [x] Paket açıklamalarını düzenleme
- [x] Atölye kontenjanlarını yönetme
- [x] Uygulama metinlerini değiştirme

**Sistem:**
- [x] Güvenli giriş/çıkış
- [x] Değişiklikleri kaydetme
- [x] İstatistik görüntüleme

---

🎉 **Tebrikler!** Artık işletmenizi tamamen kontrol edebilirsiniz!
