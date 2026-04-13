// ============================================
// FIREBASE КОНФИГУРАЦИЯ
// ============================================

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

// Экспортируем сервисы
const auth = firebase.auth();
const db = firebase.firestore();

// Настройка persistence - данные остаются после перезагрузки
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Отключаем deprecated методы
firebase.firestore().settings({ 
  ignoreUndefinedProperties: true 
});

console.log('🔥 Firebase инициализирован');
