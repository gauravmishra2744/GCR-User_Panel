// Product interaction functionality
function attachQuickViewListeners() {
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = btn.dataset.productId;
            try {
                const product = await fetchProductDetails(productId);
                quickView.show(product);
            } catch (error) {
                console.error('Error fetching product details:', error);
                ToastManager.show('Error', 'Failed to load product details', { type: 'error' });
            }
        });
    });
}

function toggleWishlist(product) {
    try {
        if (!WishlistState.instance.hasItem(product.id)) {
            WishlistState.instance.addItem(product);
            ToastManager.show('Success', 'Added to wishlist', {
                type: 'success',
                action: {
                    text: 'View Wishlist',
                    onClick: () => window.location.href = '/wishlist.html'
                }
            });
        } else {
            WishlistState.instance.removeItem(product.id);
            ToastManager.show('Success', 'Removed from wishlist', { type: 'success' });
        }
        
        // Update wishlist button states
        updateWishlistButtons();
    } catch (error) {
        console.error('Error updating wishlist:', error);
        ToastManager.show('Error', 'Failed to update wishlist', { type: 'error' });
    }
}

function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = btn.dataset.productId;
        const isInWishlist = WishlistState.instance.hasItem(productId);
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isInWishlist ? 'fas fa-heart text-danger' : 'far fa-heart';
        }
    });
}

function shareProduct(platform, productData) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(productData.name);
    
    let shareUrl = '';
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${title}%20-%20${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=Check%20this%20out:%20${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Initialize product interactions
document.addEventListener('DOMContentLoaded', () => {
    attachQuickViewListeners();
    updateWishlistButtons();
});