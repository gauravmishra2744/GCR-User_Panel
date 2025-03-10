// Registration functionality
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // In a real application, this would be an API call
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
            alert('Email already registered');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password // In a real app, this would be hashed
        };

        // Add to users array
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login
        const sessionUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };
        localStorage.setItem('user', JSON.stringify(sessionUser));

        // Redirect to home page
        window.location.href = 'index.html';
    });
});