// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxWqgU4jjyMtLaE7oVERLSDGqtMcuIOC4",
  authDomain: "proj-for-git.firebaseapp.com",
  projectId: "proj-for-git",
  storageBucket: "proj-for-git.appspot.com",
  messagingSenderId: "689619263240",
  appId: "1:689619263240:web:e362206b9d69ca884f16bd",
  measurementId: "G-452MTQMVSV"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const googleAuth = new GoogleAuthProvider()
export const db = getFirestore(app)
export const firestore = getFirestore(app);

