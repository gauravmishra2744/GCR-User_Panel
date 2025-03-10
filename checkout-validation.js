// Checkout form validation and enhancement
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.querySelector('#checkout-form');
    if (!checkoutForm) return;

    // Add validation handlers
    setupFormValidation();
    
    // Load saved address if available
    loadSavedAddress();
    
    // Handle form submission
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
});

function setupFormValidation() {
    const form = document.querySelector('#checkout-form');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => validateField(input));
    });
}

function validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (input.id) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            errorMessage = 'Please enter a valid email address';
            break;
            
        case 'phone':
            const phoneRegex = /^[0-9]{10}$/;
            isValid = phoneRegex.test(value);
            errorMessage = 'Please enter a valid 10-digit phone number';
            break;
            
        case 'pincode':
            const pincodeRegex = /^[0-9]{6}$/;
            isValid = pincodeRegex.test(value);
            errorMessage = 'Please enter a valid 6-digit pincode';
            break;
            
        default:
            isValid = value.length > 0;
            errorMessage = 'This field is required';
    }
    
    const errorElement = input.nextElementSibling;
    if (!isValid && value.length > 0) {
        input.classList.add('is-invalid');
        if (errorElement) errorElement.textContent = errorMessage;
    } else {
        input.classList.remove('is-invalid');
        if (errorElement) errorElement.textContent = '';
    }
    
    return isValid;
}

function loadSavedAddress() {
    const savedAddress = localStorage.getItem('savedAddress');
    if (savedAddress) {
        const address = JSON.parse(savedAddress);
        Object.keys(address).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = address[key];
        });
    }
}

async function handleCheckoutSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    // Validate all fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        ToastManager.show('Error', 'Please fill in all required fields correctly', { type: 'error' });
        return;
    }
    
    // Save address if checkbox is checked
    const saveAddress = document.getElementById('save-address').checked;
    if (saveAddress) {
        const addressData = {};
        inputs.forEach(input => {
            addressData[input.id] = input.value;
        });
        localStorage.setItem('savedAddress', JSON.stringify(addressData));
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Redirect to success page
        window.location.href = 'order-success.html';
    } catch (error) {
        console.error('Checkout error:', error);
        ToastManager.show('Error', 'Failed to process checkout. Please try again.', { type: 'error' });
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}