
const prisma = require('../db/prisma');

class DriverRepository {
    static async create(name, licenseNumber) {
        return await prisma.drivers.create({
            data: {
                name: name,
                license_number: licenseNumber
            }
        });
    }

    static async findAll() {
        return await prisma.drivers.findMany({
            orderBy: {
                id: 'desc'
            }
        });
    }

    static async findById(id) {
        return await prisma.drivers.findUnique({
            where: {
                id: Number(id)
            }
        });
    }

    static async update(id, name, licenseNumber) {
        return await prisma.drivers.update({
            where: {
                id: Number(id)
            },
            data: {
                name: name,
                license_number: licenseNumber
            }
        });
    }

    static async delete(id) {
        return await prisma.drivers.delete({
            where: {
                id: Number(id)
            }
        });
    }
}

module.exports = DriverRepository;
