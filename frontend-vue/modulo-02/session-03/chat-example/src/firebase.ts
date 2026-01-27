import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDpvrVwjw7JjTBRE1EW7fsiFhje4AH_piY",
    authDomain: "andes-fullstack-esp.firebaseapp.com",
    projectId: "andes-fullstack-esp",
    storageBucket: "andes-fullstack-esp.firebasestorage.app",
    messagingSenderId: "138289408177",
    appId: "1:138289408177:web:f3d48b53b62a3079335a90",
    measurementId: "G-FM0D6941PQ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
