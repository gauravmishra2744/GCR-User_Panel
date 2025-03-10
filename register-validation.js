// Password strength and validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const strengthBar = document.querySelector('.password-strength-bar');

    // Toggle password visibility
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Password strength indicator
    password.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);
        updateStrengthBar(strength);
    });

    // Form validation
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!this.checkValidity()) {
            event.stopPropagation();
        } else if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity('Passwords do not match');
        } else {
            // Form is valid, proceed with registration
            confirmPassword.setCustomValidity('');
            // Add your registration logic here
            console.log('Form is valid, proceeding with registration...');
        }

        this.classList.add('was-validated');
    });

    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 25;
        
        // Contains number
        if (/\d/.test(password)) strength += 25;
        
        // Contains letter
        if (/[a-zA-Z]/.test(password)) strength += 25;
        
        // Contains special character
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        
        return strength;
    }

    function updateStrengthBar(strength) {
        strengthBar.style.width = strength + '%';
        
        if (strength <= 25) {
            strengthBar.style.backgroundColor = '#dc3545';
        } else if (strength <= 50) {
            strengthBar.style.backgroundColor = '#ffc107';
        } else if (strength <= 75) {
            strengthBar.style.backgroundColor = '#0dcaf0';
        } else {
            strengthBar.style.backgroundColor = '#198754';
        }
    }
});