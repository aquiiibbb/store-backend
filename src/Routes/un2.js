const express = require('express');
const router = express.Router();
const { createReservation3 } = require('../controller/un2');
// POST /api/reservations - Create new reservation
router.post('/', createReservation3);


module.exports = router;