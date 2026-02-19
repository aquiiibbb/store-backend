const express = require('express');
const router = express.Router();
const { createReservation } = require('../controller/controlles');
// POST /api/reservations - Create new reservation
router.post('/', createReservation);


module.exports = router;