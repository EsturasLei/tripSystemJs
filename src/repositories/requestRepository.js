const prisma = require("../db/prisma");

class RequestRepository {
    static async create(data,userId) {
        return prisma.tripRequest.create({
            data: {
                requestor: data.requestor,
                date: new Date(data.date),
                timeStart: data.timeStart,
                timeEnd: data.timeEnd,
                purpose: data.purpose,

                userId: userId,
                
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

    // This tells Prisma to retrieve only trip requests whose userId matches the logged-in user.

    // For example, if user ID 1 is logged in, requests belonging to user ID 2 and older requests with userId: null won't be returned.
    
    static async findAll(userId, role) {
        return prisma.tripRequest.findMany({
            where: {
                ...(role === "ADMIN" ? {} : { userId })
            },
            include: {
                passengers: true
            },
            orderBy: {
                id: "desc"
            }
        });
    }

    static async findById(id, userId, role) {
        return prisma.tripRequest.findFirst({
            where: { id: Number(id),
                     ...(role === "ADMIN" ? {} : { userId })
             },
            include: {
                passengers: true
            }
        });
    }

    static async update(id, data, userId, role) {
         console.log("UPDATE DEBUG:", {
            id,
            userId,
            role
        });
        const existingRequest = await prisma.tripRequest.findFirst({
            where: {
                id: Number(id),
                ...(role === "ADMIN" ? {} : {userId})
            }
        });
         console.log("REQUEST FOUND:", existingRequest?.id ?? null);

        if (!existingRequest){
            return null;
        }

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

    static async delete(id, userId, role) {
        const result = await prisma.tripRequest.deleteMany({
            where: { id: Number(id),
                     ...(role === "ADMIN" ? {} : {userId})}
        });

        if (result.count === 0) {
            return null;
        }
        return result;
    }
}

module.exports = RequestRepository;