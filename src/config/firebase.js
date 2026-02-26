import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyAF18hWIGV9I0il6HXgEpkVOKBTSrNEBrE",
  authDomain: "bi-oyun-bi-kahve.firebaseapp.com",
  projectId: "bi-oyun-bi-kahve",
  storageBucket: "bi-oyun-bi-kahve.firebasestorage.app",
  messagingSenderId: "570599706849",
  appId: "1:570599706849:web:9618abe7b1ad06519d67a0",
  measurementId: "G-YH5T9ZY5FD"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Servisleri dışa aktar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
