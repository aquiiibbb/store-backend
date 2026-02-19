const express = require('express');
const router = express.Router();
const { createReservation5 } = require('../controller/un4');
// POST /api/reservations - Create new reservation
router.post('/', createReservation5);


module.exports = router;