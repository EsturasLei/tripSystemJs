
const prisma = require('../db/prisma');

class VehicleRepository {
    static async createVehicle(plateNumber, brand, model, status) {
        return await prisma.vehicles.create({
            data: {
                plate_number: plateNumber,
                brand: brand,
                model: model,
                status: status
            }
        });
    }

    static async findAll() {
        return await prisma.vehicles.findMany({
            orderBy: {
                id: 'desc'
            }
        });
    }

    static async findById(id) {
        return await prisma.vehicles.findUnique({
            where: {
                id: Number(id)
            }
        });
    }

    static async update(id, plateNumber, brand, model, status) {
        return await prisma.vehicles.update({
            where: {
                id: Number(id)
            },
            data: {
                plate_number: plateNumber,
                brand: brand,
                model: model,
                status: status
            }
        });
    }

    static async delete(id) {
        return await prisma.vehicles.delete({
            where: {
                id: Number(id)
            }
        });
    }
}

module.exports = VehicleRepository;
