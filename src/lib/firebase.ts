// ─── Firebase Initialization ─────────────────────────────────────────────────
// Setup karne ke liye:
// 1. https://console.firebase.google.com par jayein
// 2. Naya project banayein
// 3. Authentication → Sign-in method → Email/Password enable karein
// 4. Firestore Database → Create database (production mode)
// 5. Project Settings → Your Apps → Add Web App
// 6. .env file mein apni values daalen (niche dekho)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app  = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);

export default app;
