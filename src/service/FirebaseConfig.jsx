// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBdZATlOHsrpRXniHK7XZ_uh3UwnC-_beU",
    authDomain: "aitripplanner-e19f8.firebaseapp.com",
    projectId: "aitripplanner-e19f8",
    storageBucket: "aitripplanner-e19f8.firebasestorage.app",
    messagingSenderId: "837278218226",
    appId: "1:837278218226:web:f4035ab8b60e2600369d6b",
    measurementId: "G-GTD2WC0H6D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);