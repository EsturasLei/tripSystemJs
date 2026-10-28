const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/', asyncHandler(driverController.createDriver));
router.get('/', asyncHandler(driverController.getAllDrivers));

router.put('/:id', asyncHandler(driverController.updateDriver));
router.delete('/:id', asyncHandler(driverController.deleteDriver));

module.exports = router;