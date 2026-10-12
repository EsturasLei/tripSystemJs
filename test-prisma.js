
require('dotenv').config();

const prisma = require('./db/prisma');

async function main() {
    await prisma.$connect();
    console.log('Prisma connected successfully!');

    const vehicles = await prisma.vehicles.findMany();
    console.log('Vehicles:', vehicles);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
