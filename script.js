// Main JavaScript file for the home page
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadFeaturedProducts();
});

// Category data
const categories = [
    { id: 1, name: 'Electronics', image: 'Electronics.webp' },
    { id: 2, name: 'Fashion', image: 'Fashion.webp' },
    { id: 3, name: 'Home & Garden', image: 'Home & Garden.jpg' },
    { id: 4, name: 'Toys', image: 'Toys.jpeg' }
];

function loadCategories() {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'col-6 col-md-3 mb-4';
        categoryCard.innerHTML = `
            <div class="card h-100 category-card" data-category="${category.name.toLowerCase()}">
                <img src="${category.image}" class="card-img-top" alt="${category.name}">
                <div class="card-body">
                    <h5 class="card-title text-center">${category.name}</h5>
                </div>
            </div>
        `;
        container.appendChild(categoryCard);
    });

    // Add click event listeners to category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterProductsByCategory(category);
        });
    });
}

function loadFeaturedProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            window.productsData = data;
            renderProducts(data.products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            showToast('Error loading products. Please try again later.', 'error');
        });
}

function filterProductsByCategory(category) {
    if (!window.productsData) return;
    
    const filteredProducts = window.productsData.products.filter(
        product => product.category.toLowerCase() === category
    );
    renderProducts(filteredProducts);
}

function renderProducts(products) {
    // Add quick view button to product cards
    const productCards = products.map(product => `
        <div class="col-md-3 col-sm-6">
            <div class="product-card">
                <div class="position-relative">
                    <img src="${product.image}" alt="${product.name}" class="card-img-top product-image">
                    <button class="btn btn-light btn-sm quick-view-btn" data-product-id="${product.id}">
                        <i class="fas fa-eye"></i> Quick View
                    </button>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <div class="price-block">
                        <span class="current-price">₹${product.price.toFixed(2)}</span>
                        ${product.mrp ? `
                            <span class="original-price">₹${product.mrp.toFixed(2)}</span>
                            <span class="discount">${Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off</span>
                        ` : ''}
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline-danger wishlist-btn" data-product-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 mb-4';
        productCard.innerHTML = `
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="h5 mb-0">₹${product.price.toFixed(2)}</span>
                        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                    <div class="mt-2">
                        <small class="text-muted">
                            <i class="fas fa-star text-warning"></i> ${product.rating} | Stock: ${product.stock}
                        </small>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });

    // Add event listeners for add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product);
                showToast('Product added to cart!');
            }
        });
    });
}