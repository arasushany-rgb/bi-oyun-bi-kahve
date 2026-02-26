export const config = {
  app: {
    name: 'Bi Oyun Bi Kahve',
    version: '1.0.0',
    slogan: 'Minikler keşfederken, siz kahvenizin tadını çıkarın',
    description: 'Çocuk oyun atölyesi ve cafe - Çınardere, Pendik',
  },
  
  business: {
    name: 'Bi Oyun Bi Kahve',
    address: 'Çınardere, Pendik, İstanbul',
    phone: '+90 501 540 65 16',
    whatsapp: '+905015406516',
    email: 'info@bioyunbikahve.com',
    instagram: '@bioyunbikahve',
    workingHours: {
      weekdays: '11:00 - 21:30',
      weekend: '10:00 - 21:30',
    },
  },
  
  cafe: {
    description: 'Bi Oyun Bi Kahve\'de her şey kendi mutfağımızda el yapımı olarak hazırlanır; hazır ürünlerde ise yalnızca güvenilir ve organik seçenekleri tercih ederiz, çocuklar ve aileler için gönül rahatlığıyla.',
    menu: [
      // Sıcak İçecekler
      { id: '1', name: 'Çay', price: '25₺', category: 'Sıcak İçecek' },
      { id: '2', name: 'Fincan Çay', price: '50₺', category: 'Sıcak İçecek' },
      { id: '3', name: 'Türk Kahvesi', price: '95₺', category: 'Sıcak İçecek' },
      { id: '4', name: 'Double Türk Kahvesi', price: '130₺', category: 'Sıcak İçecek' },
      { id: '5', name: 'Filtre Kahve', price: '130₺', category: 'Sıcak İçecek' },
      { id: '6', name: 'Filtre Kahve Süt İlave', price: '140₺', category: 'Sıcak İçecek' },
      { id: '7', name: 'Espresso', price: '65₺', category: 'Sıcak İçecek' },
      { id: '8', name: 'Americano', price: '75₺', category: 'Sıcak İçecek' },
      { id: '9', name: 'Cappuccino', price: '85₺', category: 'Sıcak İçecek' },
      { id: '10', name: 'Latte', price: '90₺', category: 'Sıcak İçecek' },
      { id: '11', name: 'Mocha', price: '95₺', category: 'Sıcak İçecek' },
      { id: '12', name: 'Sıcak Çikolata', price: '80₺', category: 'Sıcak İçecek' },
      { id: '13', name: 'Bitki Çayı', price: '45₺', category: 'Sıcak İçecek' },
      { id: '14', name: 'Salep', price: '70₺', category: 'Sıcak İçecek' },
      // Soğuk İçecekler
      { id: '15', name: 'Ice Latte', price: '140₺', category: 'Soğuk İçecek' },
      { id: '16', name: 'Çikolatalı Ice Latte', price: '155₺', category: 'Soğuk İçecek' },
      { id: '17', name: 'Ice Americano', price: '140₺', category: 'Soğuk İçecek' },
      { id: '18', name: 'Sıkma Portakal Suyu', price: '140₺', category: 'Soğuk İçecek' },
      { id: '19', name: 'Cold Brew', price: '150₺', category: 'Soğuk İçecek' },
      { id: '20', name: 'Çilekli Smoothie', price: '150₺', category: 'Soğuk İçecek' },
      { id: '21', name: 'Muzlu Smoothie', price: '150₺', category: 'Soğuk İçecek' },
      { id: '22', name: 'Limonata', price: '80₺', category: 'Soğuk İçecek' },
      { id: '23', name: 'Frozen', price: '120₺', category: 'Soğuk İçecek' },
      { id: '24', name: 'Milkshake', price: '130₺', category: 'Soğuk İçecek' },
      { id: '25', name: 'Churchill', price: '50₺', category: 'Soğuk İçecek' },
      { id: '26', name: 'Ayran', price: '45₺', category: 'Soğuk İçecek' },
      { id: '27', name: 'Kola', price: '60₺', category: 'Soğuk İçecek' },
      { id: '28', name: 'Su', price: '25₺', category: 'Soğuk İçecek' },
      // Kahvaltı
      { id: '29', name: 'Serpme Kahvaltı', price: '250₺', category: 'Kahvaltı' },
      { id: '30', name: 'Menemen', price: '120₺', category: 'Kahvaltı' },
      { id: '31', name: 'Sucuklu Yumurta', price: '130₺', category: 'Kahvaltı' },
      { id: '32', name: 'Omlet', price: '100₺', category: 'Kahvaltı' },
      // Tost
      { id: '33', name: 'Kaşarlı Tost', price: '80₺', category: 'Tost' },
      { id: '34', name: 'Karışık Tost', price: '90₺', category: 'Tost' },
      { id: '35', name: 'Sucuklu Tost', price: '100₺', category: 'Tost' },
      // Börek
      { id: '36', name: 'Su Böreği', price: '110₺', category: 'Börek' },
      { id: '37', name: 'Kol Böreği', price: '90₺', category: 'Börek' },
      { id: '38', name: 'Poğaça', price: '60₺', category: 'Börek' },
      // Tatlı
      { id: '39', name: 'Cheesecake', price: '110₺', category: 'Tatlı' },
      { id: '40', name: 'Brownie', price: '80₺', category: 'Tatlı' },
      { id: '41', name: 'Kek Dilimi', price: '90₺', category: 'Tatlı' },
      { id: '42', name: 'Waffle', price: '130₺', category: 'Tatlı' },
      { id: '43', name: 'Pankek', price: '120₺', category: 'Tatlı' },
      // Yemek
      { id: '44', name: 'Tavuk Şinitzel', price: '160₺', category: 'Yemek' },
      { id: '45', name: 'Izgara Köfte', price: '180₺', category: 'Yemek' },
      { id: '46', name: 'Tavuk But', price: '150₺', category: 'Yemek' },
      // Makarna
      { id: '47', name: 'Domates Soslu Makarna', price: '110₺', category: 'Makarna' },
      { id: '48', name: 'Köri Soslu Makarna', price: '120₺', category: 'Makarna' },
      { id: '49', name: 'Kremalı Makarna', price: '130₺', category: 'Makarna' },
    ],
  },

  playArea: {
    description: 'Oyun ablası eşliğinde güvenli ve eğlenceli oyun alanı. Tamamı ahşap oyuncaklardan oluşan serbest oyun alanı!',
    features: [
      'Oyun Ablası Gözetimi',
      'Ahşap Oyuncaklar',
      'Güvenli Oyun Malzemeleri',
      'Yaşa Uygun Aktiviteler',
      'Hijyenik Ortam',
    ],
    hourlyRate: 350,
    packages: [
      { hours: 0.5, price: '200₺', name: '30 Dakika Oyun' },
      { hours: 1, price: '350₺', name: '1 Saat Oyun' },
      { hours: '2-5', price: '550₺', name: '2-5 Saat Oyun' },
    ],
    contactForPackages: 'Oyun alanı paketleri ve kardeş indirimi için iletişime geçiniz',
  },
  
  workshops: {
    description: 'Yaş gruplarına göre atölye programlarımız oluyor. İlk 1 saat eğitmen eşliğinde oyun grubu, ikinci saat serbest oyun alanında özgür zaman!',
    
    program: {
      firstHour: 'Eğitmen Eşliğinde Oyun Grubu:\n• Şarkı & ritim çalışmaları\n• Duyusal oyun etkinlikleri\n• Motor becerilerini destekleyen aktiviteler',
      secondHour: 'Tamamı ahşap oyuncaklardan oluşan serbest oyun alanında özgür zaman!',
      bonus: '1 saat atölyeden sonra 1 saat serbest oyun alanımız hediye!\nAyrıca Türk kahve ikramımız oluyor atölye katılımlarında ☕',
    },
    
    packages: [
      { 
        id: 'trial', 
        count: 1, 
        price: '1.200₺', 
        name: 'Tek Katılım',
        description: 'Bir atölyeye katılım hakkı + 1 saat serbest oyun hediye + Türk kahve ikramı'
      },
      { 
        id: 'w4', 
        count: 4, 
        price: '4.400₺', 
        name: '4 Katılımlı Paket',
        description: '4 farklı atölyeye katılım hakkı + hediyeler'
      },
      { 
        id: 'w8', 
        count: 8, 
        price: '7.600₺', 
        name: '8 Katılımlı Paket',
        description: '8 farklı atölyeye katılım hakkı + hediyeler'
      },
      { 
        id: 'w12', 
        count: 12, 
        price: '9.600₺', 
        name: '12 Katılımlı Paket',
        description: '12 farklı atölyeye katılım hakkı + hediyeler'
      },
      { 
        id: 'w18', 
        count: 18, 
        price: '12.600₺', 
        name: '18 Katılımlı Paket',
        description: '18 farklı atölyeye katılım hakkı + hediyeler'
      },
    ],
    
    types: [
      {
        name: 'Oyun Grubu',
        icon: '🎪',
        description: 'Sosyal beceriler geliştiren grup oyunları ve aktiviteler',
        ageRange: '18-24 ay\n24-36 ay\n3-6 yaş',
        duration: '1 saat',
        bonus: '1 saat oyun alanı + Türk kahvesi ikramı',
        maxCapacity: 6,
        currentParticipants: 0,
      },
      {
        name: 'İngilizce Atölyesi',
        icon: '📝',
        description: 'Oyun ve aktivitelerle eğlenceli İngilizce öğrenimi',
        ageRange: '24-36 ay\n3-6 yaş',
        duration: '1 saat',
        bonus: '1 saat oyun alanı + Türk kahvesi ikramı',
        maxCapacity: 6,
        currentParticipants: 0,
      },
      {
        name: 'Değerler Eğitimi Atölyesi',
        icon: '💝',
        description: 'Paylaşma, saygı, empati gibi değerleri öğreten aktiviteler',
        ageRange: '3-6 yaş',
        duration: '1 saat',
        bonus: '1 saat oyun alanı + Türk kahvesi ikramı',
        maxCapacity: 6,
        currentParticipants: 0,
      },
    ],
    note: 'Bu atölyelerin temaları Instagram sayfamızda paylaşılır: @bioyunbikahve',
  },
  
  birthday: {
    description: 'En özel günlerinizi unutulmaz kılmak için sizi işletmemizde bekliyoruz. Hem çocuklar hem de yetişkinler için keyif dolu bir doğum günü deneyimi sunuyoruz!',
    
    concept1: {
      name: 'Temel Paket',
      features: [
        '2 saat boyunca size özel alan kullanımı',
        '35 kişiye kadar misafir kapasitesi (çocuk ve yetişkin dahil)',
        'Her 1 kişi fazlalığı için 300₺',
        'Sınırsız çay ikramı + 1 çeşit kurabiye',
        'Çocuklara özel oyun alanı',
        'Renkli, eğlenceli ve güvenli bir ortam',
      ],
      extras: 'Dilerseniz süsleme, atölye veya ek ikram seçenekleriyle paketinizi zenginleştirebiliriz!',
      prices: {
        weekday: '12.000₺',
        weekend: '15.000₺',
      },
    },
    
    concept2: {
      name: 'Premium Paket - Tüm Konsept Bizden',
      subtitle: 'Kutlamanızın her detayıyla biz ilgileniyoruz — siz sadece pastanızı getirin!',
      features: [
        'Maket pasta',
        'Masa düzeni',
        '6 çeşit ikram',
        'Arka plan süslemesi + masa süslemeleri',
        '35 kişi kapasite',
        'Oyun ablası',
      ],
      menu: {
        salads: ['Havuç tarator', 'Hardallı patates salatası', 'Köz patlıcan salatası'],
        mains: ['Börek ya da poğaça', 'Yaprak sarma veya kuru dolma', 'Çocuklara makarna ve köfte'],
        drinks: ['Çay', 'Meyve suyu'],
      },
      price: '30.000₺',
    },
  },

  loyaltyCard: {
    maxStamps: 9,
    reward: 'Serbest oyun alanında 1 saat ücretsiz giriş hakkı',
    description: '9 damga topla, 1 saat oyun alanı hediye kazan!',
  },
};

export default config;
