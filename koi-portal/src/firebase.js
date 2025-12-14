import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 1. Импорт Storage

const firebaseConfig = {
  apiKey: "AIzaSyCXntYmMX8644PyU1aCDwpsCY-JnA7oyqo",
  authDomain: "koi-institute.firebaseapp.com",
  projectId: "koi-institute",
  storageBucket: "koi-institute.firebasestorage.app",
  messagingSenderId: "865279131504",
  appId: "1:865279131504:web:6881848ed297f978f699b5",
  measurementId: "G-W64PTPPW8D"
};
const app = initializeApp(firebaseConfig);

// ВАЖНО: Обрати внимание на слова "export const"
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
export const storage = getStorage(app); // 2. Экспорт Storage