// Enhanced interactions for product showcase
document.addEventListener('DOMContentLoaded', () => {
    initializeShowcaseInteractions();
});

function initializeShowcaseInteractions() {
    // Add intersection observer for animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all product cards
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });

    // Add hover sound effect
    const hoverSound = new Audio('hover.mp3');
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.volume = 0.2;
            hoverSound.play();
        });
    });

    // Add quick view functionality
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            showQuickView(productId);
        });
    });
}

function showQuickView(productId) {
    // Implementation of quick view modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    // Add modal content and functionality
}

// Add smooth scrolling to section links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});