const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/', asyncHandler(driverController.createDriver));
router.get('/', asyncHandler(driverController.getAllDrivers));

module.exports = router;