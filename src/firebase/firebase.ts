// Import the functions you need from the SDKs you need
import dotenv from "dotenv";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Load environment variables
dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_n-eeiPabxgluVihEHC5Pm_k-4DTPlho",
  authDomain: "carometroturbinado.firebaseapp.com",
  projectId: "carometroturbinado",
  storageBucket: "carometroturbinado.firebasestorage.app",
  messagingSenderId: "85362704080",
  appId: "1:85362704080:web:6cb97ae31066126c7b68d5",
  measurementId: "G-7M5PQKB8PJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;

if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Erro ao inicializar o Firebase Analytics:", error);
  }
}

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Inicializar o Firebase Storage
const storage = getStorage(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db, provider, storage };
