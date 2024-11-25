// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCv1fL-vvYsxN-EL38f5FiXWuG6R8LAfr0",
  authDomain: "financio-7eeed.firebaseapp.com",
  projectId: "financio-7eeed",
  storageBucket: "financio-7eeed.firebasestorage.app",
  messagingSenderId: "627393131723",
  appId: "1:627393131723:web:b9aeb341eddf54aafd174e",
  measurementId: "G-2NBG28G9XS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };