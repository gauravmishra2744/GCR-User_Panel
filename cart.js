// Initialize cart page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart state
    CartState.init();
    
    // Initialize UI handlers
    const cartUI = new CartUI();
    
    // Setup event listeners
    setupEventListeners();
    
    // Render initial cart state
    renderCart();
});

function setupEventListeners() {
    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                CartState.instance.clear();
                renderCart();
            }
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }
    
    // Cart items container for delegation
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', handleCartItemAction);
    }
}

function handleCartItemAction(event) {
    const target = event.target;
    const cartItem = target.closest('.cart-item');
    if (!cartItem) return;
    
    const productId = cartItem.dataset.productId;
    const product = CartState.instance.items.find(item => item.id === productId);
    
    if (!product) {
        ToastManager.show('Error', 'Product not found in cart', { type: 'error' });
        return;
    }
    
    if (target.matches('.remove-item')) {
        // Add confirmation for remove
        if (confirm('Are you sure you want to remove this item from cart?')) {
            removeFromCart(productId);
            renderCart();
        }
    } else if (target.matches('.quantity-decrease')) {
        const currentQty = parseInt(cartItem.querySelector('.item-quantity').textContent);
        if (currentQty > 1) {
            updateCartItemQuantity(productId, currentQty - 1);
            renderCart();
        }
    } else if (target.matches('.quantity-increase')) {
        const currentQty = parseInt(cartItem.querySelector('.item-quantity').textContent);
        if (currentQty < 10) {
            updateCartItemQuantity(productId, currentQty + 1);
            renderCart();
        } else {
            ToastManager.show('Warning', 'Maximum quantity limit reached', { type: 'warning' });
        }
    }
    
    // Update checkout button state
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = CartState.instance.items.length === 0;
    }
}

function renderCart() {
    const items = CartState.instance.items;
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartItems = document.getElementById('cart-items');
    const cartActions = document.getElementById('cart-actions');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Toggle empty cart message
    if (items.length === 0) {
        emptyCartMessage.classList.remove('d-none');
        cartActions.classList.add('d-none');
        checkoutBtn.disabled = true;
    } else {
        emptyCartMessage.classList.add('d-none');
        cartActions.classList.remove('d-none');
        checkoutBtn.disabled = false;
    }
    
    // Render cart items
    cartItems.innerHTML = items.map(item => `
        <div class="card mb-3 cart-item" data-product-id="${item.id}">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image || 'placeholder.jpg'}" class="img-fluid rounded" alt="${item.name}">
                    </div>
                    <div class="col-md-4">
                        <h5 class="card-title mb-0">${item.name}</h5>
                        <p class="text-muted mb-0">₹${item.price.toFixed(2)}</p>
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary quantity-decrease"${item.quantity <= 1 ? ' disabled' : ''}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-3 item-quantity">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary quantity-increase">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <span class="fw-bold">₹${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-sm btn-outline-danger remove-item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update summary
    updateOrderSummary();
}

function updateOrderSummary() {
    const { subtotal, shipping, tax, total } = getCartTotal();
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `₹${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}