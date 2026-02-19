const express = require('express');
const router = express.Router();
const { createReservation1 } = require('../controller/controlles1');
// POST /api/reservations - Create new reservation
router.post('/', createReservation1);


module.exports = router;