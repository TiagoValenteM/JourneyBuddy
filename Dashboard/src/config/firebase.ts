import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
  apiKey: "AIzaSyAuaezYg9r0pYCkpICyTpitk-Y4Z00M_Mo",
  authDomain: "journeybuddy2023.firebaseapp.com",
  projectId: "journeybuddy2023",
  storageBucket: "journeybuddy2023.appspot.com",
  messagingSenderId: "76406580738",
  appId: "1:76406580738:web:5bf457c2826cb08673e91b",
  measurementId: "G-WLRPKT027F",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
