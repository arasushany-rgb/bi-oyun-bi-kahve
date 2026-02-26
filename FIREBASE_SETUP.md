# Firebase Kurulum Adımları

## 1. Firebase Console'da Proje Oluştur

1. **Firebase Console'a git:** https://console.firebase.google.com/
2. **"Add project" (Proje Ekle)** butonuna tıkla
3. **Proje adı:** `bi-oyun-bi-kahve`
4. **Google Analytics:** İstersen aktif et (tercihe bağlı)
5. **"Create project"** butonuna tıkla

---

## 2. Web App Ekle

1. Proje oluşturulunca **"Add app"** → **Web (</> ikonu)** seç
2. **App nickname:** `Bi Oyun Bi Kahve Web`
3. **Firebase Hosting:** Şimdilik kapat (isteğe bağlı)
4. **"Register app"** tıkla
5. **Firebase Config bilgilerini kopyala:**

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

6. Bu bilgileri `src/config/firebase.js` dosyasına yapıştır

---

## 3. Authentication Aktif Et

1. Sol menüden **"Authentication"** seç
2. **"Get started"** butonuna tıkla
3. **Sign-in method** sekmesine git
4. **"Email/Password"** seç ve aktif et
5. **"Save"** butonuna bas

---

## 4. Firestore Database Oluştur

1. Sol menüden **"Firestore Database"** seç
2. **"Create database"** butonuna tıkla
3. **Mode:** **"Start in test mode"** seç (geliştirme için)
4. **Location:** En yakın bölgeyi seç (europe-west)
5. **"Enable"** butonuna bas

### Security Rules (Test İçin):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Test için - Sonra güncellenecek
    }
  }
}
```

---

## 5. Storage Aktif Et

1. Sol menüden **"Storage"** seç
2. **"Get started"** butonuna tıkla
3. **"Start in test mode"** seç
4. **Location:** Firestore ile aynı bölgeyi seç
5. **"Done"** butonuna bas

### Storage Rules (Test İçin):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // Test için - Sonra güncellenecek
    }
  }
}
```

---

## 6. Firestore Collections Yapısı

### `users` Collection:
```javascript
{
  uid: "user123",
  email: "ayse@example.com",
  name: "Ayşe Yılmaz",
  phone: "+905551234567",
  childName: "Zeynep Yılmaz",
  role: "customer", // "customer" veya "admin"
  registrationDate: "22.02.2026",
  loyaltyCard: {
    stamps: 5,
    maxStamps: 9,
    freeEntries: 0,
    redemptionCode: null
  },
  createdAt: timestamp
}
```

### `packages` Collection:
```javascript
{
  userId: "user123",
  type: "8li",
  name: "8 Katılımlı Paket",
  total: 8,
  used: 2,
  remaining: 6,
  price: "6.000₺",
  isPaid: true,
  purchaseDate: "10.01.2026",
  createdAt: timestamp
}
```

### `reservations` Collection:
```javascript
{
  userId: "user123",
  userName: "Ayşe Yılmaz",
  workshopName: "İngilizce Atölyesi",
  date: "2026-02-24",
  time: "14:00-15:00",
  status: "pending", // "pending", "completed", "cancelled"
  isPaid: true,
  createdAt: timestamp
}
```

### `workshops` Collection:
```javascript
{
  name: "İngilizce Atölyesi",
  description: "Çocuklar için eğlenceli İngilizce öğrenimi",
  icon: "🇬🇧",
  ageRange: "4-7 yaş",
  duration: "1 saat",
  maxCapacity: 8,
  currentParticipants: 3,
  imageUrl: "https://firebasestorage.googleapis.com/...",
  bonus: "Her atölyede sürpriz hediye!",
  price: "Paket dahilinde",
  createdAt: timestamp
}
```

### `cafe_menu` Collection:
```javascript
{
  name: "Cappuccino",
  category: "Sıcak İçecekler",
  price: "85₺",
  description: "İtalyan usulü cappuccino",
  imageUrl: "https://firebasestorage.googleapis.com/...",
  available: true,
  createdAt: timestamp
}
```

---

## 7. Config Bilgilerini Güncelle

1. Firebase Console'dan aldığın config bilgilerini kopyala
2. `src/config/firebase.js` dosyasını aç
3. Placeholder değerleri gerçek değerlerle değiştir

---

## 8. Test Et

```bash
npx expo start
```

Uygulamayı başlat ve kayıt/giriş yap. Firestore Console'dan verileri kontrol et.

---

## ÖNEMLİ GÜVENLİK NOTLARI

⚠️ **Production öncesi mutlaka yap:**

1. **Firestore Rules güncelle:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kullanıcılar sadece kendi verilerini okuyabilir
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin tüm verilere erişebilir
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

2. **Storage Rules güncelle:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Herkes okuyabilir, sadece admin yükleyebilir
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. **API Key'leri gizle:**
   - `.env` dosyası kullan
   - `.gitignore`'a ekle
   - Asla GitHub'a yükleme

---

## Yardım

Sorun yaşarsan:
- Firebase Console logs kontrol et
- Expo terminal'de hata mesajlarına bak
- Firebase docs: https://firebase.google.com/docs
