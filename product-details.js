document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        loadProductDetails(productId);
    } else {
        window.location.href = 'products.html';
    }

    setupHeaderSearch();
    updateCartCount();

    // Add event listener for add to cart button
    document.getElementById('addToCartBtn').addEventListener('click', function() {
        const product = window.currentProduct;
        if (product) {
            try {
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images ? product.images[0] : 'placeholder.jpg'
                });
            } catch (error) {
                console.error('Error adding product to cart:', error);
                showToast('Error', 'Failed to add product to cart');
            }
        }
    });
});

function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-warning"></i>';
        }
    }
    return stars;
}

async function loadProductDetails(productId) {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        const product = data.products.find(p => p.id === parseInt(productId));
        
        if (!product) {
            window.location.href = 'products.html';
            return;
        }

        window.currentProduct = product;

        // Update page title and breadcrumb
        document.title = `${product.name} - E-Commerce`;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('productTitle').textContent = product.name;

        // Update price information
        document.getElementById('productPrice').textContent = `₹${product.price.toFixed(2)}`;
        const mrp = product.price * 1.15; // 15% markup for MRP
        document.getElementById('productMRP').textContent = `₹${mrp.toFixed(2)}`;

        // Update rating and description
        const ratingElement = document.getElementById('productRating');
        ratingElement.innerHTML = generateStarRating(product.rating);
        document.getElementById('ratingCount').textContent = `(${product.stock} reviews)`;
        document.getElementById('productDescription').textContent = product.description;

        // Update product image
        const carouselInner = document.querySelector('.carousel-inner');
        carouselInner.innerHTML = `
            <div class="carousel-item active">
                <img src="${product.image}" class="d-block w-100" alt="${product.name}">
            </div>`;

        // Update specifications
        const specs = {
            'Category': product.category,
            'Rating': `${product.rating}/5`,
            'Stock': `${product.stock} units`,
            'Price': `₹${product.price.toFixed(2)}`
        };

        const specsTable = document.getElementById('productSpecs');
        if (specsTable) {
            specsTable.innerHTML = Object.entries(specs)
                .map(([key, value]) => `
                    <tr>
                        <th>${key}</th>
                        <td>${value}</td>
                    </tr>
                `).join('');
        }

        // Update features list
        const featuresList = document.getElementById('productFeatures');
        if (featuresList) {
            const features = [
                `Category: ${product.category}`,
                `Rating: ${product.rating}/5 stars`,
                `Stock: ${product.stock} units available`
            ];
            featuresList.innerHTML = features
                .map(feature => `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`)
                .join('');
        }

    } catch (error) {
        console.error('Error loading product details:', error);
        document.getElementById('productDescription').textContent = 
            'Error loading product details. Please try again later.';
    }
}