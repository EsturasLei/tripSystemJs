const VehicleService = require('../services/vehicleService');

exports.createVehicle = async (req,res) => {
    const { plateNumber,brand,model,status } = req.body;

    const newVehicle = await VehicleService.addVehicle(plateNumber,brand,model,status);
    
    res.status(201).json({
        success: true,
        message: `Vehicle added successfully`,
        data: newVehicle
    });
};

exports.getAllVehicle = async (req,res) => {
    const Vehicle = await VehicleService.getAllVehicle();
    res.status(200).json(Vehicle);
};

exports.updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { plateNumber, brand, model, status } = req.body;
    const updatedVehicle = await VehicleService.updateVehicle(id, plateNumber,brand, model,status);
    res.status(200).json({
        success: true,
        message: `Vehicle Updated Successfully`,
        data: updatedVehicle
    });
};
exports.deleteVehicle = async (req, res) => {
    const { id } = req.params;
    const deletedVehicle = await VehicleService.deleteVehicle(id);
    res.status(200).json({
        success: true,
        message: `Vehicle with ID ${id} deleted successfully`,
        data: deletedVehicle
    });



};

