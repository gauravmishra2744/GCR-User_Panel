// Themed product collections functionality
function initializeThemedCollections() {
    const themes = [
        {
            id: 'student-essentials',
            title: 'Back to College Essentials',
            description: 'Get ready for the new semester with these must-have items',
            gradient: 'linear-gradient(45deg, #FFD93D, #FF9B9B)',
            products: ['laptop', 'backpack', 'headphones', 'notebook'],
            relatedSection: 'featured'
        },
        {
            id: 'work-from-home',
            title: 'Work From Home Setup',
            description: 'Create your perfect home office with these productivity boosters',
            gradient: 'linear-gradient(45deg, #6ECCAF, #ADE792)',
            products: ['desk', 'chair', 'monitor', 'keyboard'],
            relatedSection: 'trending'
        },
        {
            id: 'smart-living',
            title: 'Smart Living Essentials',
            description: 'Transform your home into a smart haven',
            gradient: 'linear-gradient(45deg, #B1B2FF, #AAC4FF)',
            products: ['smart-speaker', 'smart-bulb', 'security-camera', 'thermostat'],
            relatedSection: 'new-arrival'
        }
    ];

    insertThemedCollections(themes);
}

function insertThemedCollections(themes) {
    themes.forEach(theme => {
        const themeSection = createThemeSection(theme);
        const targetSection = document.querySelector(`#${theme.relatedSection}Container`).closest('section');
        if (targetSection) {
            targetSection.insertAdjacentElement('afterend', themeSection);
        }
    });
}

function createThemeSection(theme) {
    const section = document.createElement('section');
    section.className = 'themed-section py-5 mb-4';
    section.style.background = theme.gradient;
    section.innerHTML = `
        <div class="container">
            <div class="theme-header text-center text-white mb-5">
                <h3 class="display-6 fw-bold">${theme.title}</h3>
                <p class="lead">${theme.description}</p>
            </div>
            <div class="theme-products">
                <div class="row g-4">
                    <div class="col-lg-8">
                        <div class="theme-showcase card border-0 shadow">
                            <div class="row g-0">
                                <div class="col-md-6">
                                    <div class="theme-showcase-image" style="background-image: url('images/themes/${theme.id}.jpg')"></div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card-body">
                                        <h4>Complete Collection</h4>
                                        <p class="text-muted">Everything you need in one place</p>
                                        <ul class="theme-features">
                                            <li><i class="fas fa-check-circle text-success"></i> Curated Selection</li>
                                            <li><i class="fas fa-check-circle text-success"></i> Special Bundle Pricing</li>
                                            <li><i class="fas fa-check-circle text-success"></i> Extended Warranty</li>
                                        </ul>
                                        <div class="theme-pricing mb-4">
                                            <div class="current-price">₹29,999</div>
                                            <div class="original-price">₹39,999</div>
                                            <div class="saving-badge">Save 25%</div>
                                        </div>
                                        <button class="btn btn-light btn-lg">Shop Collection</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="theme-highlights">
                            <div class="row g-4">
                                <div class="col-6 col-lg-12">
                                    <div class="highlight-card">
                                        <div class="highlight-badge">New</div>
                                        <img src="images/product-placeholder.jpg" alt="Featured Item" class="highlight-image">
                                        <div class="highlight-details">
                                            <h5>Featured Item</h5>
                                            <div class="highlight-price">
                                                <span class="new-price">₹4,999</span>
                                                <span class="old-price">₹6,999</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6 col-lg-12">
                                    <div class="highlight-card">
                                        <div class="highlight-badge">Trending</div>
                                        <img src="images/product-placeholder.jpg" alt="Featured Item" class="highlight-image">
                                        <div class="highlight-details">
                                            <h5>Popular Item</h5>
                                            <div class="highlight-price">
                                                <span class="new-price">₹3,499</span>
                                                <span class="old-price">₹4,999</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    return section;
}

document.addEventListener('DOMContentLoaded', initializeThemedCollections);