const prisma = require("../db/prisma");

class RequestRepository {
    static async create(data) {
        return prisma.tripRequest.create({
            data: {
                requestor: data.requestor,
                date: new Date(data.date),
                timeStart: data.timeStart,
                timeEnd: data.timeEnd,
                purpose: data.purpose,
                passengers: {
                    create: data.passengers.map((passenger) => ({
                        name: passenger.name
                    }))
                }
            },
            include: {
                passengers: true
            }
        });
    }

    static async findAll() {
        return prisma.tripRequest.findMany({
            include: {
                passengers: true
            },
            orderBy: {
                id: "desc"
            }
        });
    }

    static async findById(id) {
        return prisma.tripRequest.findUnique({
            where: { id: Number(id) },
            include: {
                passengers: true
            }
        });
    }

    static async update(id, data) {
        return prisma.tripRequest.update({
            where: { id: Number(id) },
            data: {
                requestor: data.requestor,
                date: new Date(data.date),
                timeStart: data.timeStart,
                timeEnd: data.timeEnd,
                purpose: data.purpose,
                passengers: {
                    deleteMany: {},
                    create: data.passengers.map((passenger) => ({
                        name: passenger.name
                    }))
                }
            },
            include: {
                passengers: true
            }
        });
    }

    static async delete(id) {
        return prisma.tripRequest.delete({
            where: { id: Number(id) }
        });
    }
}

module.exports = RequestRepository;