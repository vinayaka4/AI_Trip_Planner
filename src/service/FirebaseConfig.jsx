import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBdZATlOHsrpRXniHK7XZ_uh3UwnC-_beU",
    authDomain: "aitripplanner-e19f8.firebaseapp.com",
    projectId: "aitripplanner-e19f8",
    storageBucket: "aitripplanner-e19f8.firebasestorage.app",
    messagingSenderId: "837278218226",
    appId: "1:837278218226:web:f4035ab8b60e2600369d6b",
    measurementId: "G-GTD2WC0H6D"
};






export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
