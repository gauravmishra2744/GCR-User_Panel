// Mega Menu Implementation
document.addEventListener('DOMContentLoaded', function() {
    initializeMegaMenu();
});

async function initializeMegaMenu() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        setupMegaMenu(data.categories, data.tags);
    } catch (error) {
        console.error('Error initializing mega menu:', error);
    }
}

function setupMegaMenu(categories, tags) {
    const megaMenuContainer = document.createElement('div');
    megaMenuContainer.className = 'mega-menu-wrapper';
    megaMenuContainer.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-md-3">
                    <h5 class="mb-3">Categories</h5>
                    <ul class="list-unstyled">
                        ${categories.map(category => `
                            <li>
                                <a href="products.html?category=${category.id}" class="mega-menu-link">
                                    <i class="${category.icon} me-2" style="color: ${category.color}"></i>
                                    ${category.name}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5 class="mb-3">Trending</h5>
                    <ul class="list-unstyled">
                        ${tags.map(tag => `
                            <li>
                                <a href="products.html?tag=${tag.id}" class="mega-menu-link">
                                    <span class="badge" style="background-color: ${tag.color}">${tag.name}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="col-md-6">
                    <h5 class="mb-3">Featured Collections</h5>
                    <div class="row g-3">
                        <div class="col-6">
                            <div class="featured-collection" style="background: linear-gradient(45deg, #FF6B6B, #4ECDC4)">
                                <h6>Winter Sale</h6>
                                <p>Up to 50% off</p>
                                <a href="products.html?sale=winter" class="btn btn-sm btn-light">Shop Now</a>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="featured-collection" style="background: linear-gradient(45deg, #45B7D1, #96CEB4)">
                                <h6>New Arrivals</h6>
                                <p>Fresh styles</p>
                                <a href="products.html?tag=new-arrival" class="btn btn-sm btn-light">Explore</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const menuTrigger = document.querySelector('#categoriesDropdown');
    const navbar = document.querySelector('.navbar');

    if (menuTrigger && navbar) {
        menuTrigger.addEventListener('mouseenter', () => {
            megaMenuContainer.style.display = 'block';
            setTimeout(() => {
                megaMenuContainer.classList.add('show');
            }, 50);
        });

        navbar.addEventListener('mouseleave', () => {
            megaMenuContainer.classList.remove('show');
            setTimeout(() => {
                megaMenuContainer.style.display = 'none';
            }, 300);
        });

        navbar.appendChild(megaMenuContainer);
    }
}