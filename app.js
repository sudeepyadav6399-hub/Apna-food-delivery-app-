const foods = [
  {id: 1, name: "Punjabi Chole Thali", restaurant: "Sharma Family Kitchen", price: 149, category: "Thali", desc: "Served with rice, 2 parathas, raita & pickle", veg: true},
  {id: 2, name: "Veg Dum Biryani", restaurant: "Spice Junction", price: 149, category: "Biryani", desc: "Aromatic basmati rice cooked with herbs", veg: true},
  {id: 3, name: "Paneer Wrap", restaurant: "The Tasty Corner", price: 89, category: "Snacks", desc: "Spiced paneer roll loaded with mint mayo", veg: true},
  {id: 4, name: "Masala Dosa", restaurant: "South Street Cafe", price: 80, category: "South Indian", desc: "Crispy dosa served with sambar & chutneys", veg: true},
  {id: 5, name: "Samosa (2 pcs)", restaurant: "Chai & Chatpata", price: 30, category: "Snacks", desc: "Crisp potato pockets served hot", veg: true},
  {id: 6, name: "Mango Lassi", restaurant: "The Lassi Stop", price: 59, category: "Beverages", desc: "Thick chilled curd blended with Alphonso pulp", veg: true}
];

let cart = JSON.parse(localStorage.getItem("apnaFoodCart") || "{}");
let activeCategory = "All";

const $ = id => document.getElementById(id);
const money = n => "₹" + n;

function saveCart() {
  localStorage.setItem("apnaFoodCart", JSON.stringify(cart));
}

function renderFoods() {
  const list = foods.filter(f => activeCategory === "All" || f.category === activeCategory);
  $("foodGrid").innerHTML = list.map(f => `
    <article class="food-card">
      <div class="food-details">
        <span class="tag ${f.veg ? "veg" : "non-veg"}">${f.veg ? "VEG" : "NON-VEG"}</span>
        <h3>${f.name}</h3>
        <p class="restaurant">${f.restaurant}</p>
        <p class="desc">${f.desc}</p>
        <div class="card-bottom">
          <span class="price">${money(f.price)}</span>
          <button class="btn btn-add" data-id="${f.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join("");
}

function cartCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function renderCart() {
  $("cartCount").textContent = cartCount();
  const items = foods.filter(f => cart[f.id]);
  if (!items.length) {
    $("cartItems").innerHTML = `<div class="empty-state"><p>Your cart is empty</p></div>`;
    $("checkoutArea").innerHTML = "";
    return;
  }
  $("cartItems").innerHTML = items.map(f => `
    <div class="cart-row">
      <div>
        <h4>${f.name}</h4>
        <small>${money(f.price)} each</small>
      </div>
      <div class="qty-controls">
        <button class="btn-qty" data-id="${f.id}" data-action="dec">-</button>
        <span>${cart[f.id]}</span>
        <button class="btn-qty" data-id="${f.id}" data-action="inc">+</button>
      </div>
    </div>
  `).join("");

  const total = items.reduce((sum, f) => sum + f.price * cart[f.id], 0);
  $("checkoutArea").innerHTML = `
    <div class="checkout-summary">
      <div class="total-row"><span>Total:</span><strong>${money(total)}</strong></div>
      <form id="orderForm" class="checkout-form">
        <input type="text" name="name" placeholder="Your Name" required>
        <input type="tel" name="phone" placeholder="Phone Number" required>
        <textarea name="address" placeholder="Delivery Address" required></textarea>
        <input type="text" name="notes" placeholder="Cooking instructions / notes">
        <button type="submit" class="btn btn-primary" style="width:100%;margin-top:10px;">Place Order</button>
      </form>
    </div>
  `;
  $("orderForm").addEventListener("submit", submitOrder);
}

async function submitOrder(e) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const orderItems = foods.filter(f => cart[f.id]).map(f => ({
    id: f.id,
    name: f.name,
    price: f.price,
    qty: cart[f.id]
  }));
  const totalAmount = foods.filter(f => cart[f.id]).reduce((sum, f) => sum + f.price * cart[f.id], 0);

  const order = {
    id: "AF" + Date.now().toString().slice(-6),
    createdAt: new Date().toISOString(),
    items: orderItems,
    total: totalAmount,
    customer: {
      name: formData.get("name") || "Customer",
      phone: formData.get("phone") || "",
      address: formData.get("address") || "",
      notes: formData.get("notes") || ""
    },
    status: "Received"
  };

  // Direct Firestore Upload
  try {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      const db = firebase.firestore();
      await db.collection("orders").add(order);
    }
  } catch (err) {
    console.error("Firestore upload failed:", err);
  }

  cart = {};
  saveCart();
  $("cartCount").textContent = "0";
  $("cartItems").innerHTML = `
    <div class="success-panel" style="padding: 24px; text-align: center;">
      <h3 style="color: #2e7d32; font-size: 20px; margin-bottom: 8px;">🎉 Order Placed Successfully!</h3>
      <p style="margin-bottom: 6px;">Order Reference: <strong>${order.id}</strong></p>
      <p style="color: #666; font-size: 14px;">Your order has been sent to the restaurant.</p>
      <button class="btn btn-primary" id="closeSuccess" style="margin-top: 16px;">Back to menu</button>
    </div>
  `;
  $("checkoutArea").innerHTML = "";
  $("closeSuccess").addEventListener("click", closeCart);
}

function openCart() {
  $("cartOverlay").classList.remove("hidden");
  renderCart();
}

function closeCart() {
  $("cartOverlay").classList.add("hidden");
}

let toastTimer;
function toast(msg) {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 2000);
}

$("foodGrid").addEventListener("click", e => {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  $("cartCount").textContent = cartCount();
  toast("Item added to cart");
});

$("filters").addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  activeCategory = btn.dataset.category;
  renderFoods();
});

$("cartItems").addEventListener("click", e => {
  const btn = e.target.closest(".btn-qty");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  if (action === "inc") cart[id] = (cart[id] || 0) + 1;
  if (action === "dec") {
    cart[id] = (cart[id] || 0) - 1;
    if (cart[id] <= 0) delete cart[id];
  }
  saveCart();
  renderCart();
});

$("cartOpen").addEventListener("click", openCart);
$("cartClose").addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });

renderFoods();
$("cartCount").textContent = cartCount();
