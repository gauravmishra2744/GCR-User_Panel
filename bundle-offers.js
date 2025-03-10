// Bundle offers and combo deals functionality
function initializeBundleOffers() {
    const bundles = [
        {
            id: 'tech-bundle',
            title: 'Ultimate Tech Bundle',
            image: 'Ultimate Tech Bundle.webp',
            description: 'Get the perfect tech setup with these matching products',
            products: ['headphones', 'smartwatch', 'gaming-mouse'],
            savings: 25,
            section: 'featured'
        },
        {
            id: 'home-bundle',
            title: 'Smart Home Starter Pack',
            image: 'Smart Home Starter Pack.webp',
            description: 'Transform your home with these smart devices',
            products: ['smart-bulb', 'security-camera', 'smart-speaker'],
            savings: 20,
            section: 'trending'
        },
        {
            id: 'fashion-bundle',
            title: 'Premium Fashion Collection',
            image: 'Premium Fashion Collection.jpg',
            description: 'Complete your look with this curated set',
            products: ['watch', 'sunglasses', 'bag'],
            savings: 30,
            section: 'new-arrival'
        }
    ];

    insertBundleOffers(bundles);
}

function insertBundleOffers(bundles) {
    bundles.forEach(bundle => {
        const bundleSection = createBundleSection(bundle);
        const targetSection = document.querySelector(`#${bundle.section}Container`);
        if (targetSection) {
            targetSection.closest('section').after(bundleSection);
        }
    });
}

function createBundleSection(bundle) {
    const section = document.createElement('section');
    section.className = 'bundle-section py-5 mb-4';
    section.style.background = 'linear-gradient(45deg, #f8f9fa, #e9ecef)';
    section.innerHTML = `
        <div class="container">
            <div class="bundle-header text-center mb-4">
                <span class="badge bg-danger px-3 py-2 mb-2">Save ${bundle.savings}%</span>
                <h3 class="h2 mb-2">${bundle.title}</h3>
                <p class="text-muted mb-4">${bundle.description}</p>
            </div>
            <div class="bundle-products">
                <div class="row g-4">
                    <div class="col-md-8">
                        <div class="bundle-items">
                            <div class="row row-cols-1 row-cols-md-3 g-4">
                                ${generateBundleProducts()}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="bundle-summary card h-100">
                            <div class="card-body">
                                <h4 class="card-title">Bundle Summary</h4>
                                <div class="bundle-pricing mb-4">
                                    <p class="text-muted mb-1">Regular Price: <del>₹24,999</del></p>
                                    <p class="h3 text-danger mb-0">Bundle Price: ₹18,749</p>
                                    <small class="text-success">You Save: ₹6,250</small>
                                </div>
                                <ul class="bundle-features list-unstyled mb-4">
                                    <li><i class="fas fa-check-circle text-success me-2"></i>Free Shipping</li>
                                    <li><i class="fas fa-check-circle text-success me-2"></i>Extended Warranty</li>
                                    <li><i class="fas fa-check-circle text-success me-2"></i>Priority Support</li>
                                </ul>
                                <button class="btn btn-primary w-100">Add Bundle to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bundle-footer text-center mt-4">
                <p class="text-muted small">Limited time offer. Terms and conditions apply.</p>
            </div>
        </div>
    `;
    return section;
}

function generateBundleProducts() {
    return Array(3).fill(0).map((_, i) => `
        <div class="col">
            <div class="card bundle-product h-100">
                <div class="bundle-number">
                    <span class="badge bg-primary rounded-circle">${i + 1}</span>
                </div>
                <div class="card-body text-center">
                    <div class="bundle-product-image mb-3">
                        <img src="images/product-placeholder.jpg" class="img-fluid rounded" alt="Bundle Product">
                    </div>
                    <h5 class="card-title">Product ${i + 1}</h5>
                    <p class="text-muted mb-0">Product Description</p>
                </div>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', initializeBundleOffers);