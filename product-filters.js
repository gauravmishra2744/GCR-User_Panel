// Enhanced product filtering functionality
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.category-filters .btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            filterProductsByCategory(category);
        });
    });
}

function filterProductsByCategory(category) {
    const containers = {
        featured: document.getElementById('featuredContainer'),
        trending: document.getElementById('trendingContainer'),
        newArrivals: document.getElementById('newArrivalsContainer')
    };

    Object.keys(containers).forEach(key => {
        const container = containers[key];
        if (!container) return;

        const products = container.querySelectorAll('.product-card');
        products.forEach(product => {
            const productCategory = product.dataset.category;
            if (category === 'all' || productCategory === category) {
                product.style.display = '';
                product.classList.add('animate');
            } else {
                product.style.display = 'none';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeProductFilters);