// Cart Manager - Handles all cart-related operations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart
    CartState.init();
    updateCartBadgeCount();
});

// Update cart badge count
function updateCartBadgeCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = CartState.instance.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Add product to cart
function addToCart(product) {
    if (!product || !product.id) {
        console.error('Invalid product data');
        return;
    }

    try {
        // Check if product already exists in cart
        const existingItem = CartState.instance.items.find(item => item.id === product.id);
        if (existingItem && existingItem.quantity >= 10) {
            ToastManager.show('Warning', 'Maximum quantity limit reached for this item', { type: 'warning' });
            return;
        }

        CartState.instance.addItem(product);
        
        // Show success toast with action button
        ToastManager.show('Success', 'Product added to cart successfully!', {
            type: 'success',
            action: {
                text: 'View Cart',
                onClick: () => window.location.href = 'cart.html'
            }
        });
        
        // Update UI
        updateCartBadgeCount();
        document.dispatchEvent(new CustomEvent('cart-updated'));
        
        // Show mini cart preview
        showMiniCartPreview();
    } catch (error) {
        console.error('Error adding product to cart:', error);
        ToastManager.show('Error', 'Failed to add product to cart', { type: 'error' });
    }
}

// Remove product from cart
function removeFromCart(productId) {
    if (!productId) return;

    try {
        CartState.instance.removeItem(productId);
        ToastManager.show('Success', 'Product removed from cart', { type: 'success' });
        updateCartBadgeCount();
        document.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (error) {
        console.error('Error removing product from cart:', error);
        ToastManager.show('Error', 'Failed to remove product from cart', { type: 'error' });
    }
}

// Update product quantity
function updateCartItemQuantity(productId, newQuantity) {
    if (!productId) return;

    try {
        // Validate quantity
        if (newQuantity < 1) {
            ToastManager.show('Error', 'Quantity cannot be less than 1', { type: 'error' });
            return;
        }
        if (newQuantity > 10) {
            ToastManager.show('Error', 'Maximum quantity limit is 10 items', { type: 'error' });
            return;
        }

        // Update quantity
        CartState.instance.updateQuantity(productId, newQuantity);
        updateCartBadgeCount();
        
        // Show success message
        ToastManager.show('Success', 'Cart updated successfully', { type: 'success' });
        
        // Update UI components
        updateOrderSummary();
        document.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (error) {
        console.error('Error updating quantity:', error);
        ToastManager.show('Error', 'Failed to update quantity', { type: 'error' });
    }
}

// Get cart subtotal
function getCartSubtotal() {
    return CartState.instance.items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart total with tax and shipping
function getCartTotal() {
    const subtotal = getCartSubtotal();
    const shipping = subtotal > 0 ? 50 : 0; // Example shipping cost
    const tax = subtotal * 0.18; // 18% GST
    return {
        subtotal,
        shipping,
        tax,
        total: subtotal + shipping + tax
    };
}

// Format price in Indian Rupees
function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

// Show toast notification
function showToast(title, message) {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    toastContainer.appendChild(toast);
    new bootstrap.Toast(toast).show();
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}