const foods = [
  {id:1,name:"Punjabi Chole Thali",restaurant:"Sharma Family Kitchen",price:129,category:"Meals",emoji:"🍛",tag:"BESTSELLER",desc:"Chole, rice, roti & salad"},
  {id:2,name:"Veg Dum Biryani",restaurant:"Spice Junction",price:149,category:"Meals",emoji:"🍲",tag:"POPULAR",desc:"Fragrant rice with raita"},
  {id:3,name:"Paneer Wrap",restaurant:"The Tasty Corner",price:89,category:"Snacks",emoji:"🌯",tag:"QUICK BITE",desc:"Spiced paneer in a soft wrap"},
  {id:4,name:"Masala Dosa",restaurant:"South Street Cafe",price:99,category:"Meals",emoji:"🥞",tag:"CRISPY",desc:"Dosa, chutney & sambhar"},
  {id:5,name:"Samosa (2 pcs)",restaurant:"Chai & Chatpata",price:30,category:"Snacks",emoji:"🥟",tag:"TEA TIME",desc:"Crispy potato-filled samosas"},
  {id:6,name:"Mango Lassi",restaurant:"The Lassi Stop",price:59,category:"Drinks",emoji:"🥭",tag:"CHILLED",desc:"Sweet mango yogurt drink"}
];
let cart = JSON.parse(localStorage.getItem("apnaFoodCart") || "{}");
let activeCategory = "All";
const $ = id => document.getElementById(id);
const money = n => "₹" + n;
function saveCart(){localStorage.setItem("apnaFoodCart",JSON.stringify(cart));}
function renderFoods(){
  const list = foods.filter(f=>activeCategory==="All"||f.category===activeCategory);
  $("foodGrid").innerHTML=list.map(f=>`<article class="food-card"><div class="food-photo"><span class="tag">${f.tag}</span>${f.emoji}</div><div class="food-info"><h3>${f.name}</h3><p>${f.restaurant}</p><p style="margin-top:8px">${f.desc}</p><div class="food-meta"><span class="price">${money(f.price)}</span><button class="add-button" data-add="${f.id}">+ Add</button></div></div></article>`).join("");
}
function cartCount(){return Object.values(cart).reduce((a,b)=>a+b,0)}
function renderCart(){
  $("cartCount").textContent=cartCount();
  const items=foods.filter(f=>cart[f.id]);
  if(!items.length){$("cartItems").innerHTML='<div class="empty"><div style="font-size:42px;margin-bottom:10px">🛍️</div><strong>Your cart is empty</strong>Add something delicious to get started.</div>';$("checkoutArea").innerHTML="";return;}
  $("cartItems").innerHTML=items.map(f=>`<div class="cart-row"><div class="cart-emoji">${f.emoji}</div><div><h4>${f.name}</h4><p>${money(f.price)} each</p><div class="qty-controls"><button data-qty="${f.id}" data-change="-1" aria-label="Remove one">−</button><span>${cart[f.id]}</span><button data-qty="${f.id}" data-change="1" aria-label="Add one">+</button></div></div><strong>${money(f.price*cart[f.id])}</strong></div>`).join("");
  const total=items.reduce((sum,f)=>sum+f.price*cart[f.id],0);
  $("checkoutArea").innerHTML=`<div class="cart-total"><span>Subtotal</span><span>${money(total)}</span></div><form class="checkout-form" id="orderForm"><h3>Delivery details</h3><label>Full name<input name="name" required maxlength="70" placeholder="Your name"></label><label>Mobile number<input name="phone" required inputmode="numeric" pattern="[0-9]{10}" maxlength="10" placeholder="10-digit mobile number"></label><label>Delivery address<textarea name="address" required maxlength="300" placeholder="House / street / area"></textarea></label><label>Notes (optional)<input name="notes" maxlength="200" placeholder="Landmark or food instructions"></label><button class="submit-order" type="submit">Place demo order · ${money(total)}</button><p class="fine-print">Prototype only: this saves the order on this device. It does not contact a restaurant, send an SMS, or take payment. Do not enter real personal details in this demo.</p></form>`;
  $("orderForm").addEventListener("submit",submitOrder);
}
function submitOrder(e){
  e.preventDefault();
  const form=new FormData(e.currentTarget);
  const order={id:"AF"+Date.now().toString().slice(-6),created:new Date().toLocaleString(),name:form.get("name"),phone:form.get("phone"),address:form.get("address"),notes:form.get("notes"),items:foods.filter(f=>cart[f.id]).map(f=>({name:f.name,price:f.price,qty:cart[f.id]})),total:foods.reduce((sum,f)=>sum+(cart[f.id]||0)*f.price,0),status:"Order received (demo)"};
  const orders=JSON.parse(localStorage.getItem("apnaFoodDemoOrders")||"[]");orders.unshift(order);localStorage.setItem("apnaFoodDemoOrders",JSON.stringify(orders));
  cart={};saveCart();$("cartCount").textContent="0";
  $("cartItems").innerHTML=`<div class="success-panel"><h3>🎉 Demo order created!</h3><p>Order reference: <strong>${order.id}</strong></p><p>This is a local prototype. The restaurant has not received your order. When we connect a secure backend, orders can be shared with the restaurant.</p><button class="small-button" id="closeSuccess">Back to menu</button></div>`;
  $("checkoutArea").innerHTML="";$("closeSuccess").addEventListener("click",closeCart);
}
function openCart(){$("cartOverlay").classList.remove("hidden");renderCart();document.body.style.overflow="hidden";}
function closeCart(){$("cartOverlay").classList.add("hidden");document.body.style.overflow="";}
let toastTimer;
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),1800);}
$("foodGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=Number(b.dataset.add);cart[id]=(cart[id]||0)+1;saveCart();$("cartCount").textContent=cartCount();toast("Added to your cart");});
$("filters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderFoods();});
$("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-qty]");if(!b)return;const id=Number(b.dataset.qty);cart[id]=(cart[id]||0)+Number(b.dataset.change);if(cart[id]<=0)delete cart[id];saveCart();renderCart();});
$("cartOpen").addEventListener("click",openCart);$("cartClose").addEventListener("click",closeCart);$("cartOverlay").addEventListener("click",e=>{if(e.target===$("cartOverlay"))closeCart();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
renderFoods();$("cartCount").textContent=cartCount();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
