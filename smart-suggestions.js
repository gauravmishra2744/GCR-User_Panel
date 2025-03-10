// Smart product suggestions functionality
function initializeSmartSuggestions() {
    const userPreferences = getUserPreferences();
    const viewingHistory = getViewingHistory();
    
    // Dynamically inject suggestion sections after main sections
    injectSuggestionSections();
    
    // Load and render smart suggestions
    loadSmartSuggestions(userPreferences, viewingHistory);
}

function getUserPreferences() {
    // Get user preferences from localStorage or default values
    return JSON.parse(localStorage.getItem('userPreferences')) || {
        preferredCategories: ['electronics', 'fashion'],
        priceRange: { min: 0, max: 50000 },
        brands: []
    };
}

function getViewingHistory() {
    // Get user viewing history from localStorage
    return JSON.parse(localStorage.getItem('viewingHistory')) || [];
}

function injectSuggestionSections() {
    const sections = ['featured', 'trending', 'newArrivals'];
    
    sections.forEach(section => {
        const mainSection = document.querySelector(`#${section}Container`).closest('section');
        const suggestionsSection = createSuggestionsSection(section);
        mainSection.after(suggestionsSection);
    });
}

function createSuggestionsSection(type) {
    const section = document.createElement('section');
    section.className = 'showcase-section bg-light';
    section.innerHTML = `
        <div class="container">
            <div class="showcase-header text-center">
                <h3 class="h4 mb-3">Recommended For You</h3>
                <p class="text-muted">Based on your interests in ${type} products</p>
            </div>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4" id="${type}Suggestions">
            </div>
            <div class="text-center mt-4">
                <button class="btn btn-outline-primary" onclick="loadMoreSuggestions('${type}')">
                    Show More Suggestions
                </button>
            </div>
        </div>
    `;
    return section;
}

async function loadSmartSuggestions(preferences, history) {
    try {
        const [productsData, additionalData] = await Promise.all([
            fetch('products.json').then(res => res.json()),
            fetch('additional-products.json').then(res => res.json())
        ]);

        const allProducts = [...productsData.products, ...additionalData.additional_products];
        
        // Generate suggestions based on preferences and history
        const suggestions = generateSuggestions(allProducts, preferences, history);
        
        // Render suggestions in respective sections
        Object.entries(suggestions).forEach(([type, products]) => {
            renderSuggestions(type, products);
        });
    } catch (error) {
        console.error('Error loading suggestions:', error);
    }
}

function generateSuggestions(products, preferences, history) {
    // Simple recommendation algorithm
    const suggestions = {
        featured: [],
        trending: [],
        newArrivals: []
    };

    // Filter products based on preferences
    const preferredProducts = products.filter(product => 
        preferences.preferredCategories.includes(product.category) &&
        product.price >= preferences.priceRange.min &&
        product.price <= preferences.priceRange.max
    );

    // Sort by rating and relevance
    preferredProducts.sort((a, b) => b.rating - a.rating);

    // Distribute products to different sections
    preferredProducts.forEach((product, index) => {
        if (index % 3 === 0) suggestions.featured.push(product);
        else if (index % 3 === 1) suggestions.trending.push(product);
        else suggestions.newArrivals.push(product);
    });

    return suggestions;
}

function renderSuggestions(type, products) {
    const container = document.getElementById(`${type}Suggestions`);
    if (!container) return;

    const html = products.slice(0, 4).map(product => `
        <div class="col">
            <div class="card suggestion-card h-100">
                <div class="position-relative">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="suggestion-badge">Recommended</div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-success">₹${product.price.toFixed(2)}</p>
                    <button class="btn btn-sm btn-outline-primary w-100" onclick="quickView(${product.id})">
                        Quick View
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function loadMoreSuggestions(type) {
    // Implementation for loading more suggestions
    console.log(`Loading more ${type} suggestions...`);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSmartSuggestions);