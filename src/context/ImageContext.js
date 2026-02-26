import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAppImages } from '../utils/appImages';

const ImageContext = createContext();

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within ImageProvider');
  }
  return context;
};

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

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState(DEFAULT_IMAGES);
  const [loading, setLoading] = useState(true);

  // Firebase'den fotoğrafları yükle
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const result = await getAppImages();
      
      if (result.success && result.images) {
        // Firebase'den gelen URL'leri yerel fotoğraflarla birleştir
        const updatedImages = { ...DEFAULT_IMAGES };
        
        // Firebase'den gelen her fotoğraf için
        Object.keys(result.images).forEach((key) => {
          if (result.images[key]) {
            // URL varsa, URI objesi olarak kaydet
            updatedImages[key] = { uri: result.images[key] };
          }
        });
        
        setImages(updatedImages);
      }
    } catch (error) {
      console.error('Load images error:', error);
      // Hata olursa yerel fotoğrafları kullan
    } finally {
      setLoading(false);
    }
  };

  // Fotoğrafları yenile (admin panel değişiklik yaptığında)
  const refreshImages = async () => {
    await loadImages();
  };

  const value = {
    images,
    loading,
    refreshImages,
  };

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};

export default ImageContext;
