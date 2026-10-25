/**
 * Califnco Firebase Spark Configuration
 * Supports Firebase Auth, Firestore real-time sync, and Firebase Cloud Messaging (FCM).
 * Falls back gracefully to local reactive state if API keys are not yet configured.
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Spark (Free Tier) Config template - Replace with your project credentials if desired
export const FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyD-CALIFNCO-DEMO-SPARK-KEY-98231",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "califnco-water-tech.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "califnco-water-tech",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "califnco-water-tech.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "839201948271",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:839201948271:web:9c8e2b10a47f12e"
};

export const isFirebaseConfigured = (): boolean => {
  return !FIREBASE_CONFIG.apiKey.includes("DEMO");
};
