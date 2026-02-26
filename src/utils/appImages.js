/**
 * Uygulama Fotoğrafları için Firestore Yapısı
 * 
 * Koleksiyon: app_settings
 * Doküman: images
 * 
 * Alanlar:
 * - cafeImage: string (URL)
 * - playAreaImage: string (URL)
 * - workshopImage: string (URL)
 * - birthdayImage: string (URL)
 * - splashLogo: string (URL)
 * - mainLogo: string (URL)
 * - ratingLogo: string (URL)
 * 
 * Örnek:
 * {
 *   cafeImage: "https://firebasestorage.googleapis.com/.../cafe.jpg",
 *   playAreaImage: "https://firebasestorage.googleapis.com/.../playarea.jpg",
 *   workshopImage: "https://firebasestorage.googleapis.com/.../workshop.jpg",
 *   birthdayImage: "https://firebasestorage.googleapis.com/.../birthday-bg.png",
 *   splashLogo: "https://firebasestorage.googleapis.com/.../splash-logo.png",
 *   mainLogo: "https://firebasestorage.googleapis.com/.../logo-main.png",
 *   ratingLogo: "https://firebasestorage.googleapis.com/.../logo-rating.png"
 * }
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Varsayılan yerel fotoğraflar
const DEFAULT_IMAGES = {
  cafeImage: require('../../assets/images/cafe.jpg'),
  playAreaImage: require('../../assets/images/playarea.jpg'),
  workshopImage: require('../../assets/images/workshop.jpg'),
  birthdayImage: require('../../assets/images/birthday-bg.png'),
  splashLogo: require('../../assets/images/splash-logo.png'),
  mainLogo: require('../../assets/images/logo-main.png'),
  ratingLogo: require('../../assets/images/logo-rating.png'),
};

/**
 * Uygulama fotoğraflarını Firestore'dan getir
 */
export const getAppImages = async () => {
  try {
    const docRef = doc(db, 'app_settings', 'images');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: true,
        images: docSnap.data(),
      };
    } else {
      // İlk kez çalışıyorsa, varsayılan değerleri kaydet
      return {
        success: true,
        images: null, // Yerel fotoğraflar kullanılacak
      };
    }
  } catch (error) {
    console.error('Get app images error:', error);
    return {
      success: false,
      error: error.message,
      images: null,
    };
  }
};

/**
 * Tek bir fotoğrafı güncelle
 * @param {string} imageKey - Fotoğraf anahtarı (örn: 'cafeImage')
 * @param {string} imageUrl - Firebase Storage URL
 */
export const updateAppImage = async (imageKey, imageUrl) => {
  try {
    const docRef = doc(db, 'app_settings', 'images');
    const docSnap = await getDoc(docRef);

    let currentImages = {};
    if (docSnap.exists()) {
      currentImages = docSnap.data();
    }

    currentImages[imageKey] = imageUrl;

    await setDoc(docRef, currentImages, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Update app image error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Fotoğraf anahtarını türkçe isme çevir
 */
export const getImageDisplayName = (imageKey) => {
  const names = {
    cafeImage: 'Kafe Fotoğrafı',
    playAreaImage: 'Oyun Alanı Fotoğrafı',
    workshopImage: 'Atölye Fotoğrafı',
    birthdayImage: 'Doğum Günü Fotoğrafı',
    splashLogo: 'Splash Logo',
    mainLogo: 'Ana Logo',
    ratingLogo: 'Değerlendirme Logo',
  };
  return names[imageKey] || imageKey;
};

export default DEFAULT_IMAGES;
