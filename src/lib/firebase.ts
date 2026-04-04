import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLtnJBahWe4iZWe9Cc8vhHtxmrDzzTgt0",
  authDomain: "js-healer.firebaseapp.com",
  projectId: "js-healer",
  storageBucket: "js-healer.firebasestorage.app",
  messagingSenderId: "87797748416",
  appId: "1:87797748416:web:ddf9382ff4012f05c45325",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
