import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC0rOKA_TymMVpVFy_7iiwN3-rtlW8yok8",
  authDomain: "theblog-da2b7.firebaseapp.com",
  projectId: "theblog-da2b7",
  storageBucket: "theblog-da2b7.appspot.com",
  messagingSenderId: "753114876609",
  appId: "1:753114876609:web:bbc138ac620007beeb6240"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export { db }