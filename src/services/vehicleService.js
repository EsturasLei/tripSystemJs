const VehicleRepository = require('../repositories/vehicleRepository');

class VehicleService {
    static async addVehicle(plateNumber,brand,model,status){
        if(!plateNumber || !brand || !model || !status){
            throw new Error("Missing Required Vehicle enrollment criteria")
        }
        return await VehicleRepository.createVehicle(plateNumber,brand,model,status)

    }
    static async getAllVehicle(){
        return await VehicleRepository.findAll();
    }

    //-----------
     static async updateVehicle(id,plateNumber,brand,model, status){
        if (!id || !plateNumber || !brand || !model || !status) {
            throw new Error("Missing tracking ID or update criteria");
        }
        
        const vehicleExists = await VehicleRepository.findById(id);
        if(!vehicleExists){
            const error = new Error('Vehicle not found');
            error.statusCode = 404;
            throw error;

        }
        return await VehicleRepository.update(id,plateNumber,brand,model, status);

    }
    static async deleteVehicle(id) {
        const vehicleExists = await VehicleRepository.findById(id);
        if(!vehicleExists){
            const error = new Error('Vehicle not found');
            error.statusCode = 404;
            throw error;

        }
        return await VehicleRepository.delete(id);

    }


}

module.exports = VehicleService;