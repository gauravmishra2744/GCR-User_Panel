// Enhanced home page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeHomePage();
    setupScrollAnimations();
    loadTrendingProducts();
    initializeSearchSuggestions();
});

async function initializeHomePage() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        
        // Initialize different sections
        renderCategories(data.categories);
        renderFeaturedProducts(data.products.filter(p => p.tags.includes('featured')));
        renderTrendingProducts(data.products.filter(p => p.tags.includes('trending')));
        renderNewArrivals(data.products.filter(p => p.tags.includes('new-arrival')));
        
        // Show success message
        showToast('Welcome to our store!');
    } catch (error) {
        console.error('Error initializing home page:', error);
        showToast('Error loading content. Please try again.', 'error');
    }
}

function renderCategories(categories) {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;

    categories.forEach(category => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-2 mb-4 category-item';
        col.innerHTML = `
            <div class="category-card" style="background: ${category.color}">
                <a href="products.html?category=${category.id}" class="text-decoration-none">
                    <div class="card h-100 border-0 bg-transparent">
                        <div class="card-body text-center text-white">
                            <i class="${category.icon} fa-2x mb-3"></i>
                            <h5 class="card-title mb-0">${category.name}</h5>
                            <p class="card-text small">${category.description}</p>
                        </div>
                    </div>
                </a>
            </div>
        `;
        container.appendChild(col);
    });
}

function renderFeaturedProducts(products) {
    const container = document.getElementById('featuredContainer');
    if (!container) return;
    
    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3 mb-4 product-item';
        col.innerHTML = `
            <div class="card h-100 product-card">
                <div class="position-relative overflow-hidden">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="product-overlay">
                        <div class="d-flex justify-content-around">
                            <button class="btn btn-sm btn-light" onclick="quickView(${product.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-light" onclick="toggleWishlist(${product.id})">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="btn btn-sm btn-light" onclick="shareProduct(${product.id})">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="badge bg-primary mb-2">${product.tags[0]}</div>
                    <h5 class="card-title">${product.name}</h5>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <p class="card-text mb-0">₹${product.price.toFixed(2)}</p>
                        <div class="rating text-warning">
                            ${generateStarRating(product.rating)}
                        </div>
                    </div>
                    <p class="card-text small text-muted">
                        ${product.features.slice(0, 2).join(' • ')}
                    </p>
                    <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.classList.add('slide-up');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.category-item, .product-item').forEach((el) => {
        observer.observe(el);
    });
}

function initializeSearchSuggestions() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let timeoutId;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fetchSearchSuggestions(e.target.value);
        }, 300);
    });
}

async function fetchSearchSuggestions(query) {
    if (!query) return;

    try {
        const response = await fetch('products.json');
        const data = await response.json();
        const suggestions = data.products
            .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
        
        displaySearchSuggestions(suggestions);
    } catch (error) {
        console.error('Error fetching search suggestions:', error);
    }
}

function displaySearchSuggestions(suggestions) {
    const container = document.createElement('div');
    container.className = 'search-suggestions';
    container.innerHTML = suggestions.map(product => `
        <div class="suggestion-item" onclick="window.location.href='product-details.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.name}" class="suggestion-img">
            <div class="suggestion-details">
                <div class="suggestion-title">${product.name}</div>
                <div class="suggestion-price">₹${product.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');

    const existingSuggestions = document.querySelector('.search-suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }

    document.querySelector('.search-container').appendChild(container);
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    return stars;
}

// Add more UI enhancement functions as needed