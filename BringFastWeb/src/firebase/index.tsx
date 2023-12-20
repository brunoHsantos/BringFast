import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
const credentials = {
  apiKey: "AIzaSyB9vVndse6NxBTF0LF-MLXf6djdhd7VZVc",
  authDomain: "bringfast-4f44a.firebaseapp.com",
  projectId: "bringfast-4f44a",
  storageBucket: "bringfast-4f44a.appspot.com",
  messagingSenderId: "275832571459",
  appId: "1:275832571459:web:64c76823cc2631e9aab6f6",
  measurementId: "G-PWZ6ECKRBV",
};

// Initialize Firebase
const app = firebase.initializeApp(credentials);
export const firebaseDatabase = firebase.firestore();
export default app;
