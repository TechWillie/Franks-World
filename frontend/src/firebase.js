// src/firebase.js (web)
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // the-hype-f3b75.appspot.com
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("FB project:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("FB bucket:", import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
