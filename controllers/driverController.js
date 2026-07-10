const DriverService = require('../services/driverService');

exports.createDriver = async (req,res) => {
    const {name, licenseNumber } = req.body;

    const newDriver = await DriverService.registerDriver(name,licenseNumber);

    res.status(201).json(newDriver);


};

exports.getAllDrivers = async (req,res) => {
    const drivers = await DriverService.getAllDrivers();
    res.status(200).json(drivers);
};