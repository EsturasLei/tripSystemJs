
const AuthService = require('../services/authService');

class AuthController {
    static async register(req, res) {
        try {
            const user = await AuthService.register(req.body);

            return res.status(201).json({
                message: 'User registered successfully.',
                user
            });
        } catch (error) {
            if (error.message === 'Email is already registered.') {
                return res.status(409).json({
                    message: error.message
                });
            }

            if (    
                error.message === 'Name, email, and password are required.' ||
                error.message === 'Name and email cannot be empty.' ||
                error.message === 'Password must be at least 8 characters.'
            ) {
                return res.status(400).json({
                    message: error.message
                });
            }

            console.error('Registration error:', error);

            return res.status(500).json({
                message: 'An unexpected error occurred.'
            });
        }
    }
    
static async login(req, res) {
    try {
       
        const user = await AuthService.login(req.body);

        // Store only the necessary user information in the session.
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        // Wait until the session is saved before responding.
        req.session.save((error) => {
            if (error) {
                console.error('Session save error:', error);

                return res.status(500).json({
                    message: 'Could not create login session.'
                });
            }

            return res.status(200).json({
                message: 'Login successful.',
                user: req.session.user
            });
        });

    } catch (error) {
        if (
            error.message === 'Email and password are required.' ||
            error.message === 'Invalid email or password.'
        ) {
            const status =
                error.message === 'Invalid email or password.'
                    ? 401
                    : 400;

            return res.status(status).json({
                message: error.message
            });
        }

        console.error('Login error:', error);

        return res.status(500).json({
            message: 'An unexpected error occurred.'
        });
    }
}

static async me(req, res) {
    if (!req.session.user) {
        return res.status(401).json({
            message: 'You are not logged in.'
        });
    }

    return res.status(200).json({
        user: req.session.user
    });
}


static async logout(req, res) {
    req.session.destroy((error) => {
        if (error) {
            console.error('Logout error:', error);

            return res.status(500).json({
                message: 'Could not log out.'
            });
        }

        res.clearCookie('trip.sid', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });

        return res.status(200).json({
            message: 'Logged out successfully.'
        });
    });
}



}

module.exports = AuthController;
