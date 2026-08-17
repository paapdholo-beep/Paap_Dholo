import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAEC2k97Y2_Sx5MiXiWf3f9FhAmODoWDCg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "paap-dholo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "paap-dholo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "paap-dholo.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "411414209987",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:411414209987:web:0ce7d78c03624fb6310976",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0W3M9QH2J7",
};

// Initialize Firebase once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
