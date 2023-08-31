// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZg8J0A9L9z4LSA6iEoSg0tNLilR-FuzA",
  authDomain: "task-manager-4c5e2.firebaseapp.com",
  projectId: "task-manager-4c5e2",
  storageBucket: "task-manager-4c5e2.appspot.com",
  messagingSenderId: "356219322155",
  appId: "1:356219322155:web:f053040be5eb709edacf6e",
  measurementId: "G-N6Q234ZF5Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage()
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export const db = getFirestore(app);