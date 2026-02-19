const express = require('express');
const router = express.Router();
const { createReservation2 } = require('../controller/un1');
// POST /api/reservations - Create new reservation
router.post('/', createReservation2);


module.exports = router;