const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/', asyncHandler(vehicleController.createVehicle));
router.get('/', asyncHandler(vehicleController.getAllVehicle));

router.put('/:id', asyncHandler(vehicleController.updateVehicle));
router.delete('/:id', asyncHandler(vehicleController.deleteVehicle));

module.exports = router;