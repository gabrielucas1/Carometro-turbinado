// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVzFhxPFjp-Y1yfuLWZ9O9uboOdP3mgbQ",
  authDomain: "carometro-turbinado.firebaseapp.com",
  projectId: "carometro-turbinado",
  storageBucket: "carometro-turbinado.appspot.com",
  messagingSenderId: "630462104781",
  appId: "1:630462104781:web:36716ab614e6971ee05584",
  measurementId: "G-66S9LGMRXP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;

if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Erro ao inicializar o Firebase Analytics:", error);
  }
}

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export {auth, provider, db}

