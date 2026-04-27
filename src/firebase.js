import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuLCMb6Gm7TgRA42qFYMLKEHxl5m-l1Go",
  authDomain: "dineflow-5016b.firebaseapp.com",
  projectId: "dineflow-5016b",
  storageBucket: "dineflow-5016b.firebasestorage.app",
  messagingSenderId: "1059339486678",
  appId: "1:1059339486678:web:734bb5ef9e78b7670dd077",
  measurementId: "G-WT2ZBFWB5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
