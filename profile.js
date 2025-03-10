// Profile functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize profile page
    loadProfileInfo();
    loadOrders();
    loadWishlist();
    initializeMenuHandlers();
    setupLogout();
});

// Menu handling
function initializeMenuHandlers() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.profile-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });
}

// Profile Information
function loadProfileInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    document.getElementById('fullName').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('address').value = user.address || '';
}

function addLoadingAnimation(element) {
    element.classList.add('loading-shimmer');
    return () => element.classList.remove('loading-shimmer');
}

function saveProfileInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const updatedUser = {
        ...user,
        name: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    showToast('Profile information updated successfully');
}

// Orders
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>No orders found.</p>';
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <h3>Order #${order.id}</h3>
                    <p>Placed on: ${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                    <span class="order-status">${order.status}</span>
                    <p>Total: $${order.total.toFixed(2)}</p>
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" width="50">
                        <span>${item.name}</span>
                        <span>Qty: ${item.quantity}</span>
                        <span>$${item.price.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Setup order filters
    document.getElementById('orderTimeFilter').addEventListener('change', filterOrders);
    document.getElementById('orderSearch').addEventListener('input', filterOrders);
}

function updateOrdersList(orders) {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>No orders found.</p>';
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <h3>Order #${order.id}</h3>
                    <p>Placed on: ${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                    <span class="order-status">${order.status}</span>
                    <p>Total: $${order.total.toFixed(2)}</p>
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" width="50">
                        <span>${item.name}</span>
                        <span>Qty: ${item.quantity}</span>
                        <span>$${item.price.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function filterOrders() {
    const timeFilter = document.getElementById('orderTimeFilter').value;
    const searchQuery = document.getElementById('orderSearch').value.toLowerCase();
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const filteredOrders = orders.filter(order => {
        const matchesTime = timeFilter === 'all' || 
            (timeFilter === 'last30' && isWithinDays(order.date, 30)) ||
            (timeFilter === 'last6months' && isWithinMonths(order.date, 6)) ||
            (timeFilter === '2023' && isInYear(order.date, 2023));
            
        const matchesSearch = searchQuery === '' || 
            order.items.some(item => item.name.toLowerCase().includes(searchQuery));
            
        return matchesTime && matchesSearch;
    });
    
    updateOrdersList(filteredOrders);
}

// Wishlist
function loadWishlist() {
    const wishlistItems = document.getElementById('wishlistItems');
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<p>Your wishlist is empty.</p>';
        return;
    }
    
    wishlistItems.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <button onclick="moveToCart(${item.id})" class="add-to-cart-btn">Add to Cart</button>
            <button onclick="removeFromWishlist(${item.id})" class="remove-btn">Remove</button>
        </div>
    `).join('');

    // Setup wishlist sorting
    document.getElementById('wishlistSort').addEventListener('change', sortWishlist);
}

function moveToCart(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const item = wishlist.find(item => item.id === productId);
    
    if (item) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({...item, quantity: 1});
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        removeFromWishlist(productId);
        showToast('Item added to cart');
    }
    
    if (item) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({...item, quantity: 1});
        localStorage.setItem('cart', JSON.stringify(cart));
        
        removeFromWishlist(productId);
        showToast('Item added to cart');
    }
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();
    showToast('Item removed from wishlist');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    }
}

function sortWishlist() {
    const sortType = document.getElementById('wishlistSort').value;
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    switch (sortType) {
        case 'price-low':
            wishlist.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            wishlist.sort((a, b) => b.price - a.price);
            break;
        case 'date-added':
            // Assuming items have a dateAdded property
            wishlist.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();
}

// Settings
function saveSettings() {
    const settings = {
        orderUpdates: document.getElementById('orderUpdates').checked,
        promotions: document.getElementById('promotions').checked,
        newsletter: document.getElementById('newsletter').checked
    };
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
    showToast('Settings saved successfully');
}

// Logout functionality
function setupLogout() {
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
}

// Utility functions
function isWithinDays(date, days) {
    const orderDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
}

function isWithinMonths(date, months) {
    const orderDate = new Date(date);
    const now = new Date();
    const diffMonths = (now.getFullYear() - orderDate.getFullYear()) * 12 + 
                      now.getMonth() - orderDate.getMonth();
    return diffMonths <= months;
}

function isInYear(date, year) {
    return new Date(date).getFullYear() === year;
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}