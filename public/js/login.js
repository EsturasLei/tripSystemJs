
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');
const loginButton = document.getElementById('loginButton');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    message.textContent = '';

    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed.');
        }

        message.textContent = `Welcome back, ${data.user.name}!`;

        console.log('Logged-in user:', data.user);
    } catch (error) {
        message.textContent =
            error.message || 'Could not connect to the server.';
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Log in';
    }
});
