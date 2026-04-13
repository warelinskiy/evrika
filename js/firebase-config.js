// Firebase конфигурация для CDN версии
const firebaseConfig = {
  apiKey: "AIzaSyC2ueIcLC3KHOtLN7tG7vdfMM2Sv1sYmSk",
  authDomain: "evrika-e2af7.firebaseapp.com",
  projectId: "evrika-e2af7",
  storageBucket: "evrika-e2af7.firebasestorage.app",
  messagingSenderId: "1004614194292",
  appId: "1:1004614194292:web:221347a165714b58512d21",
  measurementId: "G-6TK4JLZXL8"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Настройка persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);