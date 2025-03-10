// Product Comparison Module
let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    initializeCompare();
    setupCompareButton();
});

function initializeCompare() {
    // Add compare button to each product card
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.dataset.productId;
        const compareBtn = document.createElement('button');
        compareBtn.className = 'btn btn-sm btn-outline-secondary compare-btn';
        compareBtn.innerHTML = '<i class="fas fa-exchange-alt"></i>';
        compareBtn.onclick = () => toggleCompare(productId);
        card.querySelector('.product-overlay .d-flex').appendChild(compareBtn);
    });

    // Create compare floating button if not exists
    if (!document.getElementById('compareFloat')) {
        const compareFloat = document.createElement('div');
        compareFloat.id = 'compareFloat';
        compareFloat.className = 'compare-float';
        compareFloat.innerHTML = `
            <button class="btn btn-primary rounded-circle" onclick="showCompareModal()">
                <i class="fas fa-exchange-alt"></i>
                <span class="badge bg-danger compare-count">0</span>
            </button>
        `;
        document.body.appendChild(compareFloat);
    }

    updateCompareCount();
}

function toggleCompare(productId) {
    const index = compareList.indexOf(productId);
    if (index === -1) {
        if (compareList.length >= 4) {
            showToast('You can compare up to 4 products', 'warning');
            return;
        }
        compareList.push(productId);
        showToast('Product added to comparison');
    } else {
        compareList.splice(index, 1);
        showToast('Product removed from comparison');
    }
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareCount();
}

function updateCompareCount() {
    const count = compareList.length;
    document.querySelector('.compare-count').textContent = count;
    document.getElementById('compareFloat').style.display = count > 0 ? 'block' : 'none';
}

async function showCompareModal() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        const productsToCompare = compareList.map(id => 
            data.products.find(p => p.id.toString() === id.toString())
        ).filter(Boolean);

        // Create modal if it doesn't exist
        if (!document.getElementById('compareModal')) {
            const modalHTML = `
                <div class="modal fade" id="compareModal" tabindex="-1">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Compare Products</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div id="compareTable"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        // Generate comparison table
        const compareTable = document.getElementById('compareTable');
        compareTable.innerHTML = `
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th style="width: 150px">Feature</th>
                            ${productsToCompare.map(product => `
                                <th>
                                    <div class="text-center">
                                        <img src="${product.image}" alt="${product.name}" class="img-fluid mb-2" style="max-height: 100px">
                                        <h6>${product.name}</h6>
                                        <div class="text-primary mb-2">₹${product.price.toFixed(2)}</div>
                                        <button class="btn btn-sm btn-primary mb-2" onclick="addToCart(${product.id})">Add to Cart</button>
                                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCompare(${product.id})">Remove</button>
                                    </div>
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Rating</td>
                            ${productsToCompare.map(product => `
                                <td class="text-center">
                                    <div class="text-warning">
                                        ${generateStarRating(product.rating)}
                                    </div>
                                </td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td>Category</td>
                            ${productsToCompare.map(product => `
                                <td class="text-center text-capitalize">${product.category}</td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td>Stock</td>
                            ${productsToCompare.map(product => `
                                <td class="text-center">
                                    <span class="badge bg-${product.stock > 20 ? 'success' : 'warning'}">
                                        ${product.stock > 20 ? 'In Stock' : `${product.stock} left`}
                                    </span>
                                </td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td>Features</td>
                            ${productsToCompare.map(product => `
                                <td>
                                    <ul class="list-unstyled mb-0">
                                        ${product.features.map(feature => `
                                            <li><i class="fas fa-check text-success me-2"></i>${feature}</li>
                                        `).join('')}
                                    </ul>
                                </td>
                            `).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        // Show modal
        new bootstrap.Modal(document.getElementById('compareModal')).show();
    } catch (error) {
        console.error('Error loading comparison:', error);
        showToast('Error loading comparison', 'error');
    }
}

function removeFromCompare(productId) {
    toggleCompare(productId);
    if (compareList.length === 0) {
        bootstrap.Modal.getInstance(document.getElementById('compareModal')).hide();
    } else {
        showCompareModal();
    }
}

// CSS styles for compare float button
const style = document.createElement('style');
style.textContent = `
    .compare-float {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        display: none;
    }
    .compare-float .btn {
        width: 60px;
        height: 60px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .compare-float .compare-count {
        position: absolute;
        top: -5px;
        right: -5px;
    }
`;
document.head.appendChild(style);