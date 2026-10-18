// Firebase Configuration for Apna Food
const firebaseConfig = {
  apiKey: "AIzaSyDxs1ajvxsqVjujfCwDdmZ", // Firebase Console ki settings se poori key yahan quotes me dalein
  authDomain: "apna-food-9c653.firebaseapp.com",
  projectId: "apna-food-9c653",
  storageBucket: "apna-food-9c653.firebasestorage.app",
  messagingSenderId: "985518405828",
  appId: "1:985518405828:web:5f9fb0b22382d141c29191",
  measurementId: "G-RVGP2D2CYL"
};

// Initialize Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Global Order Saving Function
window.saveOrderToFirebase = async function(orderData) {
  try {
    const db = firebase.firestore();
    const docRef = await db.collection("orders").add({
      ...orderData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: "Received"
    });
    alert("Order successful! Order ID: " + docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    alert("Database Error: " + error.message);
    return { success: false, error: error.message };
  }
};
