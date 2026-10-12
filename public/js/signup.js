
const signupForm = document.getElementById('signupForm');
const message = document.getElementById('message');
const signupButton = document.getElementById('signupButton');

signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword =
        document.getElementById('confirmPassword').value;

    message.textContent = '';

    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match.';
        return;
    }

    signupButton.disabled = true;
    signupButton.textContent = 'Creating account...';

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const text = await response.text();

        console.log('Status:', response.status);
        console.log('Response:', text);

        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed.');
        }

        message.textContent =
            'Account created successfully! You can now log in.';

        signupForm.reset();
    } catch (error) {
        message.textContent =
            error.message || 'Could not connect to the server.';
    } finally {
        signupButton.disabled = false;
        signupButton.textContent = 'Create account';
    }
});
