// Firebase Configuration for Apna Food
const firebaseConfig = {
  apiKey: "AIzaSyDxs1ajvxsqVjujfCwDdmZ", // Note: Apni poori API Key Firebase console se copy karke yahan quotes ke andar paste karein
  authDomain: "apna-food-9c653.firebaseapp.com",
  projectId: "apna-food-9c653",
  storageBucket: "apna-food-9c653.firebasestorage.app",
  messagingSenderId: "985518405828",
  appId: "1:985518405828:web:5f9fb0b22382d141c29191",
  measurementId: "G-RVGP2D2CYL"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
