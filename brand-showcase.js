// Brand Showcase and Collections Manager
document.addEventListener('DOMContentLoaded', () => {
    initializeBrands();
    initializeCollections();
    initializePromotions();
});

function initializeBrands() {
    const brands = [
        { name: 'Apple', logo: 'images/brands/apple.png', url: 'products.html?brand=apple' },
        { name: 'Samsung', logo: 'images/brands/samsung.png', url: 'products.html?brand=samsung' },
        { name: 'Nike', logo: 'images/brands/nike.png', url: 'products.html?brand=nike' },
        { name: 'Adidas', logo: 'images/brands/adidas.png', url: 'products.html?brand=adidas' },
        { name: 'Sony', logo: 'images/brands/sony.png', url: 'products.html?brand=sony' },
        { name: 'LG', logo: 'images/brands/lg.png', url: 'products.html?brand=lg' }
    ];

    const brandsSection = document.createElement('section');
    brandsSection.className = 'container-fluid bg-light py-5 mb-5';
    brandsSection.innerHTML = `
        <div class="container">
            <h2 class="fw-bold text-center mb-4">Popular Brands</h2>
            <div class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4 justify-content-center">
                ${brands.map(brand => `
                    <div class="col">
                        <a href="${brand.url}" class="text-decoration-none">
                            <div class="card h-100 brand-card border-0 bg-white shadow-sm">
                                <div class="card-body text-center">
                                    <img src="${brand.logo}" alt="${brand.name}" class="img-fluid mb-3" style="max-height: 50px">
                                    <h6 class="card-title text-dark mb-0">${brand.name}</h6>
                                </div>
                            </div>
                        </a>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Insert before newsletter section
    document.querySelector('.newsletter-form').closest('section').before(brandsSection);
}

function initializeCollections() {
    const collections = [
        {
            title: 'Summer Collection',
            image: 'Stay cool and stylish.webp',
            description: 'Stay cool and stylish',
            link: 'products.html?collection=summer'
        },
        {
            title: 'Work From Home',
            image: 'Essential gears for remote work.jpg',
            description: 'Essential gear for remote work',
            link: 'products.html?collection=wfh'
        },
        {
            title: 'Smart Living',
            image: 'Connected devices for modern homes.jpg',
            description: 'Connected devices for modern homes',
            link: 'products.html?collection=smart'
        }
    ];

    const collectionsSection = document.createElement('section');
    collectionsSection.className = 'container mb-5';
    collectionsSection.innerHTML = `
        <h2 class="fw-bold text-center mb-4">Featured Collections</h2>
        <div class="row g-4">
            ${collections.map((collection, index) => `
                <div class="col-md-4">
                    <div class="card collection-card border-0 shadow-sm h-100">
                        <div class="position-relative">
                            <img src="${collection.image}" class="card-img-top" alt="${collection.title}">
                            <div class="card-img-overlay d-flex align-items-end" 
                                 style="background: linear-gradient(to top, rgba(0,0,0,0.7), transparent)">
                                <div class="text-white p-3">
                                    <h4 class="card-title mb-2">${collection.title}</h4>
                                    <p class="card-text mb-3">${collection.description}</p>
                                    <a href="${collection.link}" class="btn btn-light">Explore Collection</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Insert after categories section
    document.getElementById('categoriesContainer').closest('section').after(collectionsSection);
}

function initializePromotions() {
    const promotions = [
        {
            title: 'Student Discount',
            description: 'Get 10% off with valid student ID',
            color: '#FF6B6B',
            icon: 'fas fa-graduation-cap'
        },
        {
            title: 'First Order',
            description: 'Save 15% on your first order',
            color: '#4ECDC4',
            icon: 'fas fa-gift'
        },
        {
            title: 'App Exclusive',
            description: 'Additional 5% off on app orders',
            color: '#45B7D1',
            icon: 'fas fa-mobile-alt'
        }
    ];

    const promotionsSection = document.createElement('section');
    promotionsSection.className = 'container mb-5';
    promotionsSection.innerHTML = `
        <div class="row g-4">
            ${promotions.map(promo => `
                <div class="col-md-4">
                    <div class="card h-100 border-0 promo-card" 
                         style="background: ${promo.color}">
                        <div class="card-body text-white text-center py-4">
                            <i class="${promo.icon} fa-3x mb-3"></i>
                            <h4 class="card-title">${promo.title}</h4>
                            <p class="card-text">${promo.description}</p>
                            <button class="btn btn-light" onclick="copyPromoCode('${promo.title.replace(/\s+/g, '').toUpperCase()}')">
                                Copy Code
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Insert after flash deals
    const flashDealsSection = document.querySelector('.flash-deals-section');
    if (flashDealsSection) {
        flashDealsSection.after(promotionsSection);
    }
}

function copyPromoCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showToast('Promo code copied to clipboard!');
    }).catch(() => {
        showToast('Failed to copy promo code', 'error');
    });
}

// CSS Styles for new sections
const style = document.createElement('style');
style.textContent = `
    .brand-card {
        transition: transform 0.3s ease;
    }
    
    .brand-card:hover {
        transform: translateY(-5px);
    }
    
    .collection-card {
        overflow: hidden;
        transition: transform 0.3s ease;
    }
    
    .collection-card:hover {
        transform: translateY(-5px);
    }
    
    .collection-card img {
        transition: transform 0.3s ease;
    }
    
    .collection-card:hover img {
        transform: scale(1.05);
    }
    
    .promo-card {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .promo-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    
    .promo-card i {
        transition: transform 0.3s ease;
    }
    
    .promo-card:hover i {
        transform: scale(1.2);
    }
`;
document.head.appendChild(style);