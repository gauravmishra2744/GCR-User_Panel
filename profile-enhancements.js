document.addEventListener('DOMContentLoaded', function() {
    // Add progress indicators for profile completion
    setupProfileProgress();
    
    // Enable profile picture upload
    setupProfilePicture();
    
    // Add search functionality
    setupProfileSearch();
});

function setupProfileProgress() {
    const completionStatus = calculateProfileCompletion();
    const profileHeader = document.querySelector('#profile-info h2');
    
    if (profileHeader) {
        profileHeader.insertAdjacentHTML('afterend', `
            <div class="profile-completion my-4">
                <h6>Profile Completion: ${completionStatus}%</h6>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${completionStatus}%" 
                         aria-valuenow="${completionStatus}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        `);
    }
}

function calculateProfileCompletion() {
    const fields = ['fullName', 'email', 'phone', 'address'];
    let completed = 0;
    
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input && input.value.trim()) {
            completed++;
        }
    });
    
    return Math.round((completed / fields.length) * 100);
}

function setupProfilePicture() {
    const avatarInput = document.getElementById('avatarInput');
    const avatarImage = document.getElementById('profileAvatar');
    const avatarWrapper = document.querySelector('.profile-avatar-wrapper');
    
    if (avatarWrapper) {
        avatarWrapper.addEventListener('click', () => avatarInput.click());
    }
    
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    avatarImage.src = e.target.result;
                    showToast('Profile picture updated successfully!');
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

function setupProfileSearch() {
    const searchInput = document.getElementById('profileSearch');
    if (!searchInput) return;
    
    let debounceTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = this.value.toLowerCase();
            
            // Search orders
            const orders = document.querySelectorAll('.order-item');
            orders.forEach(order => {
                const orderText = order.textContent.toLowerCase();
                order.style.display = orderText.includes(searchTerm) ? '' : 'none';
            });
            
            // Search wishlist items
            const wishlistItems = document.querySelectorAll('.wishlist-item');
            wishlistItems.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                item.style.display = itemText.includes(searchTerm) ? '' : 'none';
            });
            
            // Animate searched items
            const visibleItems = document.querySelectorAll('.order-item:not([style*="none"]), .wishlist-item:not([style*="none"])');
            visibleItems.forEach((item, index) => {
                item.style.animation = `fadeIn 0.3s ease-out forwards ${index * 0.1}s`;
            });
        }, 300);
    });
}

// Add interaction animations to form inputs
document.querySelectorAll('.profile-form input, .profile-form textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.closest('.form-group').classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.closest('.form-group').classList.remove('focused');
        }
    });
});

// Add save indication with loading state
function saveChanges(message = 'Changes saved successfully!') {
    const saveBtn = document.querySelector('.save-btn');
    if (!saveBtn) return;
    
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
    
    // Simulate save operation
    setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        showToast(message);
        updateProfileCompletion();
    }, 1500);
}

function updateProfileCompletion() {
    const completionStatus = calculateProfileCompletion();
    const progressBar = document.querySelector('.profile-completion .progress-bar');
    if (progressBar) {
        progressBar.style.width = `${completionStatus}%`;
        progressBar.setAttribute('aria-valuenow', completionStatus);
        
        // Animate the progress update
        progressBar.style.transition = 'width 0.6s ease-in-out';
    }
}