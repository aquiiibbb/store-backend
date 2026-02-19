const express = require('express');
const router = express.Router();
const { createReservation4 } = require('../controller/un3');
// POST /api/reservations - Create new reservation
router.post('/', createReservation4);


module.exports = router;