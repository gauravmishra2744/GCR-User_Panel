// Shared functionality across pages
function handleSearch(event) {
    if (event) event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const searchQuery = searchInput.value.trim();
        if (searchQuery) {
            window.location.href = `view_all.html?search=${encodeURIComponent(searchQuery)}`;
        }
    }
}

function setupHeaderSearch() {
    const searchForm = document.querySelector('form.d-flex');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
}

// Cart operations are now handled by CartState
function updateCartCount() {
    if (window.CartState && CartState.instance) {
        const totals = CartState.instance.getTotals();
        const badges = document.querySelectorAll('.cart-count');
        badges.forEach(badge => {
            badge.textContent = totals.itemCount;
        });
    }
}

function addToCart(product) {
    try {
        // Ensure CartState is initialized
        if (!window.CartState || !CartState.instance) {
            CartState.init();
        }
        
        // Validate product data
        if (!product || !product.id || !product.name || !product.price) {
            throw new Error('Invalid product data');
        }

        // Add item to cart
        CartState.instance.addItem(product);
        
        // Show success message
        ToastManager.show('Success', `Added ${product.name} to cart!`, {
            type: 'success',
            action: {
                text: 'View Cart',
                onClick: () => window.location.href = '/cart.html'
            }
        });
        // Show mini cart preview
        showMiniCartPreview();
    } catch (error) {
        console.error('Error adding product to cart:', error);
        ToastManager.show('Error', 'Error adding product to cart', { type: 'error' });
    }
}



function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '1050';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    document.getElementById('toastContainer').appendChild(toast);
    new bootstrap.Toast(toast).show();
}

// Format currency consistently
function formatPrice(price) {
    return `₹${price.toFixed(2)}`;
}

// Initialize all pages with common functionality
document.addEventListener('DOMContentLoaded', function() {
    setupHeaderSearch();
    updateCartCount();
});