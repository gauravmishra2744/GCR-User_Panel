// Flash Deals and Personalized Recommendations
document.addEventListener('DOMContentLoaded', () => {
    initializeFlashDeals();
    setupPersonalizedRecommendations();
    initializeRecentlyViewed();
    initializeSocialSharing();
});

function initializeFlashDeals() {
    const flashDealsSection = document.createElement('section');
    flashDealsSection.className = 'container mb-5 flash-deals-section';
    flashDealsSection.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="fw-bold mb-0">Flash Deals</h2>
                <p class="text-muted">Deals end in: <span id="flashDealsTimer" class="text-danger"></span></p>
            </div>
            <a href="products.html?tag=flash-deal" class="btn btn-outline-primary">View All Deals</a>
        </div>
        <div class="row g-4" id="flashDealsContainer">
            <!-- Deals will be populated dynamically -->
        </div>
    `;

    // Insert after hero section
    document.querySelector('.hero-section').after(flashDealsSection);

    // Start countdown timer
    startFlashDealsTimer();
    loadFlashDeals();
}

function startFlashDealsTimer() {
    const endTime = new Date();
    endTime.setHours(23, 59, 59); // End of day

    function updateTimer() {
        const now = new Date();
        const diff = endTime - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('flashDealsTimer').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

async function loadFlashDeals() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        
        // Select random products for flash deals
        const flashDeals = data.products
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .map(product => ({
                ...product,
                flashPrice: (product.price * 0.7).toFixed(2) // 30% discount
            }));

        renderFlashDeals(flashDeals);
    } catch (error) {
        console.error('Error loading flash deals:', error);
    }
}

function renderFlashDeals(deals) {
    const container = document.getElementById('flashDealsContainer');
    if (!container) return;

    deals.forEach(deal => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3';
        col.innerHTML = `
            <div class="card h-100 product-card">
                <div class="position-relative">
                    <img src="${deal.image}" class="card-img-top" alt="${deal.name}">
                    <div class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded">
                        -30%
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${deal.name}</h5>
                    <div class="d-flex align-items-center mb-2">
                        <h6 class="text-danger mb-0">₹${deal.flashPrice}</h6>
                        <span class="text-muted text-decoration-line-through ms-2">₹${deal.price}</span>
                    </div>
                    <div class="progress mb-2" style="height: 10px">
                        <div class="progress-bar bg-warning" style="width: ${Math.random() * 40 + 60}%" 
                             role="progressbar" aria-label="Stock left"></div>
                    </div>
                    <small class="text-muted">Selling fast! Limited stock</small>
                    <button class="btn btn-primary w-100 mt-2" onclick="addToCart(${deal.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Personalized Recommendations
async function setupPersonalizedRecommendations() {
    const viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (viewedProducts.length === 0) return;

    try {
        const response = await fetch('products.json');
        const data = await response.json();
        
        // Get products from similar categories
        const viewedCategories = new Set(
            viewedProducts.map(id => 
                data.products.find(p => p.id === id)?.category
            ).filter(Boolean)
        );

        const recommendations = data.products
            .filter(p => viewedCategories.has(p.category) && !viewedProducts.includes(p.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);

        if (recommendations.length > 0) {
            renderRecommendationsSection(recommendations);
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

function renderRecommendationsSection(products) {
    const recommendationsSection = document.createElement('section');
    recommendationsSection.className = 'container mb-5';
    recommendationsSection.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold">Recommended for You</h2>
            <a href="products.html?recommended=true" class="btn btn-outline-primary">View All</a>
        </div>
        <div class="row g-4" id="recommendationsContainer"></div>
    `;

    document.querySelector('footer').before(recommendationsSection);
    renderRecommendedProducts(products);
}

function renderRecommendedProducts(products) {
    const container = document.getElementById('recommendationsContainer');
    
    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3 product-item';
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
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text mb-2">₹${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Recently Viewed Products
function initializeRecentlyViewed() {
    const viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (viewedProducts.length === 0) return;

    const recentlyViewedSection = document.createElement('section');
    recentlyViewedSection.className = 'container mb-5';
    recentlyViewedSection.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold">Recently Viewed</h2>
            <button class="btn btn-outline-primary" onclick="clearRecentlyViewed()">Clear All</button>
        </div>
        <div class="row g-4" id="recentlyViewedContainer"></div>
    `;

    const recommendationsSection = document.querySelector('#recommendationsContainer');
    if (recommendationsSection) {
        recommendationsSection.parentElement.before(recentlyViewedSection);
    } else {
        document.querySelector('footer').before(recentlyViewedSection);
    }

    loadRecentlyViewed(viewedProducts);
}

async function loadRecentlyViewed(viewedProducts) {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        
        const recentProducts = viewedProducts
            .map(id => data.products.find(p => p.id === id))
            .filter(Boolean)
            .slice(0, 4);

        renderRecentlyViewed(recentProducts);
    } catch (error) {
        console.error('Error loading recently viewed products:', error);
    }
}

function renderRecentlyViewed(products) {
    const container = document.getElementById('recentlyViewedContainer');
    if (!container) return;

    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3';
        col.innerHTML = `
            <div class="card h-100 product-card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text mb-2">₹${product.price.toFixed(2)}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary flex-grow-1" onclick="quickView(${product.id})">
                            Quick View
                        </button>
                        <button class="btn btn-outline-primary" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function clearRecentlyViewed() {
    localStorage.removeItem('recentlyViewed');
    const section = document.getElementById('recentlyViewedContainer').parentElement;
    section.remove();
}