// Wishlist page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadWishlist();
    setupFilters();
    setupSearch();
    setupLogout();
});

function loadWishlist() {
    // Simulated wishlist data - replace with actual API call
    const wishlistItems = [
        {
            id: '789',
            name: 'Wireless Earbuds',
            price: 99.99,
            image: 'images/products/earbuds.jpg',
            dateAdded: '2023-08-10',
            inStock: true
        },
        // Add more items as needed
    ];

    updateWishlistItems(wishlistItems);
}

function updateWishlistItems(items) {
    const wishlistContainer = document.getElementById('wishlistItems');
    wishlistContainer.innerHTML = items.map(item => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100">
                <img src="${item.image}" class="card-img-top" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">
                        <strong>$${item.price.toFixed(2)}</strong><br>
                        <small class="text-muted">Added on ${new Date(item.dateAdded).toLocaleDateString()}</small>
                    </p>
                    <div class="d-grid gap-2">
                        ${item.inStock ? 
                            `<button class="btn btn-primary" onclick="addToCart('${item.id}')">Add to Cart</button>` :
                            `<button class="btn btn-secondary" disabled>Out of Stock</button>`
                        }
                        <button class="btn btn-outline-danger" onclick="removeFromWishlist('${item.id}')">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    document.getElementById('sortBy').addEventListener('change', filterWishlist);
    document.getElementById('priceRange').addEventListener('change', filterWishlist);
}

function setupSearch() {
    document.getElementById('wishlistSearch').addEventListener('input', filterWishlist);
}

function filterWishlist() {
    const sortBy = document.getElementById('sortBy').value;
    const priceRange = document.getElementById('priceRange').value;
    const searchQuery = document.getElementById('wishlistSearch').value.toLowerCase();

    // Implement filtering and sorting logic here
    loadWishlist(); // Reload and filter wishlist items
}

function addToCart(productId) {
    // Implement add to cart functionality
    console.log('Adding product to cart:', productId);
    // Make API call to add item to cart
    showToast('Item added to cart successfully!');
}

function removeFromWishlist(productId) {
    // Implement remove from wishlist functionality
    console.log('Removing product from wishlist:', productId);
    // Make API call to remove item from wishlist
    showToast('Item removed from wishlist');
}

function setupLogout() {
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        // Clear user session
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userToken');
        
        // Redirect to login page
        window.location.href = 'login.html';
    });
}

function showToast(message) {
    // Implement toast notification
    alert(message); // Replace with proper toast implementation
}