// Quick View Module
document.addEventListener('DOMContentLoaded', () => {
    initializeQuickView();
});

function initializeQuickView() {
    // Create modal container if it doesn't exist
    if (!document.getElementById('quickViewModal')) {
        const modalHTML = `
            <div class="modal fade" id="quickViewModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="quickViewContent"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

async function quickView(productId) {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        const product = data.products.find(p => p.id === productId);
        
        if (!product) {
            showToast('Product not found', 'error');
            return;
        }

        const content = `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-6">
                        <div class="product-gallery">
                            <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
                            <div class="product-gallery-thumbs mt-3">
                                <div class="row g-2">
                                    <div class="col-3">
                                        <img src="${product.image}" class="img-fluid rounded" alt="Thumbnail">
                                    </div>
                                    <!-- Add more thumbnail slots for additional images -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="ps-md-4">
                            <h3 class="mb-2">${product.name}</h3>
                            <div class="d-flex align-items-center mb-3">
                                <div class="rating text-warning me-2">
                                    ${generateStarRating(product.rating)}
                                </div>
                                <span class="text-muted small">(${Math.floor(Math.random() * 500) + 100} reviews)</span>
                            </div>
                            <h4 class="mb-3">₹${product.price.toFixed(2)}</h4>
                            <div class="mb-3">
                                <h6>Key Features:</h6>
                                <ul class="list-unstyled">
                                    ${product.features.map(feature => `
                                        <li><i class="fas fa-check text-success me-2"></i>${feature}</li>
                                    `).join('')}
                                </ul>
                            </div>
                            <p class="mb-3">${product.description}</p>
                            <div class="mb-3">
                                <label class="form-label">Quantity</label>
                                <div class="input-group" style="width: 130px">
                                    <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(-1)">-</button>
                                    <input type="text" class="form-control text-center" id="productQuantity" value="1">
                                    <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(1)">+</button>
                                </div>
                            </div>
                            <div class="stock-info mb-3">
                                <i class="fas fa-box me-1"></i>
                                <span class="text-${product.stock > 20 ? 'success' : 'warning'}">
                                    ${product.stock > 20 ? 'In Stock' : `Only ${product.stock} left`}
                                </span>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary flex-grow-1" onclick="addToCartFromQuickView(${product.id})">
                                    Add to Cart
                                </button>
                                <button class="btn btn-outline-primary" onclick="toggleWishlist(${product.id})">
                                    <i class="far fa-heart"></i>
                                </button>
                                <button class="btn btn-outline-primary" onclick="shareProduct(${product.id})">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                            <div class="mt-3">
                                <button class="btn btn-link text-decoration-none p-0" 
                                        onclick="window.location.href='product-details.html?id=${product.id}'">
                                    View Full Details <i class="fas fa-arrow-right ms-1"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('quickViewContent').innerHTML = content;
        new bootstrap.Modal(document.getElementById('quickViewModal')).show();
    } catch (error) {
        console.error('Error loading quick view:', error);
        showToast('Error loading product details', 'error');
    }
}

function updateQuantity(change) {
    const input = document.getElementById('productQuantity');
    let value = parseInt(input.value) + change;
    value = Math.max(1, value); // Ensure minimum is 1
    input.value = value;
}

function addToCartFromQuickView(productId) {
    const quantity = parseInt(document.getElementById('productQuantity').value);
    addToCart(productId, quantity);
    bootstrap.Modal.getInstance(document.getElementById('quickViewModal')).hide();
}

// Enhanced Search Functionality
function initializeEnhancedSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    // Add search filters dropdown
    const filterContainer = document.createElement('div');
    filterContainer.className = 'dropdown-menu p-3 search-filters';
    filterContainer.style.width = '300px';
    filterContainer.innerHTML = `
        <h6 class="mb-3">Search Filters</h6>
        <div class="mb-3">
            <label class="form-label">Category</label>
            <select class="form-select form-select-sm" id="searchCategory">
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Garden</option>
                <option value="toys">Toys & Games</option>
                <option value="sports">Sports & Fitness</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Price Range</label>
            <div class="row g-2">
                <div class="col-6">
                    <input type="number" class="form-control form-control-sm" placeholder="Min" id="searchPriceMin">
                </div>
                <div class="col-6">
                    <input type="number" class="form-control form-control-sm" placeholder="Max" id="searchPriceMax">
                </div>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Sort By</label>
            <select class="form-select form-select-sm" id="searchSort">
                <option value="relevant">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
            </select>
        </div>
        <button class="btn btn-primary btn-sm w-100" onclick="applySearchFilters()">Apply Filters</button>
    `;

    // Add filter button to search input
    const searchContainer = searchInput.parentElement;
    const filterButton = document.createElement('button');
    filterButton.className = 'btn btn-outline-secondary dropdown-toggle';
    filterButton.setAttribute('data-bs-toggle', 'dropdown');
    filterButton.innerHTML = '<i class="fas fa-filter"></i>';
    searchContainer.appendChild(filterButton);
    searchContainer.appendChild(filterContainer);
}

function applySearchFilters() {
    const category = document.getElementById('searchCategory').value;
    const minPrice = document.getElementById('searchPriceMin').value;
    const maxPrice = document.getElementById('searchPriceMax').value;
    const sort = document.getElementById('searchSort').value;
    
    // Update URL with filter parameters
    const searchParams = new URLSearchParams(window.location.search);
    if (category) searchParams.set('category', category);
    if (minPrice) searchParams.set('minPrice', minPrice);
    if (maxPrice) searchParams.set('maxPrice', maxPrice);
    if (sort) searchParams.set('sort', sort);
    
    window.location.href = `products.html?${searchParams.toString()}`;
}