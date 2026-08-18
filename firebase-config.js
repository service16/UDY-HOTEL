// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase/app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase/firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase/auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSzNwHg2LwX1jEMeWwViyOai8yNqu8dpY",
  authDomain: "udyhotel-1c419.firebaseapp.com",
  projectId: "udyhotel-1c419",
  storageBucket: "udyhotel-1c419.firebasestorage.app",
  messagingSenderId: "714050804978",
  appId: "1:714050804978:web:a5cb029b2e45069c97c46b",
  measurementId: "G-FESSMGY7M9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
