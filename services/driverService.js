const DriverRepository = require('../repositories/driverRepository')

class DriverService {
    static async registerDriver(name, licenseNumber){
        if(!name || !licenseNumber ){
            throw new Error("Missing Required Driver enrollment criteria");
            
        }
        return await DriverRepository.create(name,licenseNumber)
    }
    static async getAllDrivers(){
        return await DriverRepository.findAll();


    }

    async updateDriver(id, name, licenseNumber){
        if (!id || !name || !licenseNumber) {
            throw new Error("Missing tracking ID or update criteria");
        }
        
        const driverExists = await DriverRepository.findById(id);
        if(!driverExists){
            const error = new Error('Driver not found');
            error.statusCode = 404;
            throw error;

        }
        return await driverRepository.update(id, name, licenseNumber);

    }
    async deleteDriver(id) {
        const driverExists = await driverRepository.findById(id);
        if(!driverExists){
            const error = new Error('driver not found');
            error.statusCode = 404;
            throw error;

        }
        return await driverRepository.delete(id);

    }
}

module.exports = DriverService;