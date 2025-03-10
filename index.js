// Home page functionality
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    updateNavigation(user);
    loadProducts();
    updateCartCount();
    updateNotificationCount();

    // Update navigation based on auth status
    function updateNavigation(user) {
        const navLinks = document.querySelector('.nav-links');
        if (!user) {
            navLinks.innerHTML = `
                <a href="index.html" class="active">Home</a>
                <a href="login.html">Login</a>
                <a href="register.html">Register</a>
            `;
        }
    }

    // Load and display products
    function loadProducts() {
        const containers = {
            featuredContainer: document.getElementById('featuredContainer'),
            trendingContainer: document.getElementById('trendingContainer'),
            newArrivalsContainer: document.getElementById('newArrivalsContainer')
        };

        // Clear existing content
        Object.values(containers).forEach(container => {
            if (container) container.innerHTML = '';
        });

        function createProductCard(product) {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card product-card h-100" data-product-id="${product.id}">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">$${product.price.toFixed(2)}</p>
                        <button class="btn btn-primary add-to-cart-btn" type="button" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            return col;
        }

        function attachEventListeners(element, product) {
            const button = element.querySelector('.add-to-cart-btn');
            if (button) {
                button.addEventListener('click', () => {
                    addToCart(product);
                    updateCartCount();
                });
            }
        }
        
        // In a real application, this would be an API call
        const products = [
            {
                id: '1',
                name: 'Smartphone',
                price: 599.99,
                image: 'images/smartphone.jpg',
                category: 'Electronics'
            },
            {
                id: '2',
                name: 'Laptop',
                price: 999.99,
                image: 'images/laptop.jpg',
                category: 'Electronics'
            },
            {
                id: '3',
                name: 'Headphones',
                price: 99.99,
                image: 'images/headphones.jpg',
                category: 'Electronics'
            },
            {
                id: '4',
                name: 'T-Shirt',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Fashion'
            },
            {
                id: '13',
                name: 'Shirt',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Fashion'
            },
            {
                id: '6',
                name: 'Tea',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Grocery'
            },
            {
                id: '7',
                name: 'Rice',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Grocery'
            },
            {
                id: '8',
                name: 'Watch',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Electronics'
            },
            {
                id: '9',
                name: 'T-Shirt',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Fashion'
            },
            {
                id: '10',
                name: 'Laptop',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Electronics'
            },
            {
                id: '11',
                name: 'TV',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Electronics'
            },
            {
                id: '12',
                name: 'T-Shirt',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Fashion'
            }, {
                id: '13',
                name: 'T-Shirt',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Fashion'
            }, {
                id: '14',
                name: 'T-Shirt',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Fashion'
            }, {
                id: '15',
                name: 'T-Shirt',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Fashion'
            }, {
                id: '16',
                name: 'T-Shirt',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Fashion'
            }, {
                id: '17',
                name: 'T-Shirt',
                price: 29.99,
                image: 'images/tshirt.jpg',
                category: 'Fashion'
            },
            // Add more products as needed
        ];

        const productsGrid = document.querySelector('.products-grid');
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                <button class="add-to-wishlist-btn" data-id="${product.id}">Add to Wishlist</button>
            `;
            productsGrid.appendChild(productCard);
        });

        // Add to cart functionality
        productsGrid.addEventListener('click', function(e) {
            if (!user) {
                window.location.href = 'login.html';
                return;
            }

            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = e.target.dataset.id;
                const product = products.find(p => p.id === productId);
                
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        ...product,
                        quantity: 1
                    });
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.classList.add('success-message');
                successMessage.textContent = 'Added to cart!';
                e.target.parentNode.appendChild(successMessage);
                setTimeout(() => successMessage.remove(), 2000);
            }

            if (e.target.classList.contains('add-to-wishlist-btn')) {
                const productId = e.target.dataset.id;
                const product = products.find(p => p.id === productId);
                
                let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                if (!wishlist.find(item => item.id === productId)) {
                    wishlist.push(product);
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('success-message');
                    successMessage.textContent = 'Added to wishlist!';
                    e.target.parentNode.appendChild(successMessage);
                    setTimeout(() => successMessage.remove(), 2000);
                }
            }
        });
    }

    // Update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartBadge = document.querySelector('.badge');
        if (cartBadge) {
            cartBadge.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }

    // Update notification count
    function updateNotificationCount() {
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        const notificationCount = document.querySelector('.notification-count');
        if (notificationCount) {
            notificationCount.textContent = notifications.filter(n => !n.read).length;
        }
    }
});