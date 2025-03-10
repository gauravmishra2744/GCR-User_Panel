document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to profile sections
    const profileSections = document.querySelectorAll('.profile-section');
    profileSections.forEach(section => {
        section.classList.add('animated-section');
    });

    // Add smooth transitions between sections
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all sections and menu items
            document.querySelectorAll('.profile-section').forEach(section => {
                section.classList.remove('active');
                section.classList.add('hidden');
            });
            document.querySelectorAll('.menu-item').forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            
            // Add active class to clicked menu item and target section
            this.classList.add('active');
            const section = document.getElementById(targetSection);
            if (section) {
                setTimeout(() => {
                    section.classList.remove('hidden');
                    section.classList.add('active');
                }, 300);
            }
        });
    });

    // Add loading animation when saving
    const saveBtns = document.querySelectorAll('.save-btn');
    saveBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
            setTimeout(() => {
                this.innerHTML = originalText;
                showToast('Changes saved successfully!');
            }, 1500);
        });
    });

    // Add toast notification system
    function showToast(message) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">Notification</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        toastContainer.appendChild(toast);
        document.body.appendChild(toastContainer);
        
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                document.body.removeChild(toastContainer);
            }, 300);
        }, 3000);
    }

    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});