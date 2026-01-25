const stripe = Stripe('your_publishable_key_here'); // From Stripe Dashboard

// 1. Mock Data (In a real app, you fetch this from your Node.js API)
const products = [
    { id: 'prod_1', name: 'Wireless Headphones', price: 99.00, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
    { id: 'prod_2', name: 'Smart Watch', price: 149.00, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
    { id: 'prod_3', name: 'Mechanical Keyboard', price: 89.00, img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200' }
];

let cart = [];

// 2. Render Products
function displayProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(product => `
        <div class="card">
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button class="btn-primary" onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
    `).join('');
}

// 3. Cart Functions
function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCartUI();
    document.getElementById('cart-sidebar').classList.add('active');
}

function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const count = document.getElementById('cart-count');
    const total = document.getElementById('cart-total');

    count.innerText = cart.length;
    list.innerHTML = cart.map((item, index) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span>${item.name}</span>
            <span>$${item.price}</span>
        </div>
    `).join('');

    const sum = cart.reduce((acc, item) => acc + item.price, 0);
    total.innerText = sum.toFixed(2);
}

// 4. Interaction Events
document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.toggle('active');
document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('active');
document.getElementById('login-btn').onclick = () => document.getElementById('login-modal').style.display = 'block';
window.onclick = (e) => { if(e.target.className === 'modal') e.target.style.display = 'none'; };

// 5. Real Checkout Integration
document.getElementById('checkout-button').onclick = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");

    // Send cart data to your Node.js server
    const response = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
    });

    const session = await response.json();
    // Redirect to Stripe's secure page
    await stripe.redirectToCheckout({ sessionId: session.id });
};

// Initialize
displayProducts();