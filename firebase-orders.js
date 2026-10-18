// Example shared-order client logic. Integrate this module into the customer checkout.
// Orders contain item IDs and quantities only; never trust a client-supplied total or price.
// This example uses anonymous Firebase Auth so each order has an authenticated owner.
import { auth, db } from "./firebase.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

export async function createSharedOrder({ customerName, phone, address, notes, items, paymentMethod = "upi" }) {
  if (!customerName?.trim() || !/^[0-9]{10}$/.test(phone || "") || !address?.trim()) {
    throw new Error("Enter a name, valid 10-digit phone number and delivery address.");
  }
  if (!Array.isArray(items) || items.length < 1 || items.length > 15) {
    throw new Error("Your cart is empty or contains too many items.");
  }
  const cleanItems = items.map(({ itemId, qty }) => {
    if (!Number.isInteger(itemId) || itemId < 1 || itemId > 6 || !Number.isInteger(qty) || qty < 1 || qty > 10) {
      throw new Error("An item in your cart is invalid.");
    }
    return { itemId, qty };
  });
  if (!auth.currentUser) await signInAnonymously(auth);
  const order = {
    ownerUid: auth.currentUser.uid,
    customerName: customerName.trim().slice(0, 70),
    phone,
    address: address.trim().slice(0, 300),
    notes: (notes || "").trim().slice(0, 200),
    items: cleanItems,
    paymentMethod: paymentMethod === "upi" ? "upi" : "cod",
    paymentStatus: "unverified",
    status: "received",
    createdAt: serverTimestamp()
  };
  const result = await addDoc(collection(db, "orders"), order);
  return result.id;
}
