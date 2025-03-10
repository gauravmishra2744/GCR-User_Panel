// Featured categories showcase
function initializeFeaturedCategories() {
    const categories = [
        {
            name: "Electronics & Gadgets",
            image: "Electronics & Gadgets.webp",
            gradient: "linear-gradient(45deg, #FF6B6B, #FF8E53)",
            icon: "fas fa-laptop"
        },
        {
            name: "Fashion & Accessories",
            image: "Fashion & Accessories.png",
            gradient: "linear-gradient(45deg, #4ECDC4, #45B7D1)",
            icon: "fas fa-tshirt"
        },
        {
            name: "Home & Living",
            image: "Home & Living.webp",
            gradient: "linear-gradient(45deg, #96CEB4, #FFEEAD)",
            icon: "fas fa-home"
        },
        {
            name: "Sports & Fitness",
            image: "Sports & Fitness.jpg",
            gradient: "linear-gradient(45deg, #45B7D1, #4ECDC4)",
            icon: "fas fa-running"
        }
    ];

    renderFeaturedCategories(categories);
}

function renderFeaturedCategories(categories) {
    const container = document.createElement('section');
    container.className = 'showcase-section bg-light';
    container.innerHTML = `
        <div class="container">
            <div class="showcase-header text-center">
                <h2 class="display-5 fw-bold">Shop by Category</h2>
                <p class="lead mb-4">Explore our curated collections</p>
            </div>
            <div class="row g-4">
                ${categories.map(category => `
                    <div class="col-6 col-md-3">
                        <div class="category-card" style="background: ${category.gradient}">
                            <div class="category-icon">
                                <i class="${category.icon} fa-2x"></i>
                            </div>
                            <h3>${category.name}</h3>
                            <a href="products.html?category=${category.name.toLowerCase()}" class="stretched-link"></a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Insert after the hero section
    document.querySelector('.hero-section').after(container);
}

document.addEventListener('DOMContentLoaded', initializeFeaturedCategories);