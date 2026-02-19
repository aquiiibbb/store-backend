const express = require('express');
const router = express.Router();
const { createReservation6 } = require('../controller/un5');
// POST /api/reservations - Create new reservation
router.post('/', createReservation6);


module.exports = router;