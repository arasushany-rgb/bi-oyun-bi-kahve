import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';

/**
 * Fotoğraf seçici aç ve kullanıcıdan fotoğraf seç
 */
export const pickImage = async () => {
  try {
    // İzin iste
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return { 
        success: false, 
        error: 'Galeriye erişim izni gerekli' 
      };
    }

    // Fotoğraf seç
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) {
      return { success: false, error: 'İptal edildi' };
    }

    return { 
      success: true, 
      uri: result.assets[0].uri 
    };
  } catch (error) {
    console.error('Pick image error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Fotoğrafı Firebase Storage'a yükle
 * @param {string} uri - Yerel fotoğraf URI
 * @param {string} folder - Klasör adı (örn: 'cafe', 'workshops', 'playarea')
 * @param {string} filename - Dosya adı (örn: 'item1.jpg')
 */
export const uploadImage = async (uri, folder, filename) => {
  try {
    // Fotoğrafı blob'a çevir
    const response = await fetch(uri);
    const blob = await response.blob();

    // Storage referansı oluştur
    const storageRef = ref(storage, `${folder}/${filename}`);

    // Yükle
    await uploadBytes(storageRef, blob);

    // Download URL al
    const downloadURL = await getDownloadURL(storageRef);

    return { 
      success: true, 
      url: downloadURL 
    };
  } catch (error) {
    console.error('Upload image error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Fotoğrafı Firebase Storage'dan sil
 * @param {string} fileUrl - Firebase Storage URL
 */
export const deleteImage = async (fileUrl) => {
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    console.error('Delete image error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Fotoğraf seç ve yükle (tek adımda)
 * @param {string} folder - Klasör adı
 * @param {string} filename - Dosya adı
 */
export const pickAndUploadImage = async (folder, filename) => {
  try {
    // Fotoğraf seç
    const pickResult = await pickImage();
    if (!pickResult.success) {
      return pickResult;
    }

    // Yükle
    const uploadResult = await uploadImage(pickResult.uri, folder, filename);
    return uploadResult;
  } catch (error) {
    console.error('Pick and upload error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};
