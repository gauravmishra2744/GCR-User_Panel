// Store all products globally
let currentProducts = [];

document.addEventListener('DOMContentLoaded', async function() {
    // Show loading animation
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.classList.remove('d-none');
    
    try {
        await loadProducts();
        setupEventListeners();
        updateCartCount();
        
        // Initialize tooltips
        const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltips.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    } catch (error) {
        console.error('Error initializing products page:', error);
        showToast('Error loading products. Please try again.', 'danger');
    } finally {
        if (spinner) spinner.classList.add('d-none');
    }
});

function setupEventListeners() {
    // Search functionality with debounce
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => filterProducts(), 300);
        });
    }

    // Sort functionality
    document.querySelectorAll('[data-sort]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            sortProducts(this.dataset.sort);
        });
    });

    // Filter changes
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }

    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    // Add card hover effects
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

async function loadProducts() {
    try {
        // Add small delay for loading animation
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const response = await fetch('products.json');
        const data = await response.json();
        currentProducts = data.products;
        
        // Add fade-in animation to container
        const container = document.getElementById('productsContainer');
        container.style.opacity = '0';
        
        setTimeout(() => {
            renderProducts(currentProducts);
            updateProductCount(currentProducts.length);
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
            
            // Add individual card animations
            document.querySelectorAll('.card').forEach((card, index) => {
                card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
            });
        }, 100);
        
    } catch (error) {
        console.error('Error loading products:', error);
        throw error;
    }
}

function renderProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No products match your current filters.
                </div>
            </div>`;
        return;
    }

    container.innerHTML = `
        <div class="row">
            ${products.map((product, index) => `
                <div class="col-md-3 mb-4" style="animation: fadeIn 0.3s ease-out forwards ${index * 0.1}s">
                    <div class="card h-100 btn-ripple">
                        <div class="card-img-wrapper">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <div class="card-badges">
                                ${product.stock < 10 ? '<span class="badge bg-danger">Low Stock</span>' : ''}
                                ${product.rating >= 4.5 ? '<span class="badge bg-success">Top Rated</span>' : ''}
                            </div>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <div class="rating mb-2">
                                ${generateStarRating(product.rating)}
                                <small class="text-muted ms-2">(${product.stock} in stock)</small>
                            </div>
                            <p class="card-text flex-grow-1">${product.description}</p>
                            <div class="mt-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="h5 mb-0">₹${product.price.toFixed(2)}</span>
                                    <div class="btn-group">
                                        <a href="product-details.html?id=${product.id}" 
                                           class="btn btn-sm btn-outline-primary btn-ripple"
                                           data-bs-toggle="tooltip" title="View product details">
                                            <i class="fas fa-info-circle"></i> Details
                                        </a>
                                        <button onclick="addToCart(${JSON.stringify(product)})" 
                                                class="btn btn-sm btn-primary btn-ripple add-to-cart"
                                                data-bs-toggle="tooltip" title="Add to shopping cart">
                                            <i class="fas fa-shopping-cart"></i> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-overlay">
                            <div class="overlay-content">
                                <button class="btn btn-light btn-sm me-2" onclick="addToWishlist(${product.id})">
                                    <i class="far fa-heart"></i>
                                </button>
                                <button class="btn btn-light btn-sm" onclick="shareProduct(${product.id})">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Reinitialize tooltips for new elements
    const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function generateStarRating(rating) {
    const fullStar = '<i class="fas fa-star"></i>';
    const halfStar = '<i class="fas fa-star-half-alt"></i>';
    const emptyStar = '<i class="far fa-star"></i>';
    
    const stars = [];
    const wholeStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
        if (i < wholeStars) {
            stars.push(fullStar);
        } else if (i === wholeStars && hasHalfStar) {
            stars.push(halfStar);
        } else {
            stars.push(emptyStar);
        }
    }
    
    return stars.join('');
}

function sortProducts(sortType) {
    const products = [...currentProducts];
    
    switch(sortType) {
        case 'price-low':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            products.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            // Assuming products are already sorted by newest
            break;
    }
    
    renderProducts(products);
}

function filterProducts() {
    let filtered = [...currentProducts];
    
    // Price filter
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter && priceFilter.value) {
        const [min, max] = priceFilter.value.split('-').map(Number);
        filtered = filtered.filter(product => {
            if (max) {
                return product.price >= min && product.price <= max;
            }
            return product.price >= min;
        });
    }
    
    // Category filter
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(cb => cb.value);
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(product => 
            selectedCategories.includes(product.category)
        );
    }
    
    // Search filter
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    updateProductCount(filtered.length);
    animateFilterChange(filtered);
}

function updateProductCount(count) {
    const countElement = document.getElementById('productCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Cart functionality
function addToCart(product) {
    if (window.CartState) {
        CartState.addItem(product);
    } else {
        console.error('CartState not initialized');
        showToast('Error adding product to cart', 'error');
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
        badge.textContent = totalItems;
        if (totalItems > 0) {
            badge.classList.remove('d-none');
            badge.classList.add('badge-animation');
        } else {
            badge.classList.add('d-none');
            badge.classList.remove('badge-animation');
        }
    });
}

function animateFilterChange(filteredProducts) {
    const container = document.getElementById('productsContainer');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        renderProducts(filteredProducts);
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 300);
}

// Additional features
function addToWishlist(productId) {
    // Implementation would go here
    showToast('Product added to wishlist!', 'success');
}

function shareProduct(productId) {
    // Implementation would go here
    if (navigator.share) {
        navigator.share({
            title: 'Check out this product!',
            url: window.location.href
        });
    } else {
        showToast('Sharing is not supported on this device', 'info');
    }
}

function showToast(message, type = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '1100';
    
    const toast = document.createElement('div');
    toast.className = `toast show bg-${type} text-white`;
    toast.innerHTML = `
        <div class="toast-header bg-${type} text-white">
            <strong class="me-auto">Notification</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toast);
    document.body.appendChild(toastContainer);
    
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            document.body.removeChild(toastContainer);
        }, 300);
    }, 3000);
}