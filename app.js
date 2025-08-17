// --- Fake product data ---
const products = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    price: 60.00,
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Fresh Carrots',
    price: 40.00,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Brown Eggs (12 pack)',
    price: 90.00,
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Organic Apples',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    name: 'Basmati Rice (1kg)',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 6,
    name: 'Fresh Spinach',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 7,
    name: 'Sweet Corn (4 pcs)',
    price: 50.00,
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 8,
    name: 'Desi Cow Milk (1L)',
    price: 60.00,
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 9,
    name: 'Raw Honey (500g)',
    price: 220.00,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 10,
    name: 'Red Onions (1kg)',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 11,
    name: 'Potatoes (1kg)',
    price: 30.00,
    image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
  },
];

// --- Cart logic ---
const CART_KEY = 'farmtohome_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function addToCart(productId) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === productId);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  setCart(cart);
  updateCartCount();
}
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  setCart(cart);
  updateCartCount();
}
function updateCartQty(productId, qty) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === productId);
  if (idx > -1) {
    cart[idx].qty = qty;
    if (cart[idx].qty < 1) cart.splice(idx, 1);
    setCart(cart);
    updateCartCount();
  }
}
function getProductById(id) {
  return products.find(p => p.id === id);
}
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const prod = getProductById(item.id);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);
}
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count').textContent = count;
}

// --- Render products ---
function renderProducts() {
  const grid = document.getElementById('products-list');
  grid.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-name">${product.name}</div>
      <div class="product-price">₹${product.price.toFixed(2)}</div>
      <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
  // Add event listeners
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(btn.getAttribute('data-id'));
      addToCart(id);
      showCartModal();
      renderCart();
    });
  });
}

// --- Cart Modal ---
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');

function showCartModal() {
  cartModal.classList.add('active');
}
function hideCartModal() {
  cartModal.classList.remove('active');
}
cartBtn.addEventListener('click', e => {
  e.preventDefault();
  renderCart();
  showCartModal();
});
closeCartBtn.addEventListener('click', hideCartModal);
window.addEventListener('click', e => {
  if (e.target === cartModal) hideCartModal();
});

function renderCart() {
  const cart = getCart();
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<div style="text-align:center;color:#888;">Your cart is empty.</div>';
    cartTotalSpan.textContent = '0.00';
    return;
  }
  cartItemsDiv.innerHTML = '';
  cart.forEach(item => {
    const prod = getProductById(item.id);
    if (!prod) return;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span class="cart-item-name">${prod.name}</span>
      <span>
        <button class="cart-item-remove" title="Remove" data-id="${prod.id}">&times;</button>
        <input type="number" min="1" value="${item.qty}" class="cart-item-qty" data-id="${prod.id}" style="width:2.5em;text-align:center;">
        x ₹${prod.price.toFixed(2)}
      </span>
    `;
    cartItemsDiv.appendChild(div);
  });
  // Remove
  cartItemsDiv.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(btn.getAttribute('data-id'));
      removeFromCart(id);
      renderCart();
    });
  });
  // Qty change
  cartItemsDiv.querySelectorAll('.cart-item-qty').forEach(input => {
    input.addEventListener('change', e => {
      const id = parseInt(input.getAttribute('data-id'));
      let qty = parseInt(input.value);
      if (isNaN(qty) || qty < 1) qty = 1;
      updateCartQty(id, qty);
      renderCart();
    });
  });
  cartTotalSpan.textContent = '₹' + getCartTotal().toFixed(2);
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  alert('Thank you for shopping with FarmToHome! (Demo only)');
  setCart([]);
  renderCart();
  updateCartCount();
  hideCartModal();
});

// --- Navigation highlight ---
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// --- On load ---
renderProducts();
updateCartCount();
