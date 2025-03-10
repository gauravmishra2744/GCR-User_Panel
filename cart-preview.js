// Mini cart preview functionality
function showMiniCartPreview() {
    const preview = document.createElement('div');
    preview.className = 'mini-cart-preview';
    
    // Add CSS file if not already present
    if (!document.querySelector('link[href="cart-preview.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'cart-preview.css';
        document.head.appendChild(link);
    }
    
    const items = CartState.instance.items;
    const total = getCartTotal();
    
    preview.innerHTML = `
        <div class="mini-cart-header">
            <h4>Cart Preview</h4>
            <button class="close-preview">&times;</button>
        </div>
        <div class="mini-cart-items">
            ${items.slice(0, 3).map(item => `
                <div class="mini-cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <p class="item-name">${item.name}</p>
                        <p class="item-quantity">Qty: ${item.quantity}</p>
                        <p class="item-price">₹${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>
            `).join('')}
            ${items.length > 3 ? `<p class="more-items">+${items.length - 3} more items</p>` : ''}
        </div>
        <div class="mini-cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span>₹${total.total.toFixed(2)}</span>
            </div>
            <div class="cart-actions">
                <button onclick="window.location.href='cart.html'" class="view-cart-btn">View Cart</button>
                <button onclick="window.location.href='checkout.html'" class="checkout-btn">Checkout</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(preview);
    
    // Add close functionality
    preview.querySelector('.close-preview').addEventListener('click', () => {
        preview.remove();
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (document.body.contains(preview)) {
            preview.remove();
        }
    }, 5000);
}