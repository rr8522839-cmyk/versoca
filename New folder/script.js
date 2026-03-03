// Versoca E-commerce Frontend Logic
// Handles product rendering, localStorage cart, counts, and checkout behavior.

// Key used for localStorage cart
const CART_KEY = "versocaCart";

/**
 * Product catalog used across home and shop pages.
 * Prices are in INR.
 *
 * IMPORTANT:
 * Place the 7 product images in the same folder as your HTML files
 * and name them exactly as in the `image` fields below.
 */
const PRODUCTS = [
  {
    id: "crimson-varsity-jacket",
    name: "Crimson Varsity Jacket",
    price: 5499,
    category: "Unisex",
    tag: "Varsity",
    image: "images/crimson.jpg",
    description:
      "Boxy-fit varsity jacket in deep crimson with contrast leather-look sleeves, heavyweight ribbed trims and bold back graphic for a classic campus-meets-street feel.",
  },
  {
    id: "downtown-baggy-jeans",
    name: "Downtown Baggy Jeans",
    price: 3299,
    category: "Unisex",
    tag: "Denim",
    image: "images/jeans.jpg",
    description:
      "Washed wide-leg denim with soft fade detailing, relaxed seat and pooled hem designed to stack perfectly over sneakers or boots.",
  },
  {
    id: "slatty-crop-top",
    name: "Slatty Crop Top",
    price: 2499,
    category: "Women",
    tag: "Crop",
    image: "images/crop.jpg",
    description:
      "Cropped zip-hoodie inspired piece with a lived-in wash, dropped shoulders and roomy hood, built to layer over tanks and bralettes.",
  },
  {
    id: "shadow-street-jacket",
    name: "Shadow Street Jacket",
    price: 4699,
    category: "Men",
    tag: "Outerwear",
    image: "images/shadow.jpg",
    description:
      "Structured black street jacket with contrast top-stitching and panel lines, giving a strong silhouette that elevates any fit.",
  },
  {
    id: "tactical-cargo-pants",
    name: "Tactical Cargo Pants",
    price: 3199,
    category: "Unisex",
    tag: "Cargo",
    image: "images/cargo.jpg",
    description:
      "Loose-fit cargo pants with multi-utility pockets, adjustable cuffs and a washed camo finish made for heavy rotation.",
  },
  {
    id: "midnight-graphic-tshirt",
    name: "Midnight Graphic T-Shirt",
    price: 1999,
    category: "Unisex",
    tag: "Graphic",
    image: "images/tshirt.jpg",
    description:
      "Oversized midnight tee with cracked front graphic and washed black base, cut with dropped shoulders for a laid-back drape.",
  },
  {
    id: "oversize-noir-hoodie",
    name: "Oversize Noir Hoodie",
    price: 3799,
    category: "Women",
    tag: "New",
    image: "images/hoodie.jpg",
    description:
      "Clean black oversized hoodie with subtle front logo, premium fleece interior and wide sleeves that fall effortlessly over any bottom.",
  },
];

// Build quick lookup map by id
const PRODUCT_MAP = PRODUCTS.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {});

/**
 * Load cart from localStorage.
 */
function loadCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error parsing cart from localStorage", e);
    return [];
  }
}

/**
 * Save cart to localStorage.
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Get total item count from cart.
 */
function getCartItemCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Update cart item count badges in navbar (desktop + mobile).
 */
function updateCartCount() {
  const cart = loadCart();
  const count = getCartItemCount(cart);

  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = count;
  }

  const countMobileEl = document.getElementById("cart-count-mobile");
  if (countMobileEl) {
    countMobileEl.textContent = count;
  }
}

/**
 * Add an item to the cart, updating localStorage and nav count.
 */
function addToCart(productId) {
  const product = PRODUCT_MAP[productId];
  if (!product) return;

  const cart = loadCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartCount();
}

/**
 * Render featured products on the home page.
 */
function renderFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container) return;

  // Use first 4 products as featured
  const featured = PRODUCTS.slice(0, 4);

  container.innerHTML = featured
    .map((product) => createProductCardHTML(product))
    .join("");

  attachAddToCartHandlers(container);
}

/**
 * Render all products on the shop page.
 */
function renderShopProducts() {
  const container = document.getElementById("shop-products");
  if (!container) return;

  container.innerHTML = PRODUCTS.map((product) => createProductCardHTML(product)).join("");

  attachAddToCartHandlers(container);
}

/**
 * Generate HTML for a product card.
 */
function createProductCardHTML(product) {
  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrapper">
        <img class="product-image" src="${product.image}" alt="${product.name}" />
        <span class="product-tag">${product.tag}</span>
      </div>
      <div class="product-body">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-meta">
          <span class="product-price">₹${product.price.toLocaleString()}</span>
          <span class="product-size-label">${product.category}</span>
        </div>
      </div>
      <div class="product-footer">
        <button class="btn secondary-btn add-to-cart-btn" type="button">
          Add to Cart
        </button>
      </div>
    </article>
  `;
}

/**
 * Attach click listeners to add-to-cart buttons within a container.
 */
function attachAddToCartHandlers(container) {
  const buttons = container.querySelectorAll(".add-to-cart-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      if (!card) return;
      const productId = card.getAttribute("data-product-id");
      addToCart(productId);
      btn.textContent = "Added";
      setTimeout(() => {
        btn.textContent = "Add to Cart";
      }, 900);
    });
  });
}

/**
 * Render the cart page based on localStorage.
 */
function renderCartPage() {
  const container = document.getElementById("cart-container");
  const totalEl = document.getElementById("cart-total");

  if (!container || !totalEl) return;

  const cart = loadCart();

  if (cart.length === 0) {
    container.innerHTML = `<p class="cart-empty">Your cart is empty. Start by exploring the <a href="shop.html">shop</a>.</p>`;
    totalEl.textContent = "₹0";
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item" data-product-id="${item.id}">
        <img class="cart-item-image" src="${item.image}" alt="${item.name}" />
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
        </div>
        <div class="cart-qty-controls">
          <button class="cart-qty-btn qty-decrease" type="button">−</button>
          <span class="cart-qty-value">${item.quantity}</span>
          <button class="cart-qty-btn qty-increase" type="button">+</button>
        </div>
        <div class="cart-item-subtotal">
          ₹${(item.price * item.quantity).toLocaleString()}
        </div>
        <button class="cart-remove-btn" type="button">Remove</button>
      </div>
    `
    )
    .join("");

  updateCartTotalDisplay();

  // Attach quantity and remove handlers
  container.addEventListener("click", handleCartClick);
}

/**
 * Cart interaction handler (quantity +/- and remove).
 */
function handleCartClick(event) {
  const target = event.target;
  const itemEl = target.closest(".cart-item");
  if (!itemEl) return;

  const productId = itemEl.getAttribute("data-product-id");
  let cart = loadCart();
  const index = cart.findIndex((item) => item.id === productId);
  if (index === -1) return;

  if (target.classList.contains("qty-increase")) {
    cart[index].quantity += 1;
  } else if (target.classList.contains("qty-decrease")) {
    cart[index].quantity -= 1;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  } else if (target.classList.contains("cart-remove-btn")) {
    cart.splice(index, 1);
  } else {
    return;
  }

  // Persist and re-render
  saveCart(cart);
  updateCartCount();
  rerenderCart();
}

/**
 * Re-render the entire cart UI when it changes.
 */
function rerenderCart() {
  const container = document.getElementById("cart-container");
  const totalEl = document.getElementById("cart-total");
  if (!container || !totalEl) return;

  const cart = loadCart();

  if (cart.length === 0) {
    container.innerHTML = `<p class="cart-empty">Your cart is empty. Start by exploring the <a href="shop.html">shop</a>.</p>`;
    totalEl.textContent = "₹0";
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item" data-product-id="${item.id}">
        <img class="cart-item-image" src="${item.image}" alt="${item.name}" />
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
        </div>
        <div class="cart-qty-controls">
          <button class="cart-qty-btn qty-decrease" type="button">−</button>
          <span class="cart-qty-value">${item.quantity}</span>
          <button class="cart-qty-btn qty-increase" type="button">+</button>
        </div>
        <div class="cart-item-subtotal">
          ₹${(item.price * item.quantity).toLocaleString()}
        </div>
        <button class="cart-remove-btn" type="button">Remove</button>
      </div>
    `
    )
    .join("");

  updateCartTotalDisplay();

  // Re-attach listeners
  container.addEventListener("click", handleCartClick);
}

/**
 * Compute and update total price in cart summary.
 */
function updateCartTotalDisplay() {
  const totalEl = document.getElementById("cart-total");
  if (!totalEl) return;
  const cart = loadCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalEl.textContent = `₹${total.toLocaleString()}`;
}

/**
 * Initialize checkout page behavior: show message on submit and clear cart.
 */
function initCheckoutPage() {
  const form = document.getElementById("checkout-form");
  const messageEl = document.getElementById("checkout-message");
  if (!form || !messageEl) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Basic validation is handled by required attributes; this ensures cart clearing.
    localStorage.removeItem(CART_KEY);
    updateCartCount();

    messageEl.textContent =
      "Thank you for shopping with Versoca. Your order has been placed.";
    messageEl.style.display = "block";

    form.reset();
  });
}

/**
 * Initialize mobile nav toggle.
 */
function initMobileNav() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    const isOpen = mobileNav.style.display === "flex";
    mobileNav.style.display = isOpen ? "none" : "flex";
  });
}

/**
 * Entry point for initializing behavior on every page.
 */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initMobileNav();
  renderFeaturedProducts();
  renderShopProducts();
  renderCartPage();
  initCheckoutPage();

  // Simple checkout flow directly from cart page
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = loadCart();
      if (!cart.length) {
        alert("Your cart is empty.");
        return;
      }
      localStorage.removeItem(CART_KEY);
      updateCartCount();
      rerenderCart();
      alert("Thank you for shopping with Versoca. Your order has been placed.");
    });
  }

  // Basic contact form handler for better UX
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks for reaching out to Versoca. We'll get back to you soon.");
      contactForm.reset();
    });
  }
});

