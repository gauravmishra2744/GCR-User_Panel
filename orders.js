// Orders page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    setupFilters();
    setupSearch();
    setupLogout();
});

function loadOrders() {
    // Simulated orders data - replace with actual API call
    const orders = [
        {
            id: '12345',
            date: '2023-08-15',
            total: 129.99, // Original USD amount for server communication
            status: 'delivered',
            items: [
                { name: 'Wireless Headphones', quantity: 1, price: 79.99 },
                { name: 'Phone Case', quantity: 2, price: 25.00 }
            ]
        },
        // Add more orders as needed
    ];

    updateOrdersList(orders);
}

function updateOrdersList(orders) {
    const ordersContainer = document.getElementById('ordersList');
    ordersContainer.innerHTML = orders.map(order => `
        <div class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-muted">Order placed</small>
                    <div>${new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div>
                    <small class="text-muted">Total</small>
                    <div>₹${(order.total * 83.12).toFixed(2)}</div>
                </div>
                <div>
                    <small class="text-muted">Order #</small>
                    <div>${order.id}</div>
                </div>
                <div>
                    <span class="badge bg-${getStatusBadgeClass(order.status)}">${order.status}</span>
                </div>
            </div>
            <div class="card-body">
                ${order.items.map(item => `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>${item.name} × ${item.quantity}</div>
                        <div>$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="card-footer">
                <button class="btn btn-sm btn-outline-primary me-2">Track Package</button>
                <button class="btn btn-sm btn-outline-secondary me-2">View Invoice</button>
                <button class="btn btn-sm btn-outline-success">Buy Again</button>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    document.getElementById('orderTimeFilter').addEventListener('change', filterOrders);
    document.getElementById('orderStatus').addEventListener('change', filterOrders);
}

function setupSearch() {
    document.getElementById('orderSearch').addEventListener('input', filterOrders);
}

function filterOrders() {
    const timeFilter = document.getElementById('orderTimeFilter').value;
    const statusFilter = document.getElementById('orderStatus').value;
    const searchQuery = document.getElementById('orderSearch').value.toLowerCase();

    // Implement filtering logic here
    loadOrders(); // Reload and filter orders
}

function getStatusBadgeClass(status) {
    switch(status.toLowerCase()) {
        case 'processing': return 'warning';
        case 'shipped': return 'info';
        case 'delivered': return 'success';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

function setupLogout() {
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        // Implement logout logic here
        window.location.href = 'login.html';
    });
}