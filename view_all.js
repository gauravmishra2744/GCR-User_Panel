let products = [];

// Fetch products from JSON file
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data.products;
        renderProducts();
    })
    .catch(error => console.error('Error loading products:', error));

let currentView = 'grid';
let currentPage = 1;
const itemsPerPage = 12;

document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameters for category filter
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        // Find and check the corresponding category checkbox
        const checkbox = document.querySelector(`.category-filter[value="${category}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    }
    
    renderProducts();
    setupEventListeners();
    updateCartCount();
});

function renderProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('productsGrid');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    productsGrid.innerHTML = '';

    paginatedProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = currentView === 'grid' ? 'col-md-4 col-lg-3' : 'col-12 mb-3';

        productElement.innerHTML = `
            <div class="card h-100">
                <a href="product-details.html?id=${product.id}" class="text-decoration-none">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title text-dark">${product.name}</h5>
                        <p class="card-text text-secondary">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-primary h5 mb-0">₹${product.price.toFixed(2)}</span>
                            <span class="text-warning">
                                ${"★".repeat(Math.floor(product.rating))}${product.rating % 1 ? "½" : ""}
                                <small class="text-muted">(${product.stock} left)</small>
                            </span>
                        </div>
                    </div>
                </a>
                <div class="card-footer bg-transparent border-top-0 pt-0">
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                            ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <a href="product-details.html?id=${product.id}" class="btn btn-outline-primary">View Details</a>
                    </div>
                </div>
            </div>
        `;

        productsGrid.appendChild(productElement);
    });

    renderPagination(filteredProducts.length);
}

function renderPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    pagination.innerHTML = '';

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = '<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>';
    prevLi.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    });
    pagination.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${currentPage === i ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', () => {
            currentPage = i;
            renderProducts();
        });
        pagination.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = '<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>';
    nextLi.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
        }
    });
    pagination.appendChild(nextLi);
}

function setupEventListeners() {
    // View options
    document.querySelectorAll('[data-view]').forEach(element => {
        element.addEventListener('click', (e) => {
            currentView = e.target.dataset.view;
            renderProducts();
        });
    });

    // Filter application
    document.getElementById('applyFilters').addEventListener('click', applyFilters);

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    });
}

function applyFilters() {
    // Get category from URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get('category');
    const urlSearch = urlParams.get('search');
    
    // Check if we have a category from URL
    let selectedCategories = urlCategory ? [urlCategory] : 
        Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(checkbox => checkbox.value);
    
    // If we have a search term from URL, update search input
    if (urlSearch) {
        document.getElementById('searchInput').value = urlSearch;
    }
    
    const priceRange = document.getElementById('priceRange').value;
    const sortBy = document.getElementById('sortBy').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();

    let filteredProducts = products.filter(product => {
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }

        // Price filter
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            if (max) {
                if (product.price < min || product.price > max) return false;
            } else {
                if (product.price < min) return false;
            }
        }

        // Search query
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery) && 
            !product.description.toLowerCase().includes(searchQuery)) {
            return false;
        }

        return true;
    });

    // Sorting
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        // Add more sorting options as needed
    }

    currentPage = 1; // Reset to first page when filters change
    renderProducts(filteredProducts);
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show success message
        showToast('Product added to cart successfully!', 'success');
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}