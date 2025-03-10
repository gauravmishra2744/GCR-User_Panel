// Personalized collections functionality
function initializePersonalizedCollections() {
    const userInterests = getUserInterests();
    const collections = generateCollections(userInterests);
    insertCollections(collections);
}

function getUserInterests() {
    return JSON.parse(localStorage.getItem('userInterests')) || {
        categories: ['electronics', 'fashion'],
        priceRange: [1000, 50000],
        recentlyViewed: []
    };
}

function generateCollections(interests) {
    return [
        {
            id: 'recent',
            title: 'Recently Viewed',
            subtitle: 'Continue exploring your interests',
            products: interests.recentlyViewed || []
        },
        {
            id: 'similar',
            title: 'You Might Also Like',
            subtitle: 'Based on your browsing history',
            products: []
        }
    ];
}

function insertCollections(collections) {
    collections.forEach(collection => {
        const section = createCollectionSection(collection);
        // Insert after each product showcase section
        const productSections = document.querySelectorAll('.showcase-section');
        productSections.forEach(productSection => {
            const clone = section.cloneNode(true);
            productSection.after(clone);
        });
    });
}

function createCollectionSection(collection) {
    const section = document.createElement('section');
    section.className = 'personalized-section py-4 mb-4 bg-light';
    section.innerHTML = `
        <div class="container">
            <div class="collection-header text-center mb-4">
                <h3 class="h4">${collection.title}</h3>
                <p class="text-muted">${collection.subtitle}</p>
            </div>
            <div class="collection-products">
                <div class="row row-cols-2 row-cols-md-4 g-4" id="${collection.id}Products">
                    ${generateCollectionProducts(4)}
                </div>
            </div>
        </div>
    `;
    return section;
}

function generateCollectionProducts(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="col">
                <div class="card collection-card h-100">
                    <div class="recommendation-badge">
                        <span class="badge bg-primary">Recommended</span>
                    </div>
                </div>
            </div>
        `;
    }
    return html;
}

document.addEventListener('DOMContentLoaded', initializePersonalizedCollections);