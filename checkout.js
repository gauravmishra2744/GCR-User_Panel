// Checkout functionality
class CheckoutUI {
    constructor() {
        this.bindElements();
        this.setupEventListeners();
        this.loadOrderDetails();
    }

    bindElements() {
        this.orderItemsContainer = document.getElementById('orderItemsContainer');
        this.summaryElements = {
            subtotal: document.getElementById('checkout-subtotal'),
            shipping: document.getElementById('checkout-shipping'),
            tax: document.getElementById('checkout-tax'),
            total: document.getElementById('checkout-total')
        };
        this.checkoutForm = document.getElementById('checkoutForm');
        this.backToCartBtn = document.querySelector('.back-to-cart');
    }

    setupEventListeners() {
        if (window.CartState) {
            CartState.subscribe(() => this.loadOrderDetails());
        }

        if (this.checkoutForm) {
            this.checkoutForm.addEventListener('submit', (e) => this.handleCheckoutSubmit(e));
        }

        if (this.backToCartBtn) {
            this.backToCartBtn.addEventListener('click', () => this.redirectToCart());
        }
    }

    loadOrderDetails() {
        this.populateOrderItems();
        this.updateOrderSummary();
        this.prefillShippingForm();
    }

    populateOrderItems() {
        if (!window.CartState || !this.orderItemsContainer) return;
        
        const items = CartState.items;
        
        if (items.length === 0) {
            this.redirectToCart();
            return;
        }
        
        this.orderItemsContainer.innerHTML = items.map(item => `
            <div class="card mb-3 border-0">
                <div class="row g-0">
                    <div class="col-2">
                        <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
                    </div>
                    <div class="col-10">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 class="card-title mb-1">${item.name}</h5>
                                    <p class="text-muted small mb-0">Quantity: ${item.quantity}</p>
                                </div>
                                <span class="text-primary">₹${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateOrderSummary() {
        if (!window.CartState || !this.summaryElements) return;
        
        const { subtotal, shipping, tax, total } = CartState.getTotals();
        
        this.summaryElements.subtotal.textContent = `₹${subtotal.toFixed(2)}`;
        this.summaryElements.shipping.textContent = `₹${shipping.toFixed(2)}`;
        this.summaryElements.tax.textContent = `₹${tax.toFixed(2)}`;
        this.summaryElements.total.textContent = `₹${total.toFixed(2)}`;
    }

    prefillShippingForm() {
        // Get user details from localStorage if available
        const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
        
        Object.entries(userDetails).forEach(([field, value]) => {
            const input = document.getElementById(field);
            if (input) {
                input.value = value;
            }
        });
    }

    redirectToCart() {
        window.location.href = 'cart.html';
    }

    async handleCheckoutSubmit(e) {
        e.preventDefault();
        
        if (!window.CartState) {
            showToast('Error processing checkout', 'error');
            return;
        }

        if (CartState.items.length === 0) {
            showToast('Your cart is empty', 'error');
            this.redirectToCart();
            return;
        }

        const formData = new FormData(this.checkoutForm);
        const orderData = {
            items: CartState.items,
            totals: CartState.getTotals(),
            shipping: Object.fromEntries(formData.entries()),
            orderDate: new Date().toISOString(),
            orderId: 'ORD' + Date.now()
        };

        try {
            // Validate required fields
            const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zip'];
            const missingFields = requiredFields.filter(field => !orderData.shipping[field]);
            
            if (missingFields.length > 0) {
                showToast('Please fill in all required fields', 'error');
                return;
            }

            // Save order details
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Save shipping details for future use
            localStorage.setItem('userDetails', JSON.stringify(orderData.shipping));

            // Clear cart
            CartState.clear();

            // Redirect to order success page
            window.location.href = `order-success.html?orderId=${orderData.orderId}`;
        } catch (error) {
            console.error('Error processing checkout:', error);
            showToast('Error processing checkout', 'error');
        }
    }
}

// Initialize checkout functionality
document.addEventListener('DOMContentLoaded', () => {
    if (!window.CartState) {
        showToast('Error: Cart system not initialized', 'error');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 2000);
        return;
    }
    new CheckoutUI();
});