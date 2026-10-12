const prisma = require('../db/prisma');

class UserRepository {
    static async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    static async create(userData) {
        return prisma.user.create({
            data: userData
        });
    }
}

module.exports = UserRepository;