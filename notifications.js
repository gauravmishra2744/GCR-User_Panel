// Notifications functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sample notifications data - in a real app, this would come from an API
    const notifications = [
        {
            id: 1,
            type: 'order',
            title: 'Order Shipped',
            message: 'Your order #12345 has been shipped and will arrive in 2-3 business days.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            isRead: false,
            icon: 'fa-box'
        },
        {
            id: 2,
            type: 'promotion',
            title: 'Flash Sale!',
            message: 'Don\'t miss out on our 24-hour flash sale. Up to 70% off on selected items.',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            isRead: true,
            icon: 'fa-tag'
        },
        {
            id: 3,
            type: 'account',
            title: 'Security Alert',
            message: 'New login detected from a different device. Please verify if this was you.',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            isRead: false,
            icon: 'fa-shield-alt'
        }
    ];

    function updateNotificationCount() {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        const countElement = document.querySelector('.notification-count');
        if (countElement) {
            countElement.textContent = unreadCount;
            countElement.style.display = unreadCount > 0 ? 'inline' : 'none';
        }
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) { // less than 1 minute
            return 'Just now';
        } else if (diff < 3600000) { // less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diff < 86400000) { // less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    function renderNotifications() {
        const container = document.querySelector('.notifications-list');
        if (!container) return;

        container.innerHTML = notifications.length === 0 
            ? '<div class="alert alert-info">No notifications to display</div>'
            : notifications.map(notification => `
                <div class="card mb-3 ${notification.isRead ? 'bg-light' : ''}" data-id="${notification.id}">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="notification-icon me-3">
                                <i class="fas ${notification.icon} fa-lg ${notification.isRead ? 'text-muted' : 'text-primary'}"></i>
                            </div>
                            <div class="notification-content flex-grow-1">
                                <h5 class="card-title mb-1">${notification.title}</h5>
                                <p class="card-text mb-1">${notification.message}</p>
                                <small class="text-muted">${formatTime(notification.timestamp)}</small>
                            </div>
                            <div class="notification-actions">
                                ${!notification.isRead ? 
                                    `<button class="btn btn-sm btn-outline-primary mark-read-btn">
                                        Mark as read
                                    </button>` : 
                                    ''
                                }
                                <button class="btn btn-sm btn-link text-danger delete-notification-btn">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

        // Add event listeners
        container.querySelectorAll('.mark-read-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const card = e.target.closest('.card');
                const notificationId = parseInt(card.dataset.id);
                markAsRead(notificationId);
            });
        });

        container.querySelectorAll('.delete-notification-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const card = e.target.closest('.card');
                const notificationId = parseInt(card.dataset.id);
                deleteNotification(notificationId);
            });
        });

        updateNotificationCount();
    }

    function markAsRead(notificationId) {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            renderNotifications();
        }
    }

    function deleteNotification(notificationId) {
        const index = notifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
            notifications.splice(index, 1);
            renderNotifications();
        }
    }

    // Initialize the notifications
    renderNotifications();
});