
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/userRepository');

class AuthService {
    static async register({ name, email, password }) {
        // 1. Validate required fields
        if (!name || !email || !password) {
            throw new Error('Name, email, and password are required.');
        }

        // 2. Normalize user input
        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedName || !normalizedEmail) {
            throw new Error('Name and email cannot be empty.');
        }

        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters.');
        }

        // 3. Check whether the email is already registered
        const existingUser =
            await UserRepository.findByEmail(normalizedEmail);

        if (existingUser) {
            throw new Error('Email is already registered.');
        }

        // 4. Hash the password before storing it
        const passwordHash = await bcrypt.hash(password, 12);

        // 5. Create a regular user
        const user = await UserRepository.create({
            name: normalizedName,
            email: normalizedEmail,
            passwordHash,
            role: 'USER'
        });

        // 6. Never return the password hash
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
    }

    
static async login({ email, password }) {
    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() ||
        !password
    ) {
        throw new Error('Email and password are required.');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await UserRepository.findByEmail(normalizedEmail);

    if (!user) {
        throw new Error('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordMatches) {
        throw new Error('Invalid email or password.');
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
}

}

module.exports = AuthService;
