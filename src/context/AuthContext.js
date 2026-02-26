import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  getDocs, 
  updateDoc,
  arrayUnion,
  addDoc
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { config } from '../config/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Admin hesabı (sabit)
const ADMIN_EMAIL = 'admin@bioyunbikahve.com';
const ADMIN_PASSWORD = 'admin123';

// Mock workshop tarihleri (daha sonra Firebase'e taşınabilir)
const DEFAULT_WORKSHOP_SCHEDULE = {
  'Pazartesi': [
    { 
      id: 'mon-1', 
      workshop: 'İngilizce Atölyesi', 
      time: '10:00-11:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
    { 
      id: 'mon-2', 
      workshop: 'Müzik Atölyesi', 
      time: '14:00-15:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
  ],
  'Salı': [
    { 
      id: 'tue-1', 
      workshop: 'Drama Atölyesi', 
      time: '11:00-12:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
    { 
      id: 'tue-2', 
      workshop: 'Motor Beceriler', 
      time: '15:00-16:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
  ],
  'Çarşamba': [
    { 
      id: 'wed-1', 
      workshop: 'Değerler Eğitimi', 
      time: '10:00-11:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
    { 
      id: 'wed-2', 
      workshop: 'Müzik Atölyesi', 
      time: '13:00-14:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
  ],
  'Perşembe': [
    { 
      id: 'thu-1', 
      workshop: 'Motor Beceriler', 
      time: '11:00-12:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
    { 
      id: 'thu-2', 
      workshop: 'Drama Atölyesi', 
      time: '14:00-15:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
  ],
  'Cuma': [
    { 
      id: 'fri-1', 
      workshop: 'Değerler Eğitimi', 
      time: '10:00-11:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
    { 
      id: 'fri-2', 
      workshop: 'İngilizce Atölyesi', 
      time: '14:00-15:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
  ],
  'Cumartesi': [
    { 
      id: 'sat-1', 
      workshop: 'Motor Beceriler', 
      time: '10:00-11:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
    { 
      id: 'sat-2', 
      workshop: 'Müzik Atölyesi', 
      time: '14:00-15:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
  ],
  'Pazar': [
    { 
      id: 'sun-1', 
      workshop: 'İngilizce Atölyesi', 
      time: '11:00-12:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
    { 
      id: 'sun-2', 
      workshop: 'Drama Atölyesi', 
      time: '15:00-16:00', 
      capacity: 6, 
      enrolled: 0,
      participants: []
    },
  ],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workshopDates, setWorkshopDates] = useState([
    '15 Mart 2026',
    '22 Mart 2026',
    '29 Mart 2026',
    '5 Nisan 2026',
  ]);

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firestore'dan kullanıcı verilerini al
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDoc.data(),
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Kayıt ol
  const register = async (email, password, name, phone, childName = '') => {
    try {
      // Firebase Auth'da kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const today = new Date();
      const registrationDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;

      // Firestore'da kullanıcı verilerini sakla
      const userData = {
        email,
        name,
        phone,
        childName: childName || '',
        role: 'customer',
        registrationDate,
        loyaltyCard: {
          stamps: 0,
          maxStamps: 9,
          freeEntries: 0,
          redemptionCode: null,
        },
        packages: [],
        reservations: [],
        birthdayPackages: [],
        workshopHistory: [],
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      setUser({
        uid: firebaseUser.uid,
        ...userData,
      });

      return { success: true };
    } catch (error) {
      let errorMessage = 'Kayıt başarısız';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu email zaten kayıtlı';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Şifre en az 6 karakter olmalı';
      }
      return { success: false, error: errorMessage };
    }
  };

  // Giriş yap
  const login = async (email, password) => {
    try {
      // Admin girişi kontrolü
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setUser({
          email: ADMIN_EMAIL,
          name: 'Admin',
          role: 'admin',
        });
        return { success: true };
      }

      // Firebase Auth ile giriş
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Firestore'dan kullanıcı verilerini al
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userDoc.data(),
        });
        return { success: true };
      } else {
        return { success: false, error: 'Kullanıcı verileri bulunamadı' };
      }
    } catch (error) {
      let errorMessage = 'Giriş başarısız';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email veya şifre hatalı';
      }
      return { success: false, error: errorMessage };
    }
  };

  // Çıkış yap
  const logout = async () => {
    try {
      if (user?.role === 'admin') {
        setUser(null);
      } else {
        await signOut(auth);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Kullanıcı verilerini güncelle
  const refreshUserData = async () => {
    if (user && user.uid) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUser({
          uid: user.uid,
          email: user.email,
          ...userDoc.data(),
        });
      }
    }
  };

  // Paket satın al
  const purchasePackage = async (packageType) => {
    if (!user || !user.uid) return { success: false };

    try {
      const packageData = {
        id: Date.now().toString(),
        type: packageType.id,
        name: packageType.name,
        total: packageType.count,
        used: 0,
        remaining: packageType.count,
        price: packageType.price,
        isPaid: false,
        purchaseDate: new Date().toISOString().split('T')[0],
      };

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        packages: arrayUnion(packageData),
      });

      await refreshUserData();
      return { success: true };
    } catch (error) {
      console.error('Package purchase error:', error);
      return { success: false, error: error.message };
    }
  };

  // Rezervasyon yap
  const makeReservation = async (workshopName, date, time) => {
    if (!user || !user.uid) return { success: false };

    try {
      const reservation = {
        id: Date.now().toString(),
        workshopName,
        date,
        time,
        status: 'pending',
        isPaid: true,
        createdAt: new Date().toISOString(),
      };

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        reservations: arrayUnion(reservation),
      });

      await refreshUserData();
      return { success: true };
    } catch (error) {
      console.error('Reservation error:', error);
      return { success: false, error: error.message };
    }
  };

  // Katılım işaretle
  const markAttendance = async (reservationId) => {
    if (!user || !user.uid) return { success: false };

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return { success: false };

      const userData = userDoc.data();
      const reservations = userData.reservations || [];
      const packages = userData.packages || [];

      // Rezervasyonu bul
      const reservationIndex = reservations.findIndex(r => r.id === reservationId);
      if (reservationIndex === -1) return { success: false };

      const reservation = reservations[reservationIndex];

      // Aktif paketi bul
      const activePackageIndex = packages.findIndex(pkg => pkg.remaining > 0);
      if (activePackageIndex === -1) return { success: false, error: 'Aktif paket bulunamadı' };

      // Rezervasyon durumunu güncelle
      reservations[reservationIndex] = {
        ...reservation,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };

      // Paket hakkını düşür
      packages[activePackageIndex] = {
        ...packages[activePackageIndex],
        used: packages[activePackageIndex].used + 1,
        remaining: packages[activePackageIndex].remaining - 1,
      };

      // Workshop geçmişine ekle
      const workshopHistory = userData.workshopHistory || [];
      workshopHistory.push({
        workshopName: reservation.workshopName,
        date: reservation.date,
        completedAt: new Date().toISOString(),
      });

      // Firestore'u güncelle
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        reservations,
        packages,
        workshopHistory,
      });

      await refreshUserData();
      return { success: true };
    } catch (error) {
      console.error('Mark attendance error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sadakat kartı damgası ekle
  const addStamp = async () => {
    if (!user || !user.uid) return { success: false };

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return { success: false };

      const userData = userDoc.data();
      const loyaltyCard = userData.loyaltyCard || {
        stamps: 0,
        maxStamps: 9,
        freeEntries: 0,
        redemptionCode: null,
      };

      if (loyaltyCard.stamps < loyaltyCard.maxStamps) {
        loyaltyCard.stamps += 1;

        // 9 damga tamamlandığında
        if (loyaltyCard.stamps === loyaltyCard.maxStamps) {
          loyaltyCard.freeEntries += 1;
          loyaltyCard.redemptionCode = Math.floor(100000 + Math.random() * 900000).toString();
        }

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          loyaltyCard,
        });

        await refreshUserData();
        return { success: true };
      }

      return { success: false, error: 'Kart dolu' };
    } catch (error) {
      console.error('Add stamp error:', error);
      return { success: false, error: error.message };
    }
  };

  // Ücretsiz girişi kullan
  const redeemFreeEntry = async (code) => {
    if (!user || !user.uid) return { success: false };

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return { success: false };

      const userData = userDoc.data();
      const loyaltyCard = userData.loyaltyCard || {
        stamps: 0,
        maxStamps: 9,
        freeEntries: 0,
        redemptionCode: null,
      };

      if (loyaltyCard.redemptionCode === code && loyaltyCard.freeEntries > 0) {
        loyaltyCard.freeEntries -= 1;
        loyaltyCard.stamps = 0;
        loyaltyCard.redemptionCode = null;

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          loyaltyCard,
        });

        await refreshUserData();
        return { success: true };
      }

      return { success: false, error: 'Geçersiz kod veya hak yok' };
    } catch (error) {
      console.error('Redeem error:', error);
      return { success: false, error: error.message };
    }
  };

  // Tüm müşterileri getir (Admin)
  const getAllCustomers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);

      const customers = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === 'customer') {
          customers.push({
            id: doc.id,
            ...data,
          });
        }
      });

      return customers;
    } catch (error) {
      console.error('Get customers error:', error);
      return [];
    }
  };

  // Workshop programını getir
  const getWorkshopSchedule = () => {
    return DEFAULT_WORKSHOP_SCHEDULE;
  };

  // Women's Workshop listesini getir
  const getWomensWorkshops = () => {
    // Varsayılan workshop listesi
    return [
      {
        id: 1,
        name: 'Yoga & Meditasyon',
        description: 'Zihin ve beden dengesi için yoga ve meditasyon seansları',
        icon: '🧘‍♀️',
        duration: '60 dakika',
        price: '250₺',
      },
      {
        id: 2,
        name: 'Seramik Atölyesi',
        description: 'El yapımı seramik yapma teknikleri',
        icon: '🏺',
        duration: '90 dakika',
        price: '350₺',
      },
      {
        id: 3,
        name: 'Resim Atölyesi',
        description: 'Tuval üzerine akrilik boya teknikleri',
        icon: '🎨',
        duration: '120 dakika',
        price: '400₺',
      },
      {
        id: 4,
        name: 'Takı Tasarımı',
        description: 'El yapımı takı tasarım ve yapım teknikleri',
        icon: '💍',
        duration: '90 dakika',
        price: '300₺',
      },
    ];
  };

  // Haftalık Atölye Programını Getir (Boş bir obje döndür - admin panelde doldurulacak)
  const getWeeklySchedule = () => {
    return {
      pazartesi: [],
      salı: [],
      çarşamba: [],
      perşembe: [],
      cuma: [],
      cumartesi: [],
      pazar: [],
    };
  };

  // Programa atölye ekle (placeholder)
  const addWorkshopToSchedule = (day, workshop) => {
    console.log('Add workshop to schedule:', day, workshop);
    return { success: true };
  };

  // Programdan atölye çıkar (placeholder)
  const removeWorkshopFromSchedule = (day, workshopId) => {
    console.log('Remove workshop from schedule:', day, workshopId);
    return { success: true };
  };

  // Ödeme durumunu güncelle (Admin)
  const updatePaymentStatus = async (customerId, isPaid) => {
    try {
      const userRef = doc(db, 'users', customerId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return { success: false };
      
      const userData = userDoc.data();
      const packages = userData.packages || [];
      
      if (packages.length > 0) {
        packages[0].isPaid = isPaid;
        await updateDoc(userRef, { packages });
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Update payment error:', error);
      return { success: false, error: error.message };
    }
  };

  // Kalan hak güncelle (Admin)
  const updateRemainingRights = async (customerId, remaining) => {
    try {
      const userRef = doc(db, 'users', customerId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return { success: false };
      
      const userData = userDoc.data();
      const packages = userData.packages || [];
      
      if (packages.length > 0) {
        const diff = remaining - packages[0].remaining;
        packages[0].remaining = remaining;
        packages[0].used = packages[0].total - remaining;
        
        await updateDoc(userRef, { packages });
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Update remaining error:', error);
      return { success: false, error: error.message };
    }
  };

  // Tüm rezervasyonları getir (Admin)
  const getAllReservations = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      
      const allReservations = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.reservations && data.reservations.length > 0) {
          data.reservations.forEach(reservation => {
            allReservations.push({
              ...reservation,
              customerId: doc.id,
              customerName: data.name,
              customerEmail: data.email,
              customerPhone: data.phone,
            });
          });
        }
      });
      
      return allReservations;
    } catch (error) {
      console.error('Get reservations error:', error);
      return [];
    }
  };

  // Değerlendirme gönder (Customer)
  const submitReview = async (rating, feedback, suggestions) => {
    try {
      if (!user) {
        return { success: false, error: 'Giriş yapmalısınız' };
      }

      const reviewData = {
        userId: user.uid || user.id,
        userName: user.name,
        userEmail: user.email,
        rating,
        feedback: feedback || '',
        suggestions: suggestions || '',
        date: new Date().toISOString(),
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      return { success: true };
    } catch (error) {
      console.error('Submit review error:', error);
      return { success: false, error: error.message };
    }
  };

  // Tüm değerlendirmeleri getir (Admin)
  const getAllReviews = async () => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef);
      const querySnapshot = await getDocs(q);
      
      const reviews = [];
      querySnapshot.forEach((doc) => {
        reviews.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      return reviews;
    } catch (error) {
      console.error('Get reviews error:', error);
      return [];
    }
  };

  // Women's workshop rezervasyonu gönder
  const submitWomensWorkshopReservation = async (reservationData) => {
    try {
      await addDoc(collection(db, 'womensWorkshopReservations'), {
        ...reservationData,
        userId: user?.uid || user?.id || null,
        date: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      console.error('Submit womens workshop reservation error:', error);
      return { success: false, error: error.message };
    }
  };

  // Women's workshop rezervasyonlarını getir
  const getAllWomensWorkshopReservations = async () => {
    try {
      const ref = collection(db, 'womensWorkshopReservations');
      const snapshot = await getDocs(ref);
      const reservations = [];
      snapshot.forEach((doc) => {
        reservations.push({ id: doc.id, ...doc.data() });
      });
      return reservations;
    } catch (error) {
      console.error('Get womens workshop reservations error:', error);
      return [];
    }
  };

  // Damga ekle (Admin)
  const addStampAdmin = async (customerEmail) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      
      let targetUserId = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === customerEmail) {
          targetUserId = doc.id;
        }
      });
      
      if (!targetUserId) return { success: false };
      
      const userDoc = await getDoc(doc(db, 'users', targetUserId));
      if (!userDoc.exists()) return { success: false };
      
      const userData = userDoc.data();
      const loyaltyCard = userData.loyaltyCard || {
        stamps: 0,
        maxStamps: 9,
        freeEntries: 0,
        redemptionCode: null,
      };
      
      if (loyaltyCard.stamps < loyaltyCard.maxStamps) {
        loyaltyCard.stamps += 1;
        
        if (loyaltyCard.stamps === loyaltyCard.maxStamps) {
          loyaltyCard.freeEntries += 1;
          loyaltyCard.redemptionCode = Math.floor(100000 + Math.random() * 900000).toString();
        }
        
        await updateDoc(doc(db, 'users', targetUserId), { loyaltyCard });
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Add stamp admin error:', error);
      return { success: false, error: error.message };
    }
  };

  // Damga kaldır (Admin)
  const removeStampAdmin = async (customerEmail) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      
      let targetUserId = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === customerEmail) {
          targetUserId = doc.id;
        }
      });
      
      if (!targetUserId) return { success: false };
      
      const userDoc = await getDoc(doc(db, 'users', targetUserId));
      if (!userDoc.exists()) return { success: false };
      
      const userData = userDoc.data();
      const loyaltyCard = userData.loyaltyCard || {
        stamps: 0,
        maxStamps: 9,
        freeEntries: 0,
        redemptionCode: null,
      };
      
      if (loyaltyCard.stamps > 0) {
        loyaltyCard.stamps -= 1;
        
        if (loyaltyCard.stamps < loyaltyCard.maxStamps) {
          loyaltyCard.redemptionCode = null;
        }
        
        await updateDoc(doc(db, 'users', targetUserId), { loyaltyCard });
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Remove stamp admin error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    refreshUserData,
    purchasePackage,
    makeReservation,
    createReservation: makeReservation, // Alias
    markAttendance,
    redeemFreeEntry,
    useFreeEntry: redeemFreeEntry,
    getAllCustomers,
    getWorkshopSchedule,
    getWeeklySchedule,
    addWorkshopToSchedule,
    removeWorkshopFromSchedule,
    getWomensWorkshops,
    updatePaymentStatus,
    updateRemainingRights,
    getAllReservations,
    submitReview,
    getAllReviews,
    submitWomensWorkshopReservation,
    getAllWomensWorkshopReservations,
    addStamp: addStampAdmin,
    removeStamp: removeStampAdmin,
    workshopDates,
    setWorkshopDates,
    config,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
