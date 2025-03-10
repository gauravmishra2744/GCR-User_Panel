// Enhanced product showcase functionality
function initializeProductShowcase() {
    const showcaseContainers = {
        featured: document.getElementById('featuredContainer'),
        trending: document.getElementById('trendingContainer'),
        newArrivals: document.getElementById('newArrivalsContainer')
    };

    // Load and render products for each showcase section
    loadShowcaseProducts();
}

async function loadShowcaseProducts() {
    try {
        const [productsResponse, additionalResponse, additional2Response, additional3Response] = await Promise.all([
            fetch('products.json'),
            fetch('additional-products.json'),
            fetch('additional-products-2.json'),
            fetch('products-3.json')
        ]);
        
        const [productsData, additionalData, additional2Data, additional3Data] = await Promise.all([
            productsResponse.json(),
            additionalResponse.json(),
            additional2Response.json()
        ]);
        
        const allProducts = [
            ...productsData.products,
            ...additionalData.additional_products,
            ...additional2Data.additional_products,
            ...additional3Data.additional_products
        ];
        
        // Filter products by tags and render in respective containers
        renderShowcaseSection('featured', filterProductsByTag(allProducts, 'featured'));
        renderShowcaseSection('trending', filterProductsByTag(allProducts, 'trending'));
        renderShowcaseSection('new-arrival', filterProductsByTag(allProducts, 'new-arrival'));
    } catch (error) {
        console.error('Error loading showcase products:', error);
    }
}

function filterProductsByTag(products, tag) {
    return products.filter(product => product.tags.includes(tag));
}

function renderShowcaseSection(sectionId, products) {
    // Sort products by rating and then by price
    products.sort((a, b) => {
        if (b.rating === a.rating) {
            return a.price - b.price;
        }
        return b.rating - a.rating;
    });
    // Limit products to 8 per section for better presentation
    const displayProducts = products.slice(0, 8);
    const container = document.getElementById(`${sectionId}Container`);
    if (!container) return;
    
    // Add product count indicator
    const parentSection = container.closest('.showcase-section');
    if (parentSection) {
        const countIndicator = document.createElement('div');
        countIndicator.className = 'product-count';
        countIndicator.textContent = `${products.length} Products`;
        parentSection.appendChild(countIndicator);
    }

    let html = '';
    displayProducts.forEach(product => {
        html += `
            <div class="col mb-4">
                <div class="card product-card h-100" data-category="${product.category}">
                    ${getBadgeHtml(product)}
                    <div class="product-image-wrapper">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="product-actions">
                            <button class="btn btn-light btn-sm" onclick="quickView(${product.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-light btn-sm" onclick="addToWishlist(${product.id})">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <div class="product-rating">
                            ${generateStarRating(product.rating)}
                            <small class="text-muted">(${product.rating})</small>
                        </div>
                        <p class="card-text price-tag">₹${product.price.toFixed(2)}</p>
                        <button class="btn btn-primary w-100" onclick="addToCart(${JSON.stringify(product)})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    
    // Add view all button after products
    const viewAllButton = document.createElement('div');
    viewAllButton.className = 'text-center mt-5';
    viewAllButton.innerHTML = `
        <a href="products.html?tag=${sectionId}" class="btn btn-primary btn-lg">
            View All ${sectionId === 'featured' ? 'Featured Products' : 
                      sectionId === 'trending' ? 'Trending Products' : 
                      'New Arrivals'} 
            <i class="fas fa-arrow-right ms-2"></i>
        </a>
    `;
    container.after(viewAllButton);
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }
    return stars;
}

// Helper function to generate badge HTML
function getBadgeHtml(product) {
    if (product.tags.includes('featured')) {
        return '<span class="product-badge badge-featured">Featured</span>';
    } else if (product.tags.includes('new-arrival')) {
        return '<span class="product-badge badge-new">New</span>';
    } else if (product.tags.includes('trending')) {
        return '<span class="product-badge badge-trending">Trending</span>';
    }
    return '';
}

// Initialize showcase when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeProductShowcase);