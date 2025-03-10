// Product filtering and sorting functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sort functionality
    document.querySelectorAll('[data-sort]').forEach(button => {
        button.addEventListener('click', function() {
            const sortButtons = document.querySelectorAll('[data-sort]');
            sortButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const sortType = this.dataset.sort;
            sortProducts(sortType);
        });
    });

    // Filter functionality
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    
    // Search functionality with debounce
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            applyFilters();
        }, 300);
    });
});

function sortProducts(sortType) {
    const sortedProducts = [...currentProducts];
    
    switch(sortType) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            // Assuming products are already sorted by newest
            break;
    }
    
    renderProducts(sortedProducts);
}

function applyFilters() {
    let filteredProducts = [...currentProducts];
    
    // Price filter
    const priceFilter = document.getElementById('priceFilter').value;
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(Number);
        filteredProducts = filteredProducts.filter(product => {
            if (max) {
                return product.price >= min && product.price <= max;
            } else {
                return product.price >= min;
            }
        });
    }
    
    // Category filter
    const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
        );
    }
    
    // Search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    updateProductCount(filteredProducts.length);
    renderProducts(filteredProducts);
}

function updateProductCount(count) {
    const productCount = document.getElementById('productCount');
    if (productCount) {
        productCount.textContent = count;
    }
}

// Add animation when filtering
function animateFilterChange() {
    const container = document.getElementById('productsContainer');
    container.style.opacity = '0';
    setTimeout(() => {
        applyFilters();
        container.style.opacity = '1';
    }, 300);
}