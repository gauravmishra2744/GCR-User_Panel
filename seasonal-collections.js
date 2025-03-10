// Seasonal Collections and Daily Deals Manager
document.addEventListener('DOMContentLoaded', () => {
    initializeSeasonalCollections();
    initializeDailyDeals();
    initializeCategoryCarousels();
});

function initializeSeasonalCollections() {
    const seasons = [
        {
            name: 'Spring Collection 2024',
            image: 'Spring Collection 2024.jpg',
            gradient: 'linear-gradient(45deg, #96CEB4, #FFEEAD)',
            description: 'Refresh your style with our spring essentials',
            link: 'products.html?collection=spring-2024'
        },
        {
            name: 'Summer Essentials',
            image: 'Summer Essentials.png',
            gradient: 'linear-gradient(45deg, #FF6B6B, #FFE66D)',
            description: 'Beat the heat with cool summer picks',
            link: 'products.html?collection=summer-2024'
        },
        {
            name: 'Monsoon Ready',
            image: 'Monsoon Ready.jpg',
            gradient: 'linear-gradient(45deg, #45B7D1, #4ECDC4)',
            description: 'Stay prepared for the rainy season',
            link: 'products.html?collection=monsoon-2024'
        },
        {
            name: 'Winter Warmth',
            image: 'Winter Warmth.jpeg',
            gradient: 'linear-gradient(45deg, #6C5B7B, #C06C84)',
            description: 'Cozy and stylish winter wear',
            link: 'products.html?collection=winter-2024'
        }
    ];

    const seasonalSection = document.createElement('section');
    seasonalSection.className = 'container-fluid px-0 mb-5';
    seasonalSection.innerHTML = `
        <div class="container">
            <h2 class="fw-bold text-center mb-4">Seasonal Collections</h2>
            <div class="row g-4">
                ${seasons.map(season => `
                    <div class="col-md-6 col-lg-3">
                        <div class="seasonal-card position-relative overflow-hidden rounded shadow-sm">
                            <img src="${season.image}" class="w-100" alt="${season.name}" style="height: 300px; object-fit: cover;">
                            <div class="seasonal-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end p-3"
                                 style="background: ${season.gradient}">
                                <div class="text-white w-100">
                                    <h4 class="fw-bold mb-2">${season.name}</h4>
                                    <p class="mb-3">${season.description}</p>
                                    <a href="${season.link}" class="btn btn-light">Shop Collection</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Insert after categories section
    document.getElementById('categoriesContainer').closest('section').after(seasonalSection);
}

function initializeDailyDeals() {
    const deals = [
        {
            id: 1,
            name: "Deal of the Day",
            discount: 40,
            endTime: new Date().setHours(23, 59, 59, 999),
            products: [1, 4, 7, 10] // Product IDs
        },
        {
            id: 2,
            name: "Flash Sale",
            discount: 30,
            endTime: new Date().setHours(16, 0, 0, 0),
            products: [2, 5, 8, 11]
        }
    ];

    const dealsSection = document.createElement('section');
    dealsSection.className = 'container mb-5 deals-section';

    deals.forEach(deal => {
        const dealContainer = document.createElement('div');
        dealContainer.className = 'mb-5';
        dealContainer.innerHTML = `
            <div class="deal-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 class="fw-bold mb-0">${deal.name}</h3>
                    <p class="text-muted mb-0">
                        Ends in: <span class="deal-timer text-danger" data-end="${deal.endTime}"></span>
                    </p>
                </div>
                <div class="d-flex align-items-center">
                    <span class="badge bg-danger me-3">Up to ${deal.discount}% OFF</span>
                    <a href="products.html?deal=${deal.id}" class="btn btn-outline-primary">View All</a>
                </div>
            </div>
            <div class="deal-products row g-4" id="dealProducts${deal.id}"></div>
        `;
        dealsSection.appendChild(dealContainer);
        
        // Load deal products
        loadDealProducts(deal.products, deal.discount, `dealProducts${deal.id}`);
        // Start timer
        startDealTimer(deal.endTime);
    });

    // Insert after hero section
    document.querySelector('.hero-section').after(dealsSection);
}

async function loadDealProducts(productIds, discount, containerId) {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        const products = productIds.map(id => 
            data.products.find(p => p.id === id)
        ).filter(Boolean);

        const container = document.getElementById(containerId);
        products.forEach(product => {
            const discountedPrice = (product.price * (100 - discount) / 100).toFixed(2);
            const col = document.createElement('div');
            col.className = 'col-6 col-md-3';
            col.innerHTML = `
                <div class="card h-100 deal-card">
                    <div class="position-relative">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded">
                            -${discount}%
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${product.name}</h5>
                        <div class="d-flex align-items-center mb-2">
                            <h6 class="text-danger mb-0">₹${discountedPrice}</h6>
                            <span class="text-muted text-decoration-line-through ms-2">₹${product.price}</span>
                        </div>
                        <div class="progress mb-2" style="height: 10px">
                            <div class="progress-bar bg-warning" style="width: ${Math.random() * 40 + 60}%" 
                                 role="progressbar" aria-label="Stock left"></div>
                        </div>
                        <small class="text-muted">Limited time offer!</small>
                        <button class="btn btn-primary w-100 mt-2" onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    } catch (error) {
        console.error('Error loading deal products:', error);
    }
}

function startDealTimer(endTime) {
    const timerElements = document.querySelectorAll('.deal-timer');
    
    function updateTimer() {
        timerElements.forEach(timer => {
            const end = parseInt(timer.dataset.end);
            const now = new Date().getTime();
            const diff = end - now;

            if (diff <= 0) {
                timer.textContent = 'Deal Ended';
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        });
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

async function initializeCategoryCarousels() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        
        const categories = data.categories;
        const carouselSection = document.createElement('section');
        carouselSection.className = 'container mb-5';
        
        categories.forEach(category => {
            const products = data.products
                .filter(p => p.category === category.id)
                .slice(0, 8);

            const categoryCarousel = document.createElement('div');
            categoryCarousel.className = 'mb-5';
            categoryCarousel.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="fw-bold">
                        <i class="${category.icon} me-2" style="color: ${category.color}"></i>
                        ${category.name}
                    </h3>
                    <a href="products.html?category=${category.id}" class="btn btn-outline-primary">
                        View All
                    </a>
                </div>
                <div class="position-relative">
                    <div class="category-carousel row g-4 flex-nowrap overflow-hidden" 
                         id="carousel${category.id}">
                        ${products.map(product => `
                            <div class="col-6 col-md-3">
                                <div class="card h-100 product-card">
                                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                                    <div class="card-body">
                                        <h5 class="card-title text-truncate">${product.name}</h5>
                                        <p class="card-text">₹${product.price.toFixed(2)}</p>
                                        <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-control prev" onclick="scrollCarousel('${category.id}', -1)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="carousel-control next" onclick="scrollCarousel('${category.id}', 1)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            `;
            carouselSection.appendChild(categoryCarousel);
        });

        // Insert before footer
        document.querySelector('footer').before(carouselSection);
        
        // Add carousel styles
        const style = document.createElement('style');
        style.textContent = `
            .category-carousel {
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
            }
            
            .carousel-control {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.9);
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 1;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .carousel-control:hover {
                background: white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .carousel-control.prev {
                left: -20px;
            }
            
            .carousel-control.next {
                right: -20px;
            }
            
            .deal-card {
                transition: transform 0.3s ease;
            }
            
            .deal-card:hover {
                transform: translateY(-5px);
            }
            
            .seasonal-card {
                transition: transform 0.3s ease;
            }
            
            .seasonal-card:hover {
                transform: translateY(-5px);
            }
            
            .seasonal-overlay {
                background-blend-mode: multiply;
                opacity: 0.9;
                transition: opacity 0.3s ease;
            }
            
            .seasonal-card:hover .seasonal-overlay {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error('Error initializing category carousels:', error);
    }
}

function scrollCarousel(categoryId, direction) {
    const carousel = document.getElementById(`carousel${categoryId}`);
    const scrollAmount = carousel.offsetWidth / 2 * direction;
    carousel.scrollLeft += scrollAmount;
}