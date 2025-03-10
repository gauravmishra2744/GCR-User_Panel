// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // In a real application, this would be an API call
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Store user session (in a real app, this would be a token)
            const sessionUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            localStorage.setItem('user', JSON.stringify(sessionUser));
            
            // Redirect to home page
            window.location.href = 'index.html';
        } else {
            alert('Invalid email or password');
        }
    });
});