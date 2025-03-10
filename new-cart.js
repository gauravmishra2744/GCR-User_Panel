// Cart state management with improved initialization and error handling
class CartState {
    static instance = null;
    
    constructor() {
        this.items = [];
        this.listeners = [];
        this.loadFromStorage();
    }

    static init() {
        if (!CartState.instance) {
            CartState.instance = new CartState();
            window.CartState = CartState.instance;
        }
        return CartState.instance;
    }

    loadFromStorage() {
        try {
            const savedCart = localStorage.getItem('cart');
            this.items = savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.items = [];
        }
        this.notifyListeners();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener());
    }

    persist() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.notifyListeners();
    }

    addItem(product, quantity = 1) {
        if (!product || !product.id) return;
        
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image
            });
        }
        this.persist();
        updateCartCount(); // Update cart badge
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.persist();
        updateCartCount(); // Update cart badge
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, newQuantity);
            if (item.quantity === 0) {
                this.removeItem(productId);
            } else {
                this.persist();
            }
        }
    }

    clear() {
        this.items = [];
        this.persist();
        updateCartCount(); // Update cart badge
    }

    getTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 50 : 0; // Fixed shipping cost
        const tax = subtotal * 0.18; // 18% GST
        return {
            subtotal,
            shipping,
            tax,
            total: subtotal + shipping + tax,
            itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0)
        };
    }
}

class CartUI {
    constructor() {
        CartState.init(); // Ensure CartState is initialized
        this.bindElements();
        this.setupEventListeners();
        this.render();
    }

    bindElements() {
        this.cartItemsContainer = document.querySelector('.cart-items');
        this.emptyCartMessage = document.querySelector('.empty-cart-message');
        this.clearCartButton = document.querySelector('.clear-cart');
        this.continueShoppingButton = document.querySelector('.continue-shopping');
        this.summaryElements = {
            subtotal: document.getElementById('subtotal-amount'),
            shipping: document.getElementById('shipping-amount'),
            tax: document.getElementById('tax-amount'),
            total: document.getElementById('total-amount')
        };
        this.checkoutButton = document.querySelector('.checkout-btn');
    }

    setupEventListeners() {
        // Delegate events for cart items
        if (this.cartItemsContainer) {
            this.cartItemsContainer.addEventListener('click', (e) => {
                const target = e.target;
                const cartItem = target.closest('.cart-item');
                if (!cartItem) return;

                const productId = cartItem.dataset.productId;

                if (target.matches('.remove-item')) {
                    CartState.instance.removeItem(productId);
                    this.render();
                } else if (target.matches('.quantity-decrease')) {
                    const currentQty = CartState.instance.getItemQuantity(productId);
                    CartState.instance.updateQuantity(productId, currentQty - 1);
                    this.render();
                } else if (target.matches('.quantity-increase')) {
                    const currentQty = CartState.instance.getItemQuantity(productId);
                    CartState.instance.updateQuantity(productId, currentQty + 1);
                    this.render();
                }
            });
        }

        // Clear cart button
        if (this.clearCartButton) {
            this.clearCartButton.addEventListener('click', () => {
                CartState.instance.clear();
                this.render();
            });
        }

        // Continue shopping button
        if (this.continueShoppingButton) {
            this.continueShoppingButton.addEventListener('click', () => {
                window.location.href = 'products.html';
            });
        }

        // Subscribe to cart changes
        CartState.instance.subscribe(() => this.render());
    }

    render() {
        if (!this.cartItemsContainer) return;

        const items = CartState.instance.items;
        const totals = CartState.instance.getTotals();

        // Toggle empty cart message
        if (this.emptyCartMessage) {
            this.emptyCartMessage.classList.toggle('d-none', items.length > 0);
        }

        // Render items
        this.renderItems(items);

        // Update summary
        this.updateSummary(totals);

        // Update checkout button
        if (this.checkoutButton) {
            this.checkoutButton.disabled = items.length === 0;
        }

        // Update cart badge
        updateCartCount();
    }

    renderItems(items) {
        if (!this.cartItemsContainer) return;

        this.cartItemsContainer.innerHTML = items.map(item => `
            <div class="card mb-3 cart-item" data-product-id="${item.id}">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image || 'placeholder.jpg'}" class="img-fluid rounded" alt="${item.name}">
                        </div>
                        <div class="col-md-4">
                            <h5 class="card-title mb-0">${item.name}</h5>
                            <small class="text-muted">Product ID: ${item.id}</small>
                        </div>
                        <div class="col-md-2">
                            <div class="quantity-controls d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary quantity-decrease">-</button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary quantity-increase">+</button>
                            </div>
                        </div>
                        <div class="col-md-2 text-end">
                            <span class="fw-bold">₹${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div class="col-md-2 text-end">
                            <button class="btn btn-sm btn-danger remove-item">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateSummary({ subtotal, shipping, tax, total }) {
        if (this.summaryElements.subtotal) {
            this.summaryElements.subtotal.textContent = `₹${subtotal.toFixed(2)}`;
        }
        if (this.summaryElements.shipping) {
            this.summaryElements.shipping.textContent = `₹${shipping.toFixed(2)}`;
        }
        if (this.summaryElements.tax) {
            this.summaryElements.tax.textContent = `₹${tax.toFixed(2)}`;
        }
        if (this.summaryElements.total) {
            this.summaryElements.total.textContent = `₹${total.toFixed(2)}`;
        }
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartUI();
});

// Export for use in other files
window.CartState = CartState;
window.CartUI = CartUI;