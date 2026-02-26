# Sadakat Kartı Kod Sistemi Test Kılavuzu

## Sistem Açıklaması

Sadakat kartı sistemi, müşterilerin 9 damga topladığında otomatik olarak 6 haneli bir kullanım kodu üretir. Bu kod ile müşteri ücretsiz giriş hakkı kazanır.

## Test Adımları

### 1. Müşteri Oluşturma (Zaten Var)

Test için kullanılabilecek mock kullanıcılar:

- **E-posta:** ayse@example.com  
  **Şifre:** 123456  
  **Mevcut Damga:** 2

- **E-posta:** mehmet@example.com  
  **Şifre:** 123456  
  **Mevcut Damga:** 5

- **E-posta:** test@example.com  
  **Şifre:** test123  
  **Mevcut Damga:** 0

### 2. Damga Ekleme ve Kod Üretme

#### Adım 1: Müşteri ile Giriş Yapın
1. Uygulamayı başlatın
2. "Keşfet" butonuna tıklayın
3. "Giriş Yap" butonuna tıklayın
4. Test kullanıcı bilgilerini girin (örn: `ayse@example.com` / `123456`)

#### Adım 2: Mevcut Damga Durumunu Kontrol Edin
1. Giriş yaptıktan sonra otomatik olarak **Profil** ekranına yönlendirilirsiniz
2. "Sadakat Kartı" bölümünde mevcut damga sayısını görebilirsiniz
3. Örnek: "2/9 Damga" şeklinde görünür

#### Adım 3: Admin ile Giriş Yapın ve Damga Ekleyin
1. Çıkış yapın (Profil > Çıkış)
2. Giriş ekranına geri dönün
3. Admin bilgileri ile giriş yapın:
   - **E-posta:** admin@bioyunbikahve.com
   - **Şifre:** admin123
4. **Admin Dashboard** açılır
5. **"👥 Müşteriler"** sekmesine tıklayın
6. Arama kutusuna müşteri adını yazın (örn: "Ayşe")
7. Müşteri kartına tıklayın → **Detay** ekranı açılır

#### Adım 4: 9 Damga Tamamlayın
1. **"Damga Ekle"** butonuna tıklayın
2. Her tıklamada damga sayısı artar
3. **ÖNEMLİ:** 9. damgayı eklediğinizde:
   - Ekranda **havai fişek animasyonu** görünür
   - "🎉 9 damga tamamlandı! Ücretsiz giriş hakkı kazandınız!" mesajı çıkar
   - Otomatik olarak 6 haneli kod üretilir (örn: `472856`)

### 3. Kod Görüntüleme (Müşteri Tarafı)

#### Müşteri Profilinde Kod Gösterimi:
1. Çıkış yapın (Admin > Çıkış)
2. Müşteri hesabı ile tekrar giriş yapın (`ayse@example.com` / `123456`)
3. **Profil** ekranına gidin
4. **"Sadakat Kartı"** bölümünde:
   - "🎉 1 Ücretsiz Giriş Hakkınız Var!" yazısını göreceksiniz
   - Altında **"Kullanım Kodunuz:"** bölümünde 6 haneli kod görünür
   - Örnek: `472856`
   - Altında uyarı: "⚠️ Bu kodu gelişinizde personele söyleyin"

### 4. Kod Kullanma (Admin Tarafı)

#### Admin Panelinde Kod Girme:
1. Çıkış yapın
2. Admin hesabı ile giriş yapın
3. **Admin Dashboard** > **"👥 Müşteriler"**
4. Müşteri kartına tıklayın (Ayşe Yılmaz)
5. **"🎉 1 Ücretsiz Giriş Hakkı"** bölümünü bulun
6. **"Müşterinin Kullanım Kodu:"** alanına kodu girin:
   - Müşterinin size söylediği 6 haneli kodu yazın (örn: `472856`)
7. **"Kodu Kullan"** butonuna tıklayın

#### Başarılı Kullanım:
- "Başarılı! 🎉 Ücretsiz giriş hakkı kullanıldı ve kod silindi" mesajı çıkar
- Ücretsiz giriş hakkı 1'den 0'a düşer
- Kod silinir (artık görünmez)
- Damga sayısı 0'a sıfırlanır

#### Hatalı Kod:
- Yanlış kod girerseniz: "Hata - Kod yanlış!" mesajı çıkar
- Kod tekrar denenebilir

### 5. Test Senaryoları

#### Senaryo 1: Sıfırdan 9 Damga Toplama
1. `test@example.com` kullanıcısı ile giriş yapın (0 damga)
2. Admin olarak giriş yapın
3. Test kullanıcısına 9 kez damga ekleyin
4. 9. damgada kod üretildiğini kontrol edin
5. Test kullanıcısı ile giriş yapıp kodu görebildiğinizi kontrol edin

#### Senaryo 2: Kısmi Damga ile Başlama
1. `ayse@example.com` kullanıcısı ile giriş yapın (2 damga)
2. Admin olarak 7 kez daha damga ekleyin (toplam 9)
3. Kod üretildiğini kontrol edin

#### Senaryo 3: Kod Kullanma ve Yeniden Başlama
1. Kod üretilmiş bir kullanıcı seçin
2. Admin olarak kodu kullanın
3. Kullanıcı profilinde:
   - Ücretsiz giriş hakkı: 0
   - Kod: Yok
   - Damga: 0/9
4. Yeniden damga eklemeye başlayın

#### Senaryo 4: Yanlış Kod Testi
1. Kod üretilmiş bir kullanıcı seçin
2. Admin panelinde yanlış kod girin (örn: `111111`)
3. "Kod yanlış!" hatası aldığınızı kontrol edin
4. Doğru kodu girin
5. Başarılı olduğunu kontrol edin

## Kod Sistemi Özellikleri

### Kod Üretimi:
- **Format:** 6 haneli sayı (örn: `472856`)
- **Üretim Zamanı:** 9. damga eklendiğinde otomatik
- **Benzersizlik:** Her müşteri için farklı rastgele kod
- **Saklama:** `AuthContext` > `MOCK_USERS` > `loyaltyCard.redemptionCode`

### Kod Doğrulama:
- **Fonksiyon:** `redeemFreeEntryWithCode(customerEmail, code)`
- **Kontroller:**
  1. Kullanıcı var mı?
  2. Geçerli kod var mı?
  3. Kod doğru mu?
  4. Ücretsiz hak var mı?
- **Başarılı Kullanım:**
  - Ücretsiz giriş hakkı -1
  - Kod silinir (`null`)
  - Damga 0'a sıfırlanır

### Kod Görüntüleme:
- **Müşteri Profili:**
  - Kod büyük, kırmızı, dikkat çekici
  - Letter-spacing: 4 (okunabilirlik)
  - Uyarı mesajı ile birlikte
- **Admin Paneli:**
  - Kod girme alanı (6 hane)
  - "Kodu Kullan" butonu
  - Başarı/Hata mesajları

## Sorun Giderme

### Problem: Kod üretilmedi
- **Çözüm:** 9. damgaya kadar tıkladığınızdan emin olun. Her tıklamada damga sayısını kontrol edin.

### Problem: Kod görünmüyor
- **Müşteri Tarafı:** Sadakat kartı bölümünde "Ücretsiz Giriş Hakkınız Var" yazısını görüyor musunuz?
- **Admin Tarafı:** Customer Detail ekranında ücretsiz giriş hakkı 1 veya daha fazla mı?

### Problem: Kod çalışmıyor
- **Kontrol 1:** Kodu doğru girdiniz mi? (6 hane, boşluk yok)
- **Kontrol 2:** Müşterinin gerçekten ücretsiz giriş hakkı var mı?
- **Kontrol 3:** Doğru müşteri seçildi mi?

## Notlar

- **Mock Data:** Sistem şu an mock data kullanıyor, gerçek database bağlanmadı
- **Kod Süresi:** Kodun son kullanma tarihi yok (istendğinde eklenebilir)
- **Güvenlik:** Kod 6 haneli rastgele, tahmin edilmesi zor
- **Test Ortamı:** Tüm veriler uygulama yeniden başlatıldığında sıfırlanır

---

**Son Güncelleme:** 22 Şubat 2026
