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

    static async updateDriver(id, name, licenseNumber){
        if (!id || !name || !licenseNumber) {
            throw new Error("Missing tracking ID or update criteria");
        }
        
        const driverExists = await DriverRepository.findById(id);
        if(!driverExists){
            const error = new Error('Driver not found');
            error.statusCode = 404;
            throw error;

        }
        return await DriverRepository.update(id, name, licenseNumber);

    }
    static async deleteDriver(id) {
        const driverExists = await DriverRepository.findById(id);
        if(!driverExists){
            const error = new Error('driver not found');
            error.statusCode = 404;
            throw error;

        }
        return await DriverRepository.delete(id);

    }
}

module.exports = DriverService;