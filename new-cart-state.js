// Enhanced Cart State Management
class CartState {
    static instance = null;

    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    static init() {
        if (!CartState.instance) {
            CartState.instance = new CartState();
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
        this.saveToStorage();
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        document.dispatchEvent(new CustomEvent('cart-updated'));
    }

    addItem(product) {
        if (!product || !product.id) return;

        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity < 10) {
                existingItem.quantity++;
            }
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        this.saveToStorage();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item && newQuantity > 0 && newQuantity <= 10) {
            item.quantity = newQuantity;
            this.saveToStorage();
        }
    }

    clearCart() {
        this.items = [];
        this.saveToStorage();
    }

    getTotals() {
        const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 50 : 0;
        const tax = subtotal * 0.18;
        
        return {
            itemCount,
            subtotal,
            shipping,
            tax,
            total: subtotal + shipping + tax
        };
    }
}

// Initialize cart state
CartState.init();