const DriverService = require('../services/driverService');

exports.createDriver = async (req,res) => {
    const {name, licenseNumber } = req.body;

    const newDriver = await DriverService.registerDriver(name,licenseNumber);

    res.status(201).json({
        success: true,
        message: `Driver added successfully`,
        data:newDriver}
    );

};
exports.getAllDrivers = async (req,res) => {
    const drivers = await DriverService.getAllDrivers();
    res.status(200).json(drivers);
};

exports.updateDriver = async (req, res) =>{
    const { id } = req.params;
    const { name, licenseNumber } = req.body;
    const updatedDriver = await DriverService.updateDriver(id, name, licenseNumber);
    res.status(200).json({
        success: true,
        message: `Driver Updated Successfully`,
        data: updatedDriver});
};

exports.deleteDriver = async (req,res) => { 
    const { id } = req.params;
    const deletedDriver = await DriverService.deleteDriver(id);
    res.status(200).json({
        success: true,
        message: `Driver with ID ${id} deleted successfully`,
        data: deletedDriver
    });
        

};