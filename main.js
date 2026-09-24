// 🔍 UI (Search + Login)

document.addEventListener("DOMContentLoaded", () => {

  const searchIcon = document.getElementById("searchIcon");
  const searchBox = document.getElementById("searchBox");
  const searchInput = document.querySelector("#searchBox input");

  const loginIcon = document.getElementById("loginIcon");
  const loginMenu = document.getElementById("loginMenu");

  function closeAllMenus() {
    searchBox?.classList.remove("active");
    loginMenu?.classList.remove("active");
  }

  // Search
  if (searchIcon && searchBox && searchInput) {
    searchIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllMenus();
      searchBox.classList.toggle("active");
      searchInput.focus();
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = searchInput.value.trim();
        window.location.href = `products.html?search=${q}`;
      }
    });
  }

  // Login
  if (loginIcon && loginMenu) {
    loginIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllMenus();
      loginMenu.classList.toggle("active");
    });
  }

  document.addEventListener("click", () => closeAllMenus());

});


// 🖤 TOAST

function showToast(message) {

  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #111;
    color: #fff;
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 0.9rem;
    z-index: 9999;
    opacity: 0;
    transform: translateY(20px);
    transition: 0.3s ease;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  `;

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 2000);
}



// 🛒 CART SYSTEM

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {

  let cart = getCart();

  cart = cart.map(item => ({
    id: item.id,
    qty: parseInt(item.qty) || 1
  }));

  localStorage.setItem("cart", JSON.stringify(cart));

  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  document.querySelectorAll("#cart-count, #cartCount").forEach(el => {
    el.textContent = count;
  });
}

function addToCart(id) {

  let cart = getCart();

  let product = products.find(p => p.id === id);
  let item = cart.find(i => i.id === id);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  saveCart(cart);

  showToast(`🛒 تم إضافة: ${product.title}`);
}


function addFromDetail() {

  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!product) return;

  const qtyInput = document.getElementById("qty");
  const qty = qtyInput ? parseInt(qtyInput.value) : 1;

  let cart = getCart();

  let item = cart.find(i => i.id === product.id);

  if (item) {
    item.qty += qty;
  } else {
    cart.push({ id: product.id, qty: qty });
  }

  saveCart(cart);

  showToast(`🛒 تم إضافة: ${product.title}`);
}


function qty(change) {

  const input = document.getElementById("qty");

  let value = parseInt(input.value) + change;

  if (value < 1) value = 1;
  if (value > 99) value = 99;

  input.value = value;
}



// 📦 PRODUCTS

const products = [

  { id: 1, title: "Hikvision 4MP Dome", price: 129.99, oldPrice: 162.49, discount: "-20%", category: "dome", image: "images/camera1.jpg", images: ["images/camera1.jpg","images/camera2.jpg","images/camera3.jpg","images/camera4.jpg"], desc: "4MP dome camera..." },

  { id: 2, title: "Dahua 5MP Bullet", price: 149.99, oldPrice: 176.46, discount: "-15%", category: "bullet", image: "images/camera2.jpg", images: ["images/camera2.jpg","images/camera1.jpg","images/camera3.jpg","images/camera4.jpg"], desc: "5MP bullet camera..." },

  { id: 3, title: "Axis PTZ Network", price: 899.99, oldPrice: 1199.99, discount: "-25%", category: "ptz", image: "images/camera3.jpg", images: ["images/camera3.jpg","images/camera1.jpg","images/camera2.jpg","images/camera4.jpg"], desc: "PTZ camera..." },

  { id: 4, title: "Ring Stick Up Cam", price: 89.99, oldPrice: 99.99, discount: "-10%", category: "wireless", image: "images/camera4.jpg", images: ["images/camera4.jpg","images/camera1.jpg","images/camera2.jpg","images/camera3.jpg"], desc: "Wireless camera..." },

  { id: 5, title: "Lorex 4K Dome", price: 199.99, oldPrice: 243.89, discount: "-18%", category: "dome", image: "images/camera5.jpg", images: ["images/camera5.jpg","images/camera1.jpg","images/camera2.jpg","images/camera3.jpg"], desc: "4K dome camera..." },

  { id: 6, title: "Reolink RLC-810A", price: 69.99, oldPrice: 99.99, discount: "-30%", category: "bullet", image: "images/camera6.jpg", images: ["images/camera6.jpg","images/camera1.jpg","images/camera2.jpg","images/camera3.jpg"], desc: "PoE camera..." },

  { id: 7, title: "Arlo Pro 4", price: 175.99, oldPrice: 199.99, discount: "-12%", category: "wireless", image: "images/camera7.jpg", images: ["images/camera7.jpg","images/camera1.jpg","images/camera2.jpg","images/camera3.jpg"], desc: "Wireless smart camera..." },

  { id: 8, title: "Bosch AUTODOME", price: 1249.99, oldPrice: 1602.55, discount: "-22%", category: "ptz", image: "images/camera8.jpg", images: ["images/camera8.jpg","images/camera1.jpg","images/camera2.jpg","images/camera3.jpg"], desc: "Professional PTZ dome..." }

];

const $ = id => document.getElementById(id);



// 🔥 FILTER BUTTONS

function filterProducts(type, btn) {

  renderProducts(type);

  document.querySelectorAll(".filter-btn").forEach(button => {
    button.classList.remove("active");
  });

  if (btn) {
    btn.classList.add("active");
  }
}



// 🛍️ RENDER PRODUCTS

function renderProducts(filter = "all") {

  const box = $("products");
  if (!box) return;

  box.innerHTML = products
    .filter(p => filter === "all" || p.category === filter)

    .map(p => `
      <div class="card">

        <img src="${p.image}" alt="${p.title}">

        <div class="body">

          <span class="tag">${p.category}</span>

          <h3>${p.title}</h3>

          <div class="price">
            $${p.price}
            <s>$${p.oldPrice}</s>
            <span class="badge">${p.discount}</span>
          </div>

          <div class="buttons">

            <button class="btn-primary" onclick="addToCart(${p.id})">
              Add to Cart
            </button>

            <button class="btn-secondary" onclick="viewDetails(${p.id})">
              View Details
            </button>

          </div>

        </div>

      </div>
    `)

    .join("");
}



// 📄 DETAILS

function viewDetails(id) {
  const p = products.find(p => p.id === id);
  localStorage.setItem("selectedProduct", JSON.stringify(p));
  location.href = "product-details.html";
}

function loadDetails() {

  const p = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!p) return;

  $("main-img").src = p.images[0];
  $("title").textContent = p.title;
  $("price").textContent = "$" + p.price;
  $("old-price").textContent = "$" + p.oldPrice;
  $("discount").textContent = p.discount;
  $("desc").textContent = p.desc;
  $("category").textContent = p.category;

  $("thumbs").innerHTML = p.images.map(img =>
    `<img src="${img}" onclick="setImage('${img}')">`
  ).join("");
}

function setImage(src) {
  $("main-img").src = src;
}



// 🚀 START
document.addEventListener("DOMContentLoaded", () => {

  updateCartCount();

  if ($("products")) {
    renderProducts();
  }

  if ($("main-img")) {
    loadDetails();
  }

  renderCart();  
});




// 🛒 عرض محتويات السلة


function removeFromCart(id){

  let cart = getCart();

  cart = cart.filter(item => item.id !== id);

  saveCart(cart);

  renderCart();
}
function renderCart() {

    const cartContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if (!cartContainer) return;

    const cart = getCart();

    if(cart.length === 0){
        cartContainer.innerHTML = "<h2>Your cart is empty</h2>";
        if(totalElement) totalElement.textContent="$0.00";
        return;
    }

    let total = 0;
    cartContainer.innerHTML = "";

    cart.forEach(item=>{

        const product = products.find(p=>p.id===item.id);

        if(!product) return;

        total += product.price * item.qty;

       cartContainer.innerHTML += `
    <div class="cart-card">

    <img src="${product.image}" alt="${product.title}">

    <div class="cart-info">

        <h2>${product.title}</h2>

        <p class="price">$${product.price}</p>

        <div class="qty-box">
            <span>Quantity : ${item.qty}</span>
        </div>

        <button class="remove-btn" onclick="removeFromCart(${product.id})">
            🗑 Remove
        </button>

    </div>

</div>
`;
    });

    totalElement.textContent="$"+total.toFixed(2);
}

document.addEventListener("DOMContentLoaded", renderCart);