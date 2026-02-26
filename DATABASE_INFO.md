# 📊 Bi Oyun Bi Kahve - Veritabanı ve Ölçeklenebilirlik

## 🔍 Şu Anki Durum (Geliştirme Aşaması)

### Veri Saklama: AsyncStorage (Yerel Depolama)
- **Konum**: Telefon hafızası
- **Kapasite**: Sınırsız değil (~6MB)
- **Kullanıcı Limiti**: ~50-100 kullanıcı (pratik limit)
- **Sorunlar**:
  - Uygulama silinirse veriler kaybolur
  - Cihazlar arası senkronizasyon yok
  - Admin paneli sadece bir telefonda çalışır
  - Yedekleme yok

### Mevcut Veri Yapısı
```javascript
AsyncStorage:
├── @user_data          // Giriş yapan kullanıcı
├── @mock_users         // Tüm kullanıcı hesapları
├── @mock_customers     // Müşteri bilgileri
└── @reservations       // Rezervasyonlar
```

---

## 🚀 Gerçek Kullanım İçin: Firebase Entegrasyonu (ÖNERİLEN)

### ✅ Neden Firebase?
- **Ücretsiz Başlangıç**: 10.000 kullanıcıya kadar ücretsiz
- **Gerçek Zamanlı**: Admin panel ve uygulama anlık senkronize
- **Güvenli**: Kimlik doğrulama ve şifreleme
- **Yedekleme**: Otomatik cloud yedekleme
- **Ölçeklenebilir**: 100.000+ kullanıcı destekler

### Firebase Veri Yapısı
```
bioyunbikahve/
├── users/
│   ├── {userId}
│   │   ├── name: "Ayşe Yılmaz"
│   │   ├── email: "ayse@example.com"
│   │   ├── phone: "05001112233"
│   │   ├── role: "customer"
│   │   ├── packages: [...]
│   │   └── loyaltyCard: {...}
│
├── workshops/
│   ├── oyun-grubu/
│   │   ├── maxCapacity: 6
│   │   ├── currentParticipants: 3
│   │   └── participants: ["userId1", "userId2", "userId3"]
│   ├── ingilizce/
│   │   └── ...
│
├── reservations/
│   ├── {reservationId}
│   │   ├── userId: "abc123"
│   │   ├── workshop: "Oyun Grubu"
│   │   ├── date: "2026-02-20"
│   │   ├── time: "14:00"
│   │   └── status: "pending"
│
└── payments/
    ├── {paymentId}
    │   ├── userId: "abc123"
    │   ├── amount: "1.200₺"
    │   ├── packageType: "trial"
    │   └── isPaid: false
```

### Kullanıcı Kapasitesi
| Plan | Kullanıcı | Fiyat/Ay |
|------|-----------|----------|
| Spark (Ücretsiz) | 10.000+ | 0₺ |
| Blaze (Kullandıkça Öde) | Sınırsız | ~$25-100 |

---

## 🔧 Alternatif Çözümler

### 1. **Backend API (Node.js + MongoDB)**
- **Avantaj**: Tam kontrol, özel iş mantığı
- **Dezavantaj**: Sunucu maliyeti, bakım gerektirir
- **Maliyet**: ~$10-50/ay (DigitalOcean, AWS)

### 2. **Supabase (PostgreSQL)**
- **Avantaj**: Firebase alternatifi, SQL veritabanı
- **Dezavantaj**: Biraz daha teknik
- **Maliyet**: İlk 500MB ücretsiz

### 3. **AWS Amplify**
- **Avantaj**: Güçlü, ölçeklenebilir
- **Dezavantaj**: Karmaşık, pahalı olabilir
- **Maliyet**: Kullanıma göre değişir

---

## 📝 Firebase Entegrasyonu İçin Adımlar

### 1. Firebase Projesi Oluşturma
```bash
# Firebase Console: https://console.firebase.google.com
1. "Add project" → Proje adı: "bi-oyun-bi-kahve"
2. Google Analytics'i etkinleştir (opsiyonel)
3. "Add app" → iOS / Android seç
4. Config dosyalarını indir
```

### 2. Gerekli Paketler
```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/firestore
npm install @react-native-firebase/storage
```

### 3. Kod Değişiklikleri
```javascript
// src/context/AuthContext.js
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// AsyncStorage yerine Firestore kullan
const usersRef = firestore().collection('users');
const workshopsRef = firestore().collection('workshops');
```

---

## 🎯 Atölye Kontenjan Sistemi (ŞU AN AKTİF)

### Özellikler
✅ Her atölye 6 kişilik  
✅ Kontenjan göstergesi: "3/6 kişi"  
✅ Dolu olunca "Kontenjan Dolu" uyarısı  
✅ Rezervasyon yapılınca kontenjan artar  

### Admin Tarafında Yönetim
Admin panelinde:
- Atölye kontenjanlarını görüntüleme
- Manuel olarak kontenjan artırma/azaltma
- Katılımcı listesi görüntüleme
- Atölye iptal edilince kontenjan sıfırlama

### Kod Örneği
```javascript
// config.js
workshops: {
  types: [
    {
      name: 'Oyun Grubu',
      maxCapacity: 6,
      currentParticipants: 0, // Admin panel ile güncellenir
    }
  ]
}
```

---

## 💡 Öneriler

### Kısa Vadede (1-2 ay)
1. ✅ AsyncStorage ile devam et (şu anki sistem)
2. ✅ Atölye kontenjan sistemi kullan
3. ⚠️ Düzenli veri yedeği al (export özelliği ekle)

### Orta Vadede (3-6 ay)
1. 🔥 Firebase'e geç (gerçek müşteriler için)
2. 📱 Push notification ekle (atölye hatırlatmaları)
3. 💳 Ödeme entegrasyonu (Iyzico, Stripe)

### Uzun Vadede (6+ ay)
1. 📊 Gelişmiş analitik (hangi atölye popüler)
2. 🤖 Otomatik SMS/email hatırlatmaları
3. 🌐 Web paneli (admin için masaüstü)

---

## 🔐 Güvenlik Notları

### Şu Anki Durum
⚠️ AsyncStorage şifresiz - uygulama root edilirse veriler görülebilir

### Firebase ile
✅ Şifreli iletişim  
✅ Kimlik doğrulama  
✅ Veri erişim kuralları  
✅ Otomatik yedekleme  

---

## 📞 İletişim & Destek

Sorularınız için:
- Email: info@bioyunbikahve.com
- WhatsApp: +905015406516

Firebase entegrasyonu için teknik destek gerekiyorsa bana ulaşın!
